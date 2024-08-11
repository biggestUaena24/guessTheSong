import { useLocation } from "react-router-dom";
import WebPlayback from "../components/webPlayback";

function GamePage() {
  const location = useLocation();
  const { trackItems } = location.state;
  trackItems.sort(() => Math.random() - 0.5);
  const trackUris = trackItems.map((track: any) => track.track.uri);

  return (
    <div>
      <h1>Gameplay page</h1>
      <WebPlayback
        token={localStorage.getItem("token") ?? ""}
        trackUrl={trackUris}
      ></WebPlayback>
    </div>
  );
}

export default GamePage;
