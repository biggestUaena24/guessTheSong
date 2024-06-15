import { useEffect, useState } from "react";
import PlaylistCard from "../components/playlistCard";

export default function LandingPage() {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    async function getPlaylists() {
      try {
        const response = await fetch(
          "https://localhost:1314/spotify/playlists",
          {
            credentials: "include",
          }
        );
        const json = await response.json();
        setPlaylists(json.playlists.items);
        console.log(json.playlists.items);
      } catch (error) {
        console.log("Failed to fetch playlists");
      }
    }

    getPlaylists();
  }, []);

  return (
    <div>
      <h1>Welcome to the landing page!</h1>
      <h2>Here are the playlists that you saved in your spotify account</h2>
      {playlists?.map(({ name, id, tracks }) => (
        <PlaylistCard
          name={name}
          key={id}
          trackUrl={tracks["href"]}
          totalTrack={tracks["total"]}
        />
      ))}
    </div>
  );
}
