export default function Login() {
  return (
    <div className="text-white bg-contrast-green hover:bg-contrast-green-focus focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-2xl text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
      <header className="App-header">
        <a className="btn-spotify" href="https://localhost:1314/auth/login">
          Login with Spotify
        </a>
      </header>
    </div>
  );
}
