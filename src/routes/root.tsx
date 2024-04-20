import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getAccessToken,
  getUserId,
  getPlaylists,
} from "../handlers/spotifyHandler";
import Playlist_Card from "../components/playlist-card";

export default function Root() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  const [playlistItems, setPlaylistItems] = useState([]);

  async function fetchToken() {
    if (code) {
      const token = await getAccessToken(import.meta.env.VITE_CLIENT_ID, code);
      localStorage.setItem("token", token);
      return token;
    }
  }

  async function fetchAndSetUserId(token: string) {
    if (token && code) {
      const id = await getUserId(token);
      localStorage.setItem("userId", id);
    }
  }

  async function fetchUserPlaylists(token: string, userId: string) {
    if (token && userId && code) {
      const playlists = await getPlaylists(token, userId);
      setPlaylistItems(playlists.items);
    }
  }

  useEffect(() => {
    async function fetchAndSetup() {
      const token = await fetchToken();
      if (token) {
        await fetchAndSetUserId(token);
        fetchUserPlaylists(
          localStorage.getItem("token")!,
          localStorage.getItem("userId")!
        );
      }
    }

    fetchAndSetup();
  }, [code]);

  return (
    <>
      <h1>This will be the first page that the user sees</h1>
      {code ? (
        playlistItems.map(({ id, name, tracks }) => {
          return <Playlist_Card key={id} name={name} tracks={tracks["href"]} />;
        })
      ) : (
        <Link to="/login">Go to the Login page </Link>
      )}
    </>
  );
}
