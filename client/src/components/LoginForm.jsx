import { handleLogin } from "../lib/auth";
function LoginForm() {
  return (
    <div className="flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-secondary/10 rounded-xl shadow-lg overflow-hidden">
      {/* Sign up/ Sign in form*/}
      <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col gap-9">
        <div className="font-bold mb-4 flex items-center justify-start gap-2 flex-col text-base-content tracking-wider ">
          <h1 className="text-3xl ">Welcome Back</h1>
          <p className=" text-lg">Sign in with your preferred account</p>
        </div>
        <div className="space-y-4">
          <button
            className="btn btn-outline btn-lg w-full gap-3 hover:bg-primary/30 "
            onClick={() => handleLogin("google")}
          >
            <img
              src="/google-svgrepo-com.svg"
              className="w-8 h-8 "
              alt="google logo"
            />
            Continue with Google
          </button>
        </div>
      </div>

      {/* Illustration */}
      <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
        <div className="max-w-md p-8">
          <div className="relative aspect-square max-w-sm mx-auto">
            <a href="https://storyset.com/business">
              <img
                src="/fashion_shop.svg"
                alt="Fashion shop illustration"
                className="w-full h-full"
              />
            </a>
          </div>

          <div className="text-center space-y-3 mt-6">
            <h2 className="text-xl font-semibold">
              Join Millions of Happy Customers
            </h2>
            <p className="opacity-70">
              Sign in to add to your cart and get exclusive deals
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
