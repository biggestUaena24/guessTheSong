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
        .then((json) => console.log(json))
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
