import LoginButton from "../components/loginButton";

export default function LoginPage() {
  return (
    <div>
      <nav>
        <nav className="bg-black-background border-gray-200 dark:bg-gray-900">
          <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">
              Guess The Song!
            </span>
            <LoginButton />
          </div>
        </nav>
      </nav>
      <div>
        There should be some contents displayed here to show what this website
      </div>
    </div>
  );
}
