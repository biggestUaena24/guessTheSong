import { useState, useEffect } from "react";

interface WebPlaybackProps {
  token: string;
  trackUrl: string;
}

interface Track {
  name: string;
  album: {
    images: Array<{ url: string }>;
  };
  artists: Array<{ name: string }>;
}

export default function WebPlayback({ token, trackUrl }: WebPlaybackProps) {
  const [player, setPlayer] = useState(undefined);
  const [is_active, setActive] = useState(false);
  const [current_track, setTrack] = useState<Track>({
    name: "",
    album: { images: [{ url: "" }] },
    artists: [{ name: "" }],
  });

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    // @ts-ignore
    window.onSpotifyWebPlaybackSDKReady = () => {
      // @ts-ignore
      const player = new window.Spotify.Player({
        name: "Web Playback SDK",
        getOAuthToken: (cb: (token: string) => void) => {
          cb(token);
        },
        volume: 0.5,
      });

      setPlayer(player);

      player.addListener("ready", ({ device_id }: { device_id: string }) => {
        console.log("Ready with Device ID", device_id);
        player.connect();
      });

      player.addListener("player_state_changed", (state: any) => {
        if (!state) return;
        setTrack({
          name: state.track_window.current_track.name,
          album: {
            images: state.track_window.current_track.album.images,
          },
          artists: state.track_window.current_track.artists.map(
            (artist: { name: string }) => ({ name: artist.name })
          ),
        });
        setActive(state !== null);
      });

      player.connect();
    };

    return () => {
      if (player) {
        // @ts-ignore
        player.disconnect();
      }
    };
  }, [token]);

  useEffect(() => {
    if (player && trackUrl) {
      playTrack(trackUrl);
      setTimeout(() => {
        // @ts-ignore
        player.pause();
      }, 3000);
    }
  }, [trackUrl, player]);

  const playTrack = (spotify_uri: string) => {
    // @ts-ignore
    const { device_id } = player._options;
    fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, {
      method: "PUT",
      body: JSON.stringify({ uris: [spotify_uri] }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).catch((err) => console.error("Error playing track:", err));
  };

  if (!is_active) {
    return (
      <div className="container">
        <div className="main-wrapper">
          <b>
            Instance not active. Transfer your playback using your Spotify app
          </b>
        </div>
      </div>
    );
  } else {
    return (
      <div className="container">
        <div className="main-wrapper">
          <img
            src={current_track.album.images[0].url}
            className="now-playing__cover"
            alt={current_track.name}
          />

          <div className="now-playing__side">
            <div className="now-playing__name">{current_track.name}</div>
            <div className="now-playing__artist">
              {current_track.artists[0].name}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
