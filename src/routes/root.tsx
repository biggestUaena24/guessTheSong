import { useEffect, useState } from "react";
import Login from "./login";
import WebPlayback from "../components/webPlayback";

export default function Root() {
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    const localToken = localStorage.getItem("token") || "";
    setToken(localToken);
  }, []);

  return <>{token === "" ? <Login /> : <WebPlayback token={token} />}</>;
}
