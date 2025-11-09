import Link from "react-router";

export default function About() {
  return (
    <div id="about-us" className="py-20 bg-base-200">
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
                "Three years ago, my best friend lost everything when his house
                burned down. He had nowhere to go, no family nearby, and the
                shelters were full. For two weeks, he slept in his car until a
                stranger offered him their spare room.
              </p>
              <p>
                That act of kindness changed his life. It gave him the stability
                he needed to rebuild. Today, he has his own place and volunteers
                as a host on HomeSurf, paying it forward to others in need.
              </p>
              <p className="font-bold text-xl text-primary">
                This is why we built HomeSurf because everyone deserves a
                a safe place, and a community that cares.
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
  );
}
