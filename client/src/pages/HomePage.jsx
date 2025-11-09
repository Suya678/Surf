import NavBar from "../components/Nav/NavBar";
import { Link } from "react-router";
import { authClient } from "../lib/auth";
import NavBarHost from "../components/Nav/NavBarHost";
import NavBarGuest from "../components/Nav/NavBarGuest";
export default function HomePage() {
  const { data: session } = authClient.useSession();

  return (
    <div className="min-h-screen" data-theme="autumn">
      {/* Navbar */}
      {!session ? <NavBar /> : <NavBarHost />}
      {/* Hero Section */}
      <section className="hero bg-base-200">
        <div className="hero-content max-w-7xl mx-auto py-8 lg:py-16 flex-col lg:flex-row-reverse gap-6 lg:gap-10">
          {/* Image */}
          <div className="w-full lg:w-1/2">
            <img
              src="/couch.png.avif"
              alt="Cozy couch representing shelter and comfort"
              className="w-full rounded-lg shadow-xl"
            />
          </div>

          {/* Content */}
          <div className="w-full lg:w-1/2 space-y-4 text-center lg:text-left">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black leading-tight">
              Connecting those who can give shelter with those who need it most
            </h1>

            <p className="text-base md:text-lg opacity-80">
              HomeSurf connects neighbors who can host with people seeking
              short-term shelter—prioritizing safety, dignity, and community
              support during emergencies and transitions.
            </p>

            <div className="flex flex-wrap gap-3 justify-center lg:justify-start pt-2">
              <Link to="/login" className="btn btn-primary">
                Join Now
              </Link>
              <a href="#how-it-works" className="btn btn-ghost">
                How It Works
              </a>
              <Link to="/onboarding" className="btn btn-outline">
                Take Action
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <div id="how-it-works" className="py-20 bg-base/ text-secondary-content">
        <div className="container mx-auto px-4">
          <h2
            className="text-5xl md:text-7xl text-center mb-12 font-black"
            style={{ fontFamily: "Impact, sans-serif" }}
          >
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* For Guests */}
            <div className="card text-secondary-content shadow-2xl border-4 border-neutral">
              <div className="card-body">
                <h3 className="card-title text-4xl mb-6 font-black">
                  For Guest
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
                  <Link
                    to="/login"
                    className="btn btn-accent btn-block border-4 border-neutral shadow-lg hover:scale-105 transition-transform duration-200"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </div>

            {/* For Hosts */}
            <div className="card shadow-2xl border-4 border-neutral">
              <div className="card-body">
                <h3 className="card-title text-4xl mb-6 font-black">
                  For Hosts
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
                  <Link
                    to="/login"
                    className="btn btn-secondary btn-block border-4 border-neutral shadow-lg hover:scale-105 transition-transform duration-200"
                  >
                    Become a Host
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Story Section */}
      <div id="story" className="py-20 bg-base-200">
        <div className="container mx-auto px-4">
          <div className="card lg:card-side bg-base-100 shadow-2xl border-4 border-neutral max-w-6xl mx-auto">
            <figure className="lg:w-1/3 bg-gradient-to-br from-base-300 to-primary flex items-center justify-center p-12">
              <div className="relative aspect-square max-w-sm mx-auto">
                <a href="https://storyset.com/business">
                  <img
                    src="/Team spirit-bro.svg"
                    alt="Team Spirit illustration"
                    className="w-full h-full"
                  />
                </a>
              </div>
            </figure>
            <div className="card-body lg:w-2/3">
              <h2
                className="card-title text-4xl font-black mb-4"
                style={{ fontFamily: "Impact, sans-serif" }}
              >
                Why We Started
              </h2>
              <div className="space-y-4 text-lg text-gray-900">
                <p>
                  "Three years ago, my best friend lost everything when his
                  house burned down. He had nowhere to go, no family nearby, and
                  the shelters were full. For two weeks, he slept in his car
                  until a stranger offered him their spare room.
                </p>
                <p>
                  That act of kindness changed his life. It gave him the
                  stability he needed to rebuild. Today, he has his own place
                  and volunteers as a host on HomeSurf, paying it forward to
                  others in need.
                </p>
                <p className=" text-xl text-neutral">
                  This is why we built HomeSurf because everyone deserves a
                  chance, a safe place, and a community that cares.
                </p>
              </div>
              <div className="card-actions justify-end mt-6"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}

      <div className="w-3/4 mx-auto border-t border-neutral opacity-70 my-4"></div>

      <footer className="footer sm:footer-horizontal bg-base-100 text-gray-900 items-center p-2">
        <aside className="grid-flow-col items-center">
          <img
            src="/HomeSurfLogo.png"
            className="h-24 w-auto"
            alt="HomeSurf Logo"
          />
          <p>Copyright © {new Date().getFullYear()} - All right reserved</p>
        </aside>
        <nav className="grid-flow-col gap-4 md:place-self-center md:justify-self-end"></nav>
      </footer>
    </div>
  );
}
