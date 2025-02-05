import { useState, useEffect } from "react";
import LoginPage from "../page/loginPage";
import GamePage from "./gamepage";

export default function Root() {
  const [isToken, setIsToken] = useState(false);
  useEffect(() => {
    async function getToken() {
      try {
        const response = await fetch("https://localhost:1314/auth/token", {
          credentials: "include",
        });
        const json = await response.json();
        if (json.token) {
          setIsToken(true);
          localStorage.setItem("token", json.token);
        } else {
          console.log("No token found");
        }
      } catch (error) {
        console.error("Failed to fetch token", error);
      }
    }

    getToken();
  }, []);

  return <>{!isToken ? <LoginPage /> : <GamePage />}</>;
}
