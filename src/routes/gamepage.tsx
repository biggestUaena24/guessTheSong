import { useNavigate } from "react-router-dom";

function GamePage() {
  const navigate = useNavigate();

  const handleClick = (tracks: number) => {
    navigate("/gaming", { state: { number_of_tracks: tracks } });
  };

  return (
    <>
      <h1>
        Welcome to the game page! Choose how many songs that you want to play
        randomly?
      </h1>
      <button onClick={() => handleClick(20)}>20</button>
      <button onClick={() => handleClick(30)}>30</button>
      <button onClick={() => handleClick(50)}>50</button>
    </>
  );
}

export default GamePage;
