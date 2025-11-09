import React, { useEffect, useState } from "react";
import NavBarGuest from "../components/Nav/NavBarGuest";
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Home,
  MapPin,
} from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router";

export default function GuestDashboardPage() {
  const [bookings, setBookings] = useState({
    pending: [],
    approved: [],
    past: [],
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const [pendingRes, approvedRes, pastRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_SERVER_BASE_URL}/api/booking/pending`, {
          method: "GET",
          credentials: "include",
        }),
        fetch(`${import.meta.env.VITE_SERVER_BASE_URL}/api/booking/approved`, {
          method: "GET",
          credentials: "include",
        }),
        fetch(`${import.meta.env.VITE_SERVER_BASE_URL}/api/booking/past`, {
          method: "GET",
          credentials: "include",
        }),
      ]);

      if (!pendingRes.ok || !approvedRes.ok || !pastRes.ok) {
        throw new Error("Failed to fetch bookings");
      }

      const [pending, approved, past] = await Promise.all([
        pendingRes.json(),
        approvedRes.json(),
        pastRes.json(),
      ]);

      setBookings({ pending, approved, past });
    } catch (err) {
      console.error(err);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!confirm("Are you sure you want to cancel this booking request?")) {
      return;
    }

    setCancellingId(bookingId);
    const loadingToast = toast.loading("Cancelling booking...");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/booking/${bookingId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to cancel booking");
      }

      toast.success("Booking cancelled successfully", {
        id: loadingToast,
      });
      fetchBookings();
    } catch (err) {
      console.error(err);
      toast.error(err.message, {
        id: loadingToast,
      });
    } finally {
      setCancellingId(null);
    }
  };

  const BookingCard = ({ booking, showActions = false }) => {
    const startDate = new Date(booking.start_date);
    const endDate = new Date(booking.end_date);
    const nights = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

    return (
      <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 border border-base-300">
        <div className="card-body">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="card-title text-lg font-bold">
                {booking.listing_title || "Listing"}
              </h3>
              <p className="text-sm opacity-70 flex items-center  justify-centre gap-1 mt-1">
                <MapPin className="w-2 h-2" />
                {`${booking.address}, ${booking.city}, ${booking.province}`}
              </p>
            </div>
            <div
              className={`badge ${
                booking.status === "Pending"
                  ? "badge-warning"
                  : booking.status === "Approved"
                  ? "badge-success"
                  : booking.status === "Rejected"
                  ? "badge-error"
                  : "badge-ghost"
              }`}
            >
              {booking.status}
            </div>
          </div>

          <div className="divider my-2"></div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 opacity-70" />
              <span>
                <strong>Check-in:</strong>{" "}
                {startDate.toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 opacity-70" />
              <span>
                <strong>Check-out:</strong>{" "}
                {endDate.toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 opacity-70" />
              <span>
                <strong>{nights}</strong> {nights === 1 ? "night" : "nights"}
              </span>
            </div>
          </div>

          {showActions && (
            <div className="card-actions justify-end mt-4">
              <button
                onClick={() => handleCancelBooking(booking.booking_id)}
                disabled={cancellingId === booking.booking_id}
                className="btn btn-error btn-sm"
              >
                {cancellingId === booking.booking_id ? (
                  <span className="loading loading-spinner loading-xs"></span>
                ) : (
                  <>
                    <XCircle className="w-4 h-4" />
                    Cancel
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    );
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
            Loading your bookings...
          </p>
        </div>
      </div>
    );
  }

  const totalBookings =
    bookings.pending.length + bookings.approved.length + bookings.past.length;

  return (
    <div className="min-h-screen bg-base-200" data-theme="autumn">
      <NavBarGuest />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-black leading-tight">
                  Your Bookings
                </h1>
                <p className="text-base md:text-lg opacity-80 mt-1">
                  {totalBookings} {totalBookings === 1 ? "booking" : "bookings"}{" "}
                  total
                </p>
              </div>
            </div>

            {/* Tabs */}
            <div className="tabs tabs-boxed bg-base-200 mb-6">
              <button
                className={`tab ${activeTab === "pending" ? "tab-active" : ""}`}
                onClick={() => setActiveTab("pending")}
              >
                Pending ({bookings.pending.length})
              </button>
              <button
                className={`tab ${
                  activeTab === "approved" ? "tab-active" : ""
                }`}
                onClick={() => setActiveTab("approved")}
              >
                Approved ({bookings.approved.length})
              </button>
              <button
                className={`tab ${activeTab === "past" ? "tab-active" : ""}`}
                onClick={() => setActiveTab("past")}
              >
                Past ({bookings.past.length})
              </button>
            </div>

            {/* Bookings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeTab === "pending" &&
                (bookings.pending.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <Clock className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p className="text-lg opacity-70">No pending bookings</p>
                  </div>
                ) : (
                  bookings.pending.map((booking) => (
                    <BookingCard
                      key={booking.booking_id}
                      booking={booking}
                      showActions={true}
                    />
                  ))
                ))}

              {activeTab === "approved" &&
                (bookings.approved.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <CheckCircle className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p className="text-lg opacity-70">No approved bookings</p>
                  </div>
                ) : (
                  bookings.approved.map((booking) => (
                    <BookingCard
                      key={booking.booking_id}
                      booking={booking}
                      showActions={true}
                    />
                  ))
                ))}

              {activeTab === "past" &&
                (bookings.past.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <Calendar className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p className="text-lg opacity-70">No past bookings</p>
                  </div>
                ) : (
                  bookings.past.map((booking) => (
                    <BookingCard
                      key={booking.booking_id}
                      booking={booking}
                      showActions={false}
                    />
                  ))
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
