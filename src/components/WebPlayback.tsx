import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import LoadingPlayer from "./LoadingPlayer";

const track = {
  name: "",
  album: {
    images: [{ url: "" }],
  },
  artists: [{ name: "" }],
};

function WebPlayback() {
  const token = localStorage.getItem("token");
  const location = useLocation();
  const regex = /\[.*?\]|\(.*?\)/g;
  const { number_of_tracks } = location.state || { number_of_tracks: 0 };
  const [is_active, setActive] = useState(false);
  const [current_track, setTrack] = useState(track);
  const [deviceId, setDeviceId] = useState("");
  const [trackUris, setTrackUris] = useState<string[]>([]);
  const [answerValue, setAnswerValue] = useState("");
  const [score, setScore] = useState(0);
  const [isRevealingAnswer, setIsRevealingAnswer] = useState(false);
  const playerRef = useRef<any>(null);
  const trackUrisRef = useRef<string[]>([]);
  const imageRef = useRef<HTMLImageElement>(null);

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
      console.log(number_of_tracks);
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
      body: JSON.stringify({
        uris: spotify_uri.slice(0, number_of_tracks),
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).catch((err) => console.error("Error playing track:", err));
  };

  const checkAnswer = () => {
    playerRef.current?.pause();
    setIsRevealingAnswer(true);
    const answer = current_track.name.replace(regex, "").trim();

    if (answerValue.toLowerCase() === answer.toLowerCase()) {
      console.log("Correct answer!");
      setScore(score + 1);
    } else {
      console.log("Wrong answer. Correct song:", current_track.name);
    }
    playerRef.current?.resume();
    setTimeout(() => {
      playerRef.current?.pause();
      setIsRevealingAnswer(false);
      playerRef.current?.nextTrack();
      setAnswerValue("");
    }, 5000);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    checkAnswer();
  };

  useEffect(() => {
    if (!isRevealingAnswer && imageRef.current) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = imageRef.current;

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;

        const size = 10; // Mosaic block size
        for (let x = 0; x < img.width; x += size) {
          for (let y = 0; y < img.height; y += size) {
            ctx?.drawImage(img, x, y, size, size, x, y, size, size);
          }
        }

        img.src = canvas.toDataURL();
      };
    }
  }, [isRevealingAnswer]);

  if (!is_active || trackUris.length == 0) {
    return <LoadingPlayer></LoadingPlayer>;
  }

  return (
    <div className="flex flex-col h-screen p-4">
      <div className="absolute top-0 left-0 p-4">
        <p className="text-lg font-bold">Score: {score}</p>
      </div>

      <div className="flex flex-col items-center justify-center flex-grow">
        <img
          ref={imageRef}
          src={current_track.album.images[0].url}
          className={`rounded-full w-96 h-96 ${
            !isRevealingAnswer ? "mosaic" : ""
          }`}
          alt="Track cover"
          style={{
            animation: isRevealingAnswer ? "none" : "spin 10s linear infinite",
          }}
        />

        {isRevealingAnswer && (
          <div className="mt-4 text-center">
            <p className="text-xl font-semibold">
              {current_track.name.replace(regex, "").trim()}
            </p>
            <p className="text-lg text-gray-600">
              {current_track.artists[0].name}
            </p>
          </div>
        )}

        {!isRevealingAnswer && (
          <form onSubmit={handleSubmit} autoComplete="off" className="mt-6">
            <div className="flex flex-col space-y-4">
              <input
                type="text"
                value={answerValue}
                onChange={(e) => setAnswerValue(e.target.value)}
                placeholder="Guess the song"
                id="answerValue"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Submit Answer
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default WebPlayback;
