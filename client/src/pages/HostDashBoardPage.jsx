import React, { useEffect, useState } from "react";
import AddListingModal from "../components/AddListingModal";
import NavBarHost from "../components/Nav/NavBarHost";
import { Trash2, Edit, Users, Home } from "lucide-react";

export default function HostDashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/listings/my-listings`,
        {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch listings");
      const data = await res.json();
      setListings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-base-200"
        data-theme="autumn"
      >
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="text-lg mt-4 font-semibold opacity-80">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200" data-theme="autumn">
      <NavBarHost onAddListingClick={() => setIsModalOpen(true)} />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-black leading-tight">
                  Your Listings
                </h1>
                <p className="text-base md:text-lg opacity-80 mt-1">
                  {listings.length}{" "}
                  {listings.length === 1 ? "listing" : "listings"}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn btn-primary"
              >
                Add New Listing
              </button>
            </div>

            {listings.length === 0 ? (
              // Empty state
              <div className="text-center py-16">
                <Home className="w-20 h-20 mx-auto mb-6 opacity-30" />
                <h3 className="text-2xl md:text-3xl font-bold mb-3">
                  No listings yet
                </h3>
                <p className="text-base md:text-lg opacity-80 mb-6 max-w-md mx-auto">
                  Start making a difference by sharing your space with those who
                  need it most
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="btn btn-primary btn-lg"
                >
                  Add Your First Listing
                </button>
              </div>
            ) : (
              // Listings Grid
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <div
                    key={listing.listing_id}
                    className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 border border-base-300"
                  >
                    <figure className="relative overflow-hidden">
                      <img
                        src={listing.url}
                        alt={listing.title}
                        className="w-full h-52 object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </figure>
                    <div className="card-body p-5">
                      <h3 className="card-title text-lg font-bold line-clamp-1">
                        {listing.title}
                      </h3>
                      <p className="text-sm opacity-70 line-clamp-2 mb-4">
                        {listing.description || "No description provided"}
                      </p>
                      <div className="card-actions flex gap-2">
                        <button className="btn btn-primary btn-sm flex-1 gap-1">
                          <Users className="w-4 h-4" />
                          <span className="hidden sm:inline">Applications</span>
                        </button>
                        <button className="btn btn-ghost btn-sm btn-square">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="btn btn-ghost btn-sm btn-square text-error hover:bg-error hover:text-error-content">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Shared AddListingModal */}
      <AddListingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onListingAdded={fetchData}
      />
    </div>
  );
}
