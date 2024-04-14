import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getAccessToken,
  getUserId,
  getPlaylists,
} from "../handlers/spotifyHandler";

export default function Root() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");

  // Define fetchToken to also return the token
  async function fetchToken() {
    if (code) {
      const token = await getAccessToken(import.meta.env.VITE_CLIENT_ID, code);
      console.log(token);
      localStorage.setItem("token", token);
      return token; // Return the fetched token for subsequent use
    }
  }

  async function fetchAndSetUserId(token: string) {
    if (token && code) {
      const id = await getUserId(token);
      console.log(id);
      localStorage.setItem("userId", id);
    }
  }

  async function fetchUserPlaylists(token: string, userId: string) {
    if (token && userId && code) {
      const playlists = await getPlaylists(token, userId);
      console.log(playlists);
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
  }, [code]); // Dependency array includes `code` to re-run only if `code` changes

  return (
    <>
      <h1>This will be the first page that the user sees</h1>
      {code ? null : <Link to="/login">Go to the Login page </Link>}
    </>
  );
}
