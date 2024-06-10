import { useEffect } from "react";

export default function LandingPage() {
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
        console.log(json);
      } catch (error) {
        console.log("Failed to fetch playlists");
      }
    }

    getPlaylists();
  });

  return (
    <div>
      <h1>Welcome to the landing page!</h1>
    </div>
  );
}
