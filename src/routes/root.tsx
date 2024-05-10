import { useState, useEffect } from "react";
import Login from "./login";
import WebPlayback from "../components/webPlayback";

export default function Root() {
  const [token, setToken] = useState("");

  useEffect(() => {
    async function getToken() {
      const response = await fetch("http://localhost:1314/auth/token");
      const json = await response.json();
      setToken(json.access_token);
    }

    getToken();
  }, []);

  return <>{token === "" ? <Login /> : <WebPlayback token={token} />}</>;
}
