import React, { useEffect, useState } from "react";
import AddListingModal from "../components/AddListingModal";
import EditListingModal from "../components/EditListingModal";
import ViewRequestsModal from "../components/ViewRequestsModal";
import NavBarHost from "../components/Nav/NavBarHost";
import { Trash2, Edit, Users, Home } from "lucide-react";
import toast from "react-hot-toast";
import PageLoader from "../components/PageLoader";

export default function HostDashboardPage() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRequestsModalOpen, setIsRequestsModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // Fetch Host data when mounting
  useEffect(() => {
    fetchData();
  }, []);

  // Fetches all listing data for the host
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/listing/my-listings`,
        {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch listings");
      const data = await res.json();
      console.log("Fetched listings:", data);
      setListings(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load listings");
    } finally {
      setLoading(false);
    }
  };

  // Handles the edit listing modal
  const handleEditListingRequest = (listing) => {
    setSelectedListing(listing);
    setIsEditModalOpen(true);
  };

  // Handles the view modal
  const handleViewRequests = (listing) => {
    setSelectedListing(listing);
    setIsRequestsModalOpen(true);
  };

  // Handles the request to delete a listing
  const handleDelete = async (listingId) => {
    if (
      !confirm(
        "Are you sure you want to delete this listing? All associated bookings will also be deleted."
      )
    ) {
      return;
    }

    setDeletingId(listingId);
    const loadingToast = toast.loading("Deleting listing...");
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/listing/${listingId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to delete listing");
      }

      toast.success("Listing deleted successfully", {
        id: loadingToast,
      });
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error(err.message, {
        id: loadingToast,
      });
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen bg-base-200" data-theme="autumn">
      <NavBarHost />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-black leading-tight">
                  Your Listings
                </h1>
                <p className="text-base md:text-lg opacity-80 mt-1">
                  {`${listings.length} ${
                    listings.length === 1 ? "listing" : "listings"
                  }`}
                </p>
              </div>
            </div>

            {listings.length === 0 ? (
              <div className="text-center py-16">
                <Home className="w-20 h-20 mx-auto mb-6 opacity-30" />
                <h3 className="text-2xl md:text-3xl font-bold mb-3">
                  No listings yet
                </h3>
                <p>Add Your First Listing</p>
              </div>
            ) : (
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
                      <p className="text-sm opacity-70 line-clamp-2 mb-2">
                        {listing.description || "No description provided"}
                      </p>

                      {/* Location & Guest Info */}
                      <div className="text-xs opacity-60 space-y-1 mb-4">
                        <p>
                          {`📍 ${listing.address}, ${listing.city} ${listing.province}`}
                        </p>
                        <p>👥 Up to {listing.guest_limit} guests</p>
                      </div>

                      {/* Action Buttons */}
                      <div className="card-actions flex flex-col gap-2">
                        <button
                          onClick={() => handleViewRequests(listing)}
                          className="btn btn-primary btn-sm w-full gap-1"
                        >
                          <Users className="w-4 h-4" />
                          View Requests
                        </button>

                        <div className="flex gap-2">
                          {/* Edit button*/}
                          <button
                            onClick={() => handleEditListingRequest(listing)}
                            className="btn btn-ghost btn-sm flex-1"
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </button>

                          {/* Delete button*/}
                          <button
                            onClick={() => handleDelete(listing.listing_id)}
                            disabled={deletingId === listing.listing_id}
                            className="btn btn-error btn-sm flex-1"
                          >
                            {deletingId === listing.listing_id ? (
                              <span className="loading loading-spinner loading-xs"></span>
                            ) : (
                              <>
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}

      {/* Edit Listing Modal */}
      <EditListingModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedListing(null);
        }}
        listing={selectedListing}
        onListingUpdated={fetchData}
      />

      {/* View Listing Modal */}
      <ViewRequestsModal
        isOpen={isRequestsModalOpen}
        onClose={() => {
          setIsRequestsModalOpen(false);
          setSelectedListing(null);
        }}
        listing={selectedListing}
      />
    </div>
  );
}
