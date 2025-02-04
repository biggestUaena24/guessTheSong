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
  const [is_active, setActive] = useState(false);
  const [current_track, setTrack] = useState(track);
  const [deviceId, setDeviceId] = useState("");
  const [trackUris, setTrackUris] = useState<string[]>([]);
  const [answerValue, setAnswerValue] = useState("");
  const playerRef = useRef<any>(null);
  const trackUrisRef = useRef<string[]>([]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

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
        setDeviceId(device_id);
        transferPlayback(device_id);
      });

      player.addListener("player_state_changed", (state: any) => {
        if (!state) return;
        setTrack(state.track_window.current_track);
        setActive(true);

        if (trackUrisRef.current.length === 0) {
          playerRef.current?.pause();
        }
      });

      player.connect();
    };

    document.body.appendChild(script);
    return () => {
      cleanup();
      // @ts-ignore
      window.onSpotifyWebPlaybackSDKReady = null;
    };
  }, []);

  useEffect(() => {
    async function getSavedLists() {
      try {
        const response = await fetch(
          "https://localhost:1314/spotify/saved_tracks",
          {
            method: "POST",
            credentials: "include",
          }
        );
        const json = await response.json();
        const uris = json.tracks.filter((uri: string) =>
          uri.includes("spotify:track:")
        );
        setTrackUris(uris);
        trackUrisRef.current = uris;
      } catch (error) {
        console.error("Error fetching saved tracks:", error);
      }
    }

    getSavedLists();
  }, []);

  useEffect(() => {
    if (deviceId && trackUris.length > 0) {
      playInitialTrack(trackUris, deviceId);
    }
  }, [deviceId, trackUris]);

  useEffect(() => {
    if (current_track && is_active) {
      const timer = setTimeout(() => {
        playerRef.current?.pause();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [current_track, is_active]);

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

  const playInitialTrack = (spotify_uri: string[], device_id: string) => {
    fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, {
      method: "PUT",
      body: JSON.stringify({ uris: spotify_uri.slice(0, 500) }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).catch((err) => console.error("Error playing track:", err));
  };

  const checkAnswer = () => {
    playerRef.current?.pause();
    if (answerValue.toLowerCase() === current_track.name.toLowerCase()) {
      console.log("Correct answer!");
    } else {
      console.log("Wrong answer. Correct song:", current_track.name);
    }
    playerRef.current?.nextTrack();
    setAnswerValue("");
  };

  if (!is_active || trackUris.length == 0) {
    return (
      <div className="container">
        <div className="main-wrapper">
          <b>Initializing player and loading tracks...</b>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="main-wrapper">
        <img
          src={current_track.album.images[0].url}
          className="now-playing__cover"
          alt="Track cover"
        />
        <div className="now-playing__side">
          <input
            type="text"
            value={answerValue}
            onChange={(e) => setAnswerValue(e.target.value)}
            placeholder="Guess the song"
            id="answerValue"
          />
          <button onClick={checkAnswer}>Submit Answer</button>
        </div>
      </div>
    </div>
  );
}

export default WebPlayback;
