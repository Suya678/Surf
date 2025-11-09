import NavBar from "../components/Nav/NavBar.jsx";
import LoginForm from "../components/LoginForm.jsx";
function LoginPage() {
  return (
    <div className="h-screen flex flex-col space-y-2" data-theme="autumn">
      <NavBar />
      <div className="flex grow justify-center items-center">
        <LoginForm />
      </div>
    </div>
  );
}

export default LoginPage;
