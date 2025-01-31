import { useState, useEffect, useRef } from "react";

const track = {
  name: "",
  album: {
    images: [{ url: "" }],
  },
  artists: [{ name: "" }],
};

function WebPlayback() {
  const token = localStorage.getItem("token");
  const [is_paused, setPaused] = useState(false);
  const [is_active, setActive] = useState(false);
  const [current_track, setTrack] = useState(track);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    // Cleanup function
    const cleanup = () => {
      if (playerRef.current) {
        playerRef.current.disconnect();
        console.log("Player disconnected");
      }
      document.body.removeChild(script);
    };

    // @ts-ignore
    window.onSpotifyWebPlaybackSDKReady = () => {
      // @ts-ignore
      const player = new window.Spotify.Player({
        name: "Web Playback SDK",
        getOAuthToken: (cb: any) => cb(token),
        volume: 0.5,
      });

      playerRef.current = player;

      player.addListener("ready", ({ device_id }: { device_id: string }) => {
        console.log("Ready with Device ID", device_id);
        transferPlayback(device_id);
        playTrack();
      });

      player.addListener("player_state_changed", (state: any) => {
        if (!state) return;

        setTrack(state.track_window.current_track);
        setPaused(state.paused);
        setActive(true);
      });

      player.connect();
      playerRef.current = player;
    };

    document.body.appendChild(script);

    return () => {
      cleanup();
      // @ts-ignore
      window.onSpotifyWebPlaybackSDKReady = null;
    };
  }, []);

  const transferPlayback = (device_id: string) => {
    fetch("https://api.spotify.com/v1/me/player", {
      method: "PUT",
      body: JSON.stringify({
        device_ids: [device_id],
        play: true,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).catch((err) => console.error("Transfer error:", err));
  };

  const playTrack = () => {
    playerRef.current?.resume();
    setTimeout(() => {
      playerRef.current?.pause();
    }, 3000);
  };

  const playNextTrack = () => {
    playerRef.current?.pause();
    playerRef.current?.nextTrack();
    playerRef.current?.resume();
    setTimeout(() => {
      playerRef.current?.pause();
    }, 3000);
  };

  if (!is_active) {
    return (
      <>
        <div className="container">
          <div className="main-wrapper">
            <b>
              {" "}
              Instance not active. Transfer your playback using your Spotify app{" "}
            </b>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className="container">
          <div className="main-wrapper">
            <img
              src={current_track.album.images[0].url}
              className="now-playing__cover"
              alt=""
            />

            <div className="now-playing__side">
              <div className="now-playing__name">{current_track.name}</div>
              <div className="now-playing__artist">
                {current_track.artists[0].name}
              </div>

              <button
                className="btn-spotify"
                onClick={() => playerRef.current?.previousTrack()}
              >
                &lt;&lt;
              </button>

              <button
                className="btn-spotify"
                onClick={() => playerRef.current?.togglePlay()}
              >
                {is_paused ? "PLAY" : "PAUSE"}
              </button>

              <button className="btn-spotify" onClick={() => playNextTrack()}>
                &gt;&gt;
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default WebPlayback;
