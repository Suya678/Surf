import { handleLogin } from "../lib/auth";

function LoginForm() {
  return (
    <div className="flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-2xl overflow-hidden">
      {/* Sign in form */}
      <div className="w-full lg:w-1/2 p-6 sm:p-10 flex flex-col gap-8 bg-base-200 items-center justify-center">
        <div className="text-center ">
          <h1 className="text-4xl font-black text-primary mb-3">
            Welcome Back
          </h1>
          <p className="text-lg opacity-80">
            Continue your journey toward safety and stability
          </p>
        </div>

        <div className="space-y-4">
          <button
            className="btn btn-primary btn-lg w-full gap-3 hover:scale-105 transition-transform"
            onClick={() => handleLogin("google")}
          >
            <img
              src="/google-svgrepo-com.svg"
              className="w-6 h-6"
              alt="google logo"
            />
            Continue with Google
          </button>
        </div>
      </div>

      {/* Illustration */}
      <div className="hidden lg:flex w-full lg:w-1/2 bg-gradient-to-br from-primary/20 to-secondary/20 items-center justify-center p-8">
        <div className="max-w-md">
          <div className="relative aspect-square max-w-sm mx-auto">
            <img
              src="/house_pic.svg"
              alt="House illustration"
              className="w-full h-full drop-shadow-xl"
            />
          </div>

          <div className="text-center space-y-4 mt-8">
            <h2 className="text-2xl font-bold text-primary">
              Find Your Safe Haven
            </h2>
            <p className="text-lg opacity-80 leading-relaxed">
              Join our community of compassionate hosts and guests building
              connections that matter.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
