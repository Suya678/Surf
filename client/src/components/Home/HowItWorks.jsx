import Link from "react-router";

export default function HowItWorks() {
  return (
    <div id="how-it-works" className="py-20 bg-primary text-primary-content">
      <div className="container mx-auto px-4">
        <h2
          className="text-5xl md:text-7xl text-center mb-12 font-black"
          style={{ fontFamily: "Impact, sans-serif" }}
        >
          HOW IT WORKS
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* For Guests */}
          <div className="card bg-secondary text-secondary-content shadow-2xl border-4 border-neutral">
            <div className="card-body">
              <h3 className="card-title text-4xl mb-6 font-black">
                🏄 FOR GUESTS
              </h3>
              <div className="space-y-4">
                {[
                  {
                    step: "1",
                    title: "Sign Up",
                    desc: "Create your account and complete verification",
                  },
                  {
                    step: "2",
                    title: "Search",
                    desc: "Browse available places near you",
                  },
                  {
                    step: "3",
                    title: "Request",
                    desc: "Send booking requests to hosts",
                  },
                  {
                    step: "4",
                    title: "Stay Safe",
                    desc: "Enjoy your temporary home",
                  },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-4">
                    <div className="badge badge-lg badge-accent font-bold text-lg w-10 h-10 flex items-center justify-center">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-bold text-xl">{item.title}</h4>
                      <p className="text-base">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="card-actions justify-end mt-6">
                <button className="btn btn-accent btn-block border-4 border-neutral shadow-lg">
                  Get Started
                </button>
              </div>
            </div>
          </div>

          {/* For Hosts */}
          <div className="card bg-accent text-accent-content shadow-2xl border-4 border-neutral">
            <div className="card-body">
              <h3 className="card-title text-4xl mb-6 font-black">
                🏠 FOR HOSTS
              </h3>
              <div className="space-y-4">
                {[
                  {
                    step: "1",
                    title: "Register",
                    desc: "Sign up and verify your identity",
                  },
                  {
                    step: "2",
                    title: "List Your Space",
                    desc: "Add details about your available room(s)",
                  },
                  {
                    step: "3",
                    title: "Review Requests",
                    desc: "Choose guests that fit your preferences",
                  },
                  {
                    step: "4",
                    title: "Make a Difference",
                    desc: "Help someone in need",
                  },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-4">
                    <div className="badge badge-lg badge-secondary font-bold text-lg w-10 h-10 flex items-center justify-center">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-bold text-xl">{item.title}</h4>
                      <p className="text-base">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="card-actions justify-end mt-6">
                <button className="btn btn-secondary btn-block border-4 border-neutral shadow-lg">
                  Become a Host
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
