import React, { useState } from "react";
import { X, Calendar } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

export default function BookingModal({
  isOpen,
  onClose,
  listing,
  initialDates,
}) {
  const navigate = useNavigate();
  const [dates, setDates] = useState({
    checkin: initialDates?.checkin || "",
    checkout: initialDates?.checkout || "",
  });
  const [submitting, setSubmitting] = useState(false);

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const calculateNights = () => {
    if (!dates.checkin || !dates.checkout) return 0;
    const start = new Date(dates.checkin);
    const end = new Date(dates.checkout);
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights : 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!dates.checkin || !dates.checkout) {
      toast.error("Please select both check-in and check-out dates");
      return;
    }

    if (new Date(dates.checkout) <= new Date(dates.checkin)) {
      toast.error("Check-out date must be after check-in date");
      return;
    }

    setSubmitting(true);
    const loadingToast = toast.loading("Submitting booking request...");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/booking/create`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            listing_id: listing.listing_id,
            start_date: dates.checkin,
            end_date: dates.checkout,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create booking");
      }

      toast.success("Booking request submitted successfully!", {
        id: loadingToast,
      });

      onClose();
      navigate("/guestDashboard");
    } catch (err) {
      console.error(err);
      toast.error(err.message, {
        id: loadingToast,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen || !listing) return null;

  const nights = calculateNights();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="bg-base-100 rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-base-300">
          <div>
            <h2 className="text-2xl font-bold text-base-content">
              Request Booking
            </h2>
            <p className="text-sm opacity-70 mt-1">{listing.title}</p>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Listing Preview */}
          <div className="flex gap-4 mb-6 p-4 bg-base-200 rounded-lg">
            <img
              src={listing.url}
              alt={listing.title}
              className="w-24 h-24 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="font-bold text-lg">{listing.title}</h3>
              <p className="text-sm opacity-70">
                {listing.city}, {listing.province}
              </p>
              <p className="text-xs opacity-60 mt-1">
                Up to {listing.guest_limit} guests
              </p>
            </div>
          </div>

          {/* Date Selection */}
          <div className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Check-in Date *
                </span>
              </label>
              <input
                type="date"
                className="input input-bordered w-full"
                value={dates.checkin}
                onChange={(e) =>
                  setDates((prev) => ({ ...prev, checkin: e.target.value }))
                }
                min={getTodayDate()}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Check-out Date *
                </span>
              </label>
              <input
                type="date"
                className="input input-bordered w-full"
                value={dates.checkout}
                onChange={(e) =>
                  setDates((prev) => ({ ...prev, checkout: e.target.value }))
                }
                min={dates.checkin || getTodayDate()}
                required
              />
            </div>

            {nights > 0 && (
              <div className="alert alert-info">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>
                    <strong>{nights}</strong>{" "}
                    {nights === 1 ? "night" : "nights"}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t border-base-300">
            <button type="button" onClick={onClose} className="btn btn-ghost">
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || nights === 0}
              className="btn btn-primary"
            >
              {submitting ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Submitting...
                </>
              ) : (
                "Submit Request"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
