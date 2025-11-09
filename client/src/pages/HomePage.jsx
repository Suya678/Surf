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
      {!session ? (
        <NavBar />
      ) : session.user.accountType === "Host" ? (
        <NavBarHost />
      ) : (
        <NavBarGuest />
      )}
      {/* Hero Section */}
      <section className="hero min-h-screen bg-base-200">
        <div className="hero-content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 flex-col lg:flex-row-reverse gap-8 lg:gap-16">
          {/* Image */}
          <div className="w-full lg:w-1/2 flex justify-center items-center">
            <img
              src="/couch.png.avif"
              alt="Cozy couch representing shelter and comfort"
              className="w-full max-w-xl rounded-lg shadow-2xl object-cover"
            />
          </div>

          {/* Content */}
          <div className="w-full lg:w-1/2 space-y-6 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight text-primary">
              Connecting those who can give shelter with those who need it most
            </h1>

            <p className="text-lg md:text-xl opacity-80 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              HomeSurf connects neighbors who can host with people seeking
              short-term shelter—prioritizing safety, dignity, and community
              support during emergencies and transitions.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <Link to="/login" className="btn btn-primary btn-lg">
                Join Now
              </Link>
              <a
                href="#how-it-works"
                className="btn btn-outline btn-secondary btn-lg"
              >
                How It Works
              </a>
            </div>
          </div>
        </div>
      </section>
      {/* How It Works Section */}
      <div id="how-it-works" className="py-20 bg-base-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl text-center mb-16 font-black text-primary">
            How It Works
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
            {/* For Guests */}
            <div className="card bg-base-200 shadow-xl hover:shadow-2xl transition-shadow">
              <div className="card-body">
                <h3 className="card-title text-3xl md:text-4xl mb-6 font-black text-primary">
                  For Guests
                </h3>
                <div className="space-y-6">
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
                      <div className="badge badge-primary badge-lg font-bold text-lg w-10 h-10 flex items-center justify-center shrink-0">
                        {item.step}
                      </div>
                      <div>
                        <h4 className="font-bold text-xl mb-1">{item.title}</h4>
                        <p className="text-base opacity-80">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="card-actions justify-end mt-8">
                  <Link
                    to="/login"
                    className="btn btn-primary btn-block btn-lg hover:scale-105 transition-transform duration-200"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </div>

            {/* For Hosts */}
            <div className="card bg-base-200 shadow-xl hover:shadow-2xl transition-shadow">
              <div className="card-body">
                <h3 className="card-title text-3xl md:text-4xl mb-6 font-black text-secondary">
                  For Hosts
                </h3>
                <div className="space-y-6">
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
                      <div className="badge badge-secondary badge-lg font-bold text-lg w-10 h-10 flex items-center justify-center shrink-0">
                        {item.step}
                      </div>
                      <div>
                        <h4 className="font-bold text-xl mb-1">{item.title}</h4>
                        <p className="text-base opacity-80">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="card-actions justify-end mt-8">
                  <Link
                    to="/login"
                    className="btn btn-secondary btn-block btn-lg hover:scale-105 transition-transform duration-200"
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
      <div id="about" className="py-20 bg-base-200">
        <div className="container mx-auto px-4">
          <div className="card lg:card-side bg-base-100 shadow-2xl border-4 border-neutral max-w-6xl mx-auto">
            <figure className="lg:w-1/3 flex items-center justify-center p-12">
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
