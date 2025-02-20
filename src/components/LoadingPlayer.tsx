const LoadingPlayer = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-600">
      <div className="text-center bg-white p-8 rounded-lg shadow-2xl transform transition-all hover:scale-105">
        <img
          src="https://cdn-icons-png.flaticon.com/512/3658/3658776.png"
          alt="Loading Music"
          className="w-24 h-24 mx-auto mb-4 animate-bounce"
        />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Initializing Player
        </h1>
        <p className="text-gray-600 mb-4">Loading tracks, please wait...</p>
        <div className="flex justify-center">
          <div className="w-8 h-8 bg-purple-500 rounded-full animate-pulse mx-1"></div>
          <div className="w-8 h-8 bg-purple-500 rounded-full animate-pulse mx-1 delay-100"></div>
          <div className="w-8 h-8 bg-purple-500 rounded-full animate-pulse mx-1 delay-200"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingPlayer;
