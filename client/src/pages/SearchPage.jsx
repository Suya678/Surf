import React, { useState, useEffect } from "react";
import NavBarGuest from "../components/Nav/NavBarGuest";
import BookingModal from "../components/BookingModal";
import MapView from "../components/MapView";
import {
  Search,
  MapPin,
  Users,
  Home,
  Calendar,
  Map,
  Grid3X3,
} from "lucide-react";
import toast from "react-hot-toast";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useState({
    city: "",
    province: "",
    checkin: "",
    checkout: "",
    guests: 1,
  });
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "map"

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearching(true);
    setHasSearched(true);

    try {
      const queryParams = new URLSearchParams(
        Object.entries(searchParams).filter(([_, value]) => value !== "")
      ).toString();

      const res = await fetch(
        `${
          import.meta.env.VITE_SERVER_BASE_URL
        }/api/listings/search?${queryParams}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Search failed");
      }

      const data = await res.json();
      setResults(data);

      if (data.length === 0) {
        toast.info(
          "No listings found. Try a different city or adjust your filters."
        );
      } else {
        toast.success(
          `Found ${data.length} ${
            data.length === 1 ? "listing" : "listings"
          } in ${searchParams.city}!`
        );
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setSearching(false);
    }
  };

  const handleBookingRequest = (listing) => {
    setSelectedListing(listing);
    setIsBookingModalOpen(true);
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };
  useEffect(() => {
    if (results.length > 0) {
      console.log("Search results:", results);
      console.log("First result:", results[0]);
      console.log("Has coordinates?", {
        latitude: results[0].latitude,
        longitude: results[0].longitude,
      });
    }
  }, [results]);

  return (
    <div className="min-h-screen bg-base-200" data-theme="autumn">
      <NavBarGuest />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Search Form */}
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body">
            <div className="text-center mb-6">
              <h1 className="text-3xl md:text-4xl font-black mb-2">
                Find Your Perfect Stay
              </h1>
              <p className="text-lg opacity-70">
                Connecting people in need with safe, welcoming spaces
              </p>
            </div>

            <form onSubmit={handleSearch} className="space-y-6">
              {/* City Search - Prominent */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-lg font-bold flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Which city are you looking in? *
                  </span>
                </label>
                <input
                  type="text"
                  name="city"
                  placeholder="Enter city name (e.g., Toronto, Vancouver, Montreal)"
                  className="input input-bordered input-lg w-full text-lg"
                  value={searchParams.city}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Optional Filters - Collapsed */}
              <div className="divider">Optional Filters</div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Province</span>
                  </label>
                  <input
                    type="text"
                    name="province"
                    placeholder="e.g., ON, BC, QC"
                    className="input input-bordered w-full"
                    value={searchParams.province}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Check-in
                    </span>
                  </label>
                  <input
                    type="date"
                    name="checkin"
                    className="input input-bordered w-full"
                    value={searchParams.checkin}
                    onChange={handleInputChange}
                    min={getTodayDate()}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Check-out
                    </span>
                  </label>
                  <input
                    type="date"
                    name="checkout"
                    className="input input-bordered w-full"
                    value={searchParams.checkout}
                    onChange={handleInputChange}
                    min={searchParams.checkin || getTodayDate()}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      Guests
                    </span>
                  </label>
                  <input
                    type="number"
                    name="guests"
                    placeholder="1"
                    className="input input-bordered w-full"
                    value={searchParams.guests}
                    onChange={handleInputChange}
                    min="1"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={searching}
                className="btn btn-primary btn-lg w-full"
              >
                {searching ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Search Listings
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Results */}
        {hasSearched && (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              {/* Header with View Toggle */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-2xl font-bold">
                  {results.length === 0 ? (
                    <>No Listings Found in {searchParams.city}</>
                  ) : (
                    <>
                      Found {results.length}{" "}
                      {results.length === 1 ? "Listing" : "Listings"} in{" "}
                      {searchParams.city}
                      {searchParams.province && `, ${searchParams.province}`}
                    </>
                  )}
                </h2>

                {results.length > 0 && (
                  <div className="btn-group">
                    <button
                      className={`btn btn-sm ${
                        viewMode === "grid" ? "btn-active" : ""
                      }`}
                      onClick={() => setViewMode("grid")}
                    >
                      <Grid3X3 className="w-4 h-4" />
                      Grid
                    </button>
                    <button
                      className={`btn btn-sm ${
                        viewMode === "map" ? "btn-active" : ""
                      }`}
                      onClick={() => setViewMode("map")}
                    >
                      <Map className="w-4 h-4" />
                      Map
                    </button>
                  </div>
                )}
              </div>

              {results.length === 0 ? (
                <div className="text-center py-12">
                  <Home className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p className="text-lg opacity-70 mb-2">
                    No listings available in this city
                  </p>
                  <p className="text-sm opacity-60">
                    Try a different city or remove some filters
                  </p>
                </div>
              ) : viewMode === "map" ? (
                /* Map View */
                <div className="space-y-4">
                  <MapView listings={results} />
                  <div className="alert alert-info bg-primary/40">
                    <MapPin className="w-5 h-5" />
                    <span>Click on markers to see listing details</span>
                  </div>
                </div>
              ) : (
                /* Grid View */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.map((listing) => (
                    <div
                      key={listing.listing_id}
                      className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 border border-base-300"
                    >
                      <figure className="relative overflow-hidden">
                        <img
                          src={listing.url}
                          alt={listing.title}
                          className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </figure>

                      <div className="card-body p-5">
                        <h3 className="card-title text-lg font-bold line-clamp-1">
                          {listing.title}
                        </h3>
                        <p className="text-sm opacity-70 line-clamp-2 mb-2">
                          {listing.description || "No description provided"}
                        </p>

                        <div className="text-xs opacity-60 space-y-1 mb-4">
                          <p className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {listing.address}
                          </p>
                          <p className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {listing.city}, {listing.province}{" "}
                            {listing.postal_code}
                          </p>
                          <p className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            Up to {listing.guest_limit} guests
                          </p>
                        </div>

                        <button
                          onClick={() => handleBookingRequest(listing)}
                          className="btn btn-primary btn-sm w-full"
                        >
                          Request Booking
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => {
          setIsBookingModalOpen(false);
          setSelectedListing(null);
        }}
        listing={selectedListing}
        initialDates={{
          checkin: searchParams.checkin,
          checkout: searchParams.checkout,
        }}
      />
    </div>
  );
}
