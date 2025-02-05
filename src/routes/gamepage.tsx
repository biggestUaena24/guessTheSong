import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

interface Track {
  name: string;
  album: {
    images: Array<{ url: string }>;
  };
  artists: Array<{ name: string }>;
}

function GamePage() {
  const location = useLocation();
  const { trackItems } = location.state;
  trackItems.sort(() => Math.random() - 0.5);
  let trackUris = trackItems.map((track: any) => track.track.uri);
  trackUris = trackUris.filter((uri: string) => uri.includes("spotify:track:"));
  const token = localStorage.getItem("token");

  const [player, setPlayer] = useState<any>(undefined);
  const [is_active, setActive] = useState(false);
  const [current_track, setTrack] = useState<Track>({
    name: "",
    album: { images: [{ url: "" }] },
    artists: [{ name: "" }],
  });
  const [answerValue, setAnswerValue] = useState("");

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
          cb(token ?? "");
        },
        volume: 0.5,
      });

      setPlayer(player);

      player.addListener("ready", ({ device_id }: { device_id: string }) => {
        player.connect();
        playInitialTrack(trackUris, device_id);
        setTimeout(() => {
          player.pause();
        }, 3000);
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
        player.getCurrentState().then((state: any) => {
          !state ? setActive(false) : setActive(true);
        });
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

  const playInitialTrack = (spotify_uri: string[], device_id: string) => {
    fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, {
      method: "PUT",
      body: JSON.stringify({ uris: spotify_uri }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).catch((err) => console.error("Error playing track:", err));
  };

  const checkAnswer = () => {
    if (answerValue.toLowerCase() == current_track.name.toLowerCase()) {
      console.log("You got the correct answer");
    } else {
      console.log("This is a wrong answer", current_track.name);
    }
    player.nextTrack();
    player.togglePlay();
    console.log(player.getCurrentState());
  };

  if (!is_active) {
    return (
      <div className="container">
        <div className="main-wrapper">
          <b>loading song...</b>
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
          />

          <div className="now-playing__side">
            <input
              type="text"
              id="fname"
              name="fname"
              onChange={(e) => {
                setAnswerValue(e.target.value);
              }}
            />{" "}
            <button onClick={checkAnswer}>Press to submit answer</button>
          </div>
        </div>
      </div>
    );
  }
}

export default GamePage;
