import React, { useEffect, useState } from "react";
import { X, Calendar, User, CheckCircle, XCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function ViewRequestsModal({ isOpen, onClose, listing }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    if (isOpen && listing) {
      fetchRequests();
    }
  }, [isOpen, listing]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/listing/${
          listing.listing_id
        }/requests`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!res.ok) throw new Error("Failed to fetch requests");
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    setProcessingId(bookingId);
    const loadingToast = toast.loading(
      `${newStatus === "Approved" ? "Approving" : "Rejecting"} request...`
    );

    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/booking/${bookingId}`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error);
      }

      toast.success(`Request ${newStatus.toLowerCase()} successfully`, {
        id: loadingToast,
      });
      fetchRequests(); // Refresh
    } catch (err) {
      toast.error(err.message, {
        id: loadingToast,
      });
    } finally {
      setProcessingId(null);
    }
  };

  if (!isOpen || !listing) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="bg-base-100 rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-base-300">
          <div>
            <h2 className="text-2xl font-bold text-base-content">
              Booking Requests
            </h2>
            <p className="text-sm opacity-70 mt-1">{listing.title}</p>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="loading loading-spinner loading-lg text-primary"></div>
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-12">
              <User className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg opacity-70">No requests yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <div
                  key={request.booking_id}
                  className="card bg-base-200 border border-base-300"
                >
                  <div className="card-body">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">
                          {request.guest_name || "Guest"}
                        </h3>
                        <p className="text-sm opacity-70">
                          {request.guest_email}
                        </p>
                      </div>
                      <div
                        className={`badge ${
                          request.status === "Pending"
                            ? "badge-warning"
                            : request.status === "Approved"
                            ? "badge-success"
                            : "badge-error"
                        }`}
                      >
                        {request.status}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-2 text-sm opacity-70">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(request.start_date).toLocaleDateString()} -{" "}
                        {new Date(request.end_date).toLocaleDateString()}
                      </span>
                    </div>

                    {request.status === "Pending" && (
                      <div className="card-actions justify-end mt-4">
                        <button
                          onClick={() =>
                            handleStatusUpdate(request.booking_id, "Rejected")
                          }
                          disabled={processingId === request.booking_id}
                          className="btn btn-error btn-sm"
                        >
                          {processingId === request.booking_id ? (
                            <span className="loading loading-spinner loading-xs"></span>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4" />
                              Reject
                            </>
                          )}
                        </button>
                        <button
                          onClick={() =>
                            handleStatusUpdate(request.booking_id, "Approved")
                          }
                          disabled={processingId === request.booking_id}
                          className="btn btn-success btn-sm"
                        >
                          {processingId === request.booking_id ? (
                            <span className="loading loading-spinner loading-xs"></span>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4" />
                              Approve
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
