"use client";

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../providers/AuthProviders";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import PrivateRoute from "../../components/PrivateRoute";
import {
  FiMapPin,
  FiClock,
  FiDollarSign,
  FiXCircle,
  FiEye,
  FiCalendar,
} from "react-icons/fi";
import toast from "react-hot-toast";

const statusColors = {
  Pending: "bg-amber-100 text-amber-700",
  Confirmed: "bg-blue-100 text-blue-700",
  Completed: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

const MyBookingsPage = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    if (user?.email) {
      axiosSecure
        .get(`/bookings?email=${user.email}`)
        .then((res) => {
          setBookings(res.data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [user, axiosSecure]);

  const handleCancel = async (id) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    try {
      await axiosSecure.patch(`/bookings/${id}`, { status: "Cancelled" });
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: "Cancelled" } : b))
      );
      toast.success("Booking cancelled successfully");
    } catch {
      toast.error("Failed to cancel booking");
    }
  };

  return (
    <PrivateRoute>
      <div className="bg-muted py-10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="animate-fade-in-down mb-8">
            <h1 className="text-3xl font-bold text-foreground">My Bookings</h1>
            <p className="mt-2 text-muted-foreground">
              Track and manage all your care service bookings
            </p>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse-soft rounded-xl bg-card p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="h-6 w-48 rounded bg-gray-100" />
                    <div className="h-6 w-20 rounded-full bg-gray-100" />
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    <div className="h-4 rounded bg-gray-50" />
                    <div className="h-4 rounded bg-gray-50" />
                    <div className="h-4 rounded bg-gray-50" />
                  </div>
                </div>
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <div className="animate-fade-in-up rounded-2xl bg-card py-20 text-center shadow-sm">
              <FiCalendar className="mx-auto text-5xl text-muted-foreground/30" />
              <p className="mt-4 text-lg font-medium text-muted-foreground">No bookings yet</p>
              <p className="mt-1 text-sm text-muted-foreground">Browse our services and book your first caregiver!</p>
              <a href="/#services" className="mt-6 inline-block rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark">
                Explore Services
              </a>
            </div>
          ) : (
            <div className="stagger-children space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking._id}
                  className="animate-fade-in-up rounded-xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:shadow-md sm:p-6"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-lg font-bold text-foreground">{booking.serviceName}</h3>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColors[booking.status] || statusColors.Pending}`}>
                      {booking.status}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-3 text-sm text-muted-foreground sm:grid-cols-3">
                    <div className="flex items-center gap-2">
                      <FiClock className="shrink-0 text-primary" />
                      <span>{booking.durationValue} {booking.durationType}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiMapPin className="shrink-0 text-secondary" />
                      <span className="truncate">{booking.area}, {booking.district}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiDollarSign className="shrink-0 text-accent" />
                      <span className="font-semibold text-foreground">৳{booking.totalCost}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
                    <button
                      onClick={() => setSelectedBooking(booking)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-xs font-medium transition-all duration-200 hover:border-primary hover:bg-primary/5 hover:text-primary"
                    >
                      <FiEye /> View Details
                    </button>
                    {booking.status === "Pending" && (
                      <button
                        onClick={() => handleCancel(booking._id)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-xs font-medium transition-all duration-200 hover:border-danger hover:bg-danger/5 hover:text-danger"
                      >
                        <FiXCircle /> Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setSelectedBooking(null)}>
          <div className="animate-scale-in w-full max-w-lg rounded-2xl bg-card p-6 shadow-2xl sm:p-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">Booking Details</h2>
              <button onClick={() => setSelectedBooking(null)} className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">&times;</button>
            </div>
            <div className="mt-5 space-y-3 text-sm">
              {[
                ["Service", selectedBooking.serviceName],
                ["Duration", `${selectedBooking.durationValue} ${selectedBooking.durationType}`],
                ["Location", `${selectedBooking.area}, ${selectedBooking.city}, ${selectedBooking.district}, ${selectedBooking.division}`],
                ["Address", selectedBooking.address],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium text-right max-w-[60%]">{value}</span>
                </div>
              ))}
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">Total Cost</span>
                <span className="text-lg font-bold text-primary">৳{selectedBooking.totalCost}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className={`rounded-full px-3 py-0.5 text-xs font-semibold ${statusColors[selectedBooking.status] || statusColors.Pending}`}>
                  {selectedBooking.status}
                </span>
              </div>
            </div>
            <button onClick={() => setSelectedBooking(null)} className="mt-6 w-full rounded-lg bg-muted py-2.5 text-sm font-medium transition-colors hover:bg-border">Close</button>
          </div>
        </div>
      )}
    </PrivateRoute>
  );
};

export default MyBookingsPage;
