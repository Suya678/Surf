export default function Hero() {
  return (
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
  );
}
