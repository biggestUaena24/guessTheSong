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
        <button
          className="text-white bg-contrast-green hover:bg-contrast-green-focus focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-2xl text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          onClick={() => handleClick(20)}
        >
          20
        </button>
        <button onClick={() => handleClick(30)}>30</button>
        <button onClick={() => handleClick(50)}>50</button>
      </div>
    </div>
  );
}

export default GamePage;
