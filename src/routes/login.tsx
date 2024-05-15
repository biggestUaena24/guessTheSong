import { redirect } from "react-router-dom";

export default function Login() {
  async function onClick() {
    const response = await fetch("http://localhost:1314/auth/login");
    const { token } = await response.json();
    localStorage.setItem("token", token);
    if (localStorage.getItem("token")) {
      redirect("/");
    }
  }
  return (
    <div className="App">
      <header className="App-header">
        <h3 onClick={onClick}>Click to login</h3>
      </header>
    </div>
  );
}
