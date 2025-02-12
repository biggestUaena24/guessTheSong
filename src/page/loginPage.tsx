import LoginButton from "../components/loginButton";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black-background to-purple-900 flex flex-col items-center justify-center">
      <h1 className="text-6xl font-semibold text-white mb-16">
        Guess The Song!
      </h1>
      <LoginButton />
    </div>
  );
}
