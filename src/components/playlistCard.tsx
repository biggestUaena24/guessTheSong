import { useNavigate } from "react-router-dom";

interface PlaylistCardProps {
  name: string;
  trackUrl: string;
  totalTrack: number;
}

export default function PlaylistCard({
  name,
  trackUrl,
  totalTrack,
}: PlaylistCardProps) {
  const navigate = useNavigate();

  function onClick(trackUrl: string, totalTrack: number) {
    try {
      fetch("https://localhost:1314/spotify/tracks", {
        credentials: "include",
        body: JSON.stringify({ trackUrl: trackUrl, totalTrack: totalTrack }),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((tracks) => {
          if (tracks) {
            console.log(tracks.tracks.items);
            const trackItems = tracks.tracks.items;
            // Needs a new route for user to play the game and also interact with web playback sdk there
            navigate("/gamepage", { state: { trackItems } });
          } else {
            console.log("No tracks found");
          }
        })
        .catch((error) =>
          console.error("Failed to fetch playlist tracks", error)
        );
    } catch (error) {
      console.error("Failed to fetch playlist tracks", error);
    }
  }

  return (
    <>
      <h1 onClick={() => onClick(trackUrl, totalTrack)}>{name}</h1>
    </>
  );
}
