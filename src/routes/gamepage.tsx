import { useNavigate } from "react-router-dom";

function GamePage() {
  const navigate = useNavigate();

  const handleClick = (tracks: number) => {
    navigate("/gaming", { state: { number_of_tracks: tracks } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black-background to-purple-900 flex flex-col items-center justify-center">
      <h1 className="text-2xl font-semibold text-white mb-16">
        Welcome to the game page! Choose how many songs that you want to play
        randomly?
      </h1>
      <div className="flex items-center justify-items-stretch rounded-2xl">
        <button onClick={() => handleClick(20)} className="spotify-btn">
          20
        </button>
        <button onClick={() => handleClick(30)} className="spotify-btn">
          30
        </button>
        <button onClick={() => handleClick(50)} className="spotify-btn">
          50
        </button>
      </div>
    </div>
  );
}

export default GamePage;
