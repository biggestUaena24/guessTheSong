import { useEffect } from "react";
import { redirectToAuthCodeFlow } from "../handlers/spotifyHandler";

export default function Login() {
  const clientId = import.meta.env.VITE_CLIENT_ID;
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");

  useEffect(() => {
    if (!code) {
      redirectToAuthCodeFlow(clientId);
    }
  });

  return (
    <div>
      <h1>This will be the login page</h1>
    </div>
  );
}
