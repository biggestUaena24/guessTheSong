import { useLocation } from "react-router-dom";

function TrackList() {
  const location = useLocation();
  const { trackItems } = location.state;

  return (
    <div>
      <h1>Track List</h1>
      {trackItems && trackItems.length > 0 ? (
        <ul>
          {trackItems.map((track: any, index: number) => (
            <li key={index}>{track.track.name}</li>
          ))}
        </ul>
      ) : (
        <p>No tracks to display.</p>
      )}
    </div>
  );
}

export default TrackList;
