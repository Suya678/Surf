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
              SurfHub connects neighbors who can host with people seeking
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

      {/* Personal Story Section */}
      <div id="story" className="py-20 bg-base-200">
        <div className="container mx-auto px-4">
          <div className="card lg:card-side bg-base-100 shadow-2xl border-4 border-neutral max-w-6xl mx-auto">
            <figure className="lg:w-1/3 bg-gradient-to-br from-primary to-secondary flex items-center justify-center p-12">
              <div className="text-9xl">📖</div>
            </figure>
            <div className="card-body lg:w-2/3">
              <h2
                className="card-title text-4xl font-black text-primary mb-4"
                style={{ fontFamily: "Impact, sans-serif" }}
              >
                WHY WE STARTED
              </h2>
              <div className="space-y-4 text-lg">
                <p>
                  "Three years ago, my best friend lost everything when his
                  house burned down. He had nowhere to go, no family nearby, and
                  the shelters were full. For two weeks, he slept in his car
                  until a stranger offered him their spare room.
                </p>
                <p>
                  That act of kindness changed his life. It gave him the
                  stability he needed to rebuild. Today, he has his own place
                  and volunteers as a host on SurfHub, paying it forward to
                  others in need.
                </p>
                <p className="font-bold text-xl text-primary">
                  This is why we built SurfHub - because everyone deserves a
                  chance, a safe place, and a community that cares.
                </p>
              </div>
              <div className="card-actions justify-end mt-6">
                <button className="btn btn-primary btn-lg border-4 border-neutral shadow-lg">
                  Join Our Community
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Footer */}
      <div className="bg-neutral text-neutral-content py-16">
        <div className="container mx-auto px-4 text-center">
          <h2
            className="text-4xl md:text-6xl mb-6 font-black"
            style={{ fontFamily: "Impact, sans-serif" }}
          >
            READY TO MAKE A DIFFERENCE?
          </h2>
          <p className="text-2xl mb-8 font-semibold">
            Join thousands who are already part of our community
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn btn-secondary btn-lg text-xl border-4 border-base-100 shadow-lg">
              I Need Help
            </button>
            <button className="btn btn-accent btn-lg text-xl border-4 border-base-100 shadow-lg">
              I Want to Help
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer footer-center p-10 bg-base-200 text-base-content border-t-4 border-neutral">
        <div>
          <div className="text-6xl mb-4">🏄</div>
          <p className="font-bold text-2xl">SurfHub</p>
          <p className="text-lg font-semibold">
            Connecting hearts, one wave at a time
          </p>
          <p className="font-semibold">
            Copyright © 2024 - All rights reserved
          </p>
        </div>
        <div>
          <div className="grid grid-flow-col gap-4 text-lg font-semibold">
            <a className="link link-hover">Contact</a>
            <a className="link link-hover">Privacy</a>
            <a className="link link-hover">Terms</a>
            <a className="link link-hover">Safety</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
