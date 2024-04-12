import { Link } from "react-router-dom";

export default function Root() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");

  return (
    <>
      <h1>This will be the first page that the user sees</h1>
      {code ? null : <Link to="/login">Go to the Login page </Link>}
    </>
  );
}
