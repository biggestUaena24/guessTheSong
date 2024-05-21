import { useState, useEffect } from "react";
import Login from "./login";
import WebPlayback from "../components/webPlayback";

export default function Root() {
  const [token, setToken] = useState("");

  useEffect(() => {
    async function getToken() {
      try {
        const response = await fetch("http://localhost:1314/auth/token", {
          credentials: "include",
        });
        const json = await response.json();
        if (json.token) {
          setToken(json.token);
        } else {
          console.log("No token found");
        }
      } catch (error) {
        console.error("Failed to fetch token", error);
      }
    }

    getToken();
  }, []);

  return <>{token === "" ? <Login /> : <WebPlayback token={token} />}</>;
}
