import { useState, useEffect } from "react";
import LoginPage from "../page/loginPage";
import WebPlayback from "../components/webPlayback";

export default function Root() {
  const [token, setToken] = useState("");

  useEffect(() => {
    async function getToken() {
      try {
        const response = await fetch("https://localhost:1314/auth/token", {
          credentials: "include",
        });
        const json = await response.json();
        if (json.token) {
          setToken(json.token);
          localStorage.setItem("spotifyToken", json.token);
        } else {
          console.log("No token found");
        }
      } catch (error) {
        console.error("Failed to fetch token", error);
      }
    }

    getToken();
  }, []);

  return <>{token === "" ? <LoginPage /> : <WebPlayback token={token} />}</>;
}
