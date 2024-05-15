import { useState, useEffect } from "react";
import Login from "./login";
import WebPlayback from "../components/webPlayback";

export default function Root() {
  const [token, setToken] = useState("");

  useEffect(() => {
    async function getToken() {
      const response = await fetch("http://localhost:1314/auth/token", {
        credentials: "include",
      });
      const json = await response.json();
      console.log(json);
      setToken(json.token);
    }

    getToken();
  }, []);

  return <>{token === "" ? <Login /> : <WebPlayback token={token} />}</>;
}
