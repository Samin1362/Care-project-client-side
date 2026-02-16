"use client";

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../providers/AuthProviders";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import AdminRoute from "../../components/AdminRoute";
import {
  FiDollarSign,
  FiUsers,
  FiCalendar,
  FiLayers,
  FiChevronDown,
  FiShield,
  FiUser,
} from "react-icons/fi";
import toast from "react-hot-toast";

const statusColors = {
  Pending: "bg-amber-100 text-amber-700",
  Confirmed: "bg-blue-100 text-blue-700",
  Completed: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const adminEmail = user?.email;

  // Fetch stats
  useEffect(() => {
    if (!adminEmail) return;
    axiosSecure
      .get(`/admin/stats?email=${adminEmail}`)
      .then((res) => setStats(res.data))
      .catch(() => {});
  }, [adminEmail, axiosSecure]);

  // Fetch bookings
  useEffect(() => {
    if (!adminEmail) return;
    const url = statusFilter
      ? `/admin/bookings?email=${adminEmail}&status=${statusFilter}`
      : `/admin/bookings?email=${adminEmail}`;
    axiosSecure
      .get(url)
      .then((res) => {
        setBookings(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [adminEmail, statusFilter, axiosSecure]);

  // Fetch users
  useEffect(() => {
    if (!adminEmail || activeTab !== "users") return;
    axiosSecure
      .get(`/admin/users?email=${adminEmail}`)
      .then((res) => setUsers(res.data))
      .catch(() => {});
  }, [adminEmail, activeTab, axiosSecure]);

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await axiosSecure.patch(`/bookings/${bookingId}`, { status: newStatus });
      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, status: newStatus } : b
        )
      );
      toast.success(`Booking status updated to ${newStatus}`);
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleRoleChange = async (email, newRole) => {
    if (email === adminEmail) {
      toast.error("You cannot change your own role");
      return;
    }
    try {
      await axiosSecure.patch(
        `/admin/users/${email}/role?email=${adminEmail}`,
        { role: newRole }
      );
      setUsers((prev) =>
        prev.map((u) => (u.email === email ? { ...u, role: newRole } : u))
      );
      toast.success(
        `${email} is now ${newRole === "admin" ? "an Admin" : "a User"}`
      );
    } catch {
      toast.error("Failed to update role");
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: FiLayers },
    { id: "bookings", label: "Bookings", icon: FiCalendar },
    { id: "users", label: "Users", icon: FiUsers },
  ];

  return (
    <AdminRoute>
      <div className="bg-muted py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="animate-fade-in-down mb-8">
            <h1 className="text-3xl font-bold text-foreground">
              Admin Dashboard
            </h1>
            <p className="mt-2 text-muted-foreground">
              Manage bookings, users, and services
            </p>
          </div>

          {/* Tabs */}
          <div className="mb-6 flex gap-1 rounded-lg bg-card p-1 shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-md py-2.5 text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-primary text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon className="text-base" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="animate-fade-in-up">
              {/* Stats Grid */}
              {stats ? (
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                  {[
                    {
                      label: "Total Bookings",
                      value: stats.totalBookings,
                      icon: FiCalendar,
                      color: "text-primary",
                      bg: "bg-primary/10",
                    },
                    {
                      label: "Total Revenue",
                      value: `৳${stats.totalRevenue.toLocaleString()}`,
                      icon: FiDollarSign,
                      color: "text-success",
                      bg: "bg-success/10",
                    },
                    {
                      label: "Total Users",
                      value: stats.totalUsers,
                      icon: FiUsers,
                      color: "text-secondary",
                      bg: "bg-secondary/10",
                    },
                    {
                      label: "Total Services",
                      value: stats.totalServices,
                      icon: FiLayers,
                      color: "text-accent",
                      bg: "bg-accent/10",
                    },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:shadow-md"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-lg ${stat.bg}`}
                        >
                          <stat.icon className={`text-xl ${stat.color}`} />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">
                            {stat.label}
                          </p>
                          <p className="text-xl font-bold text-foreground">
                            {stat.value}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="animate-pulse-soft rounded-xl bg-card p-5 shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-11 rounded-lg bg-gray-100" />
                        <div className="space-y-2">
                          <div className="h-3 w-16 rounded bg-gray-100" />
                          <div className="h-5 w-12 rounded bg-gray-100" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Status Breakdown */}
              {stats?.statusCounts && (
                <div className="mt-6 rounded-xl border border-border bg-card p-6 shadow-sm">
                  <h3 className="mb-4 text-lg font-semibold text-foreground">
                    Booking Status Breakdown
                  </h3>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {["Pending", "Confirmed", "Completed", "Cancelled"].map(
                      (status) => {
                        const count =
                          stats.statusCounts.find((s) => s._id === status)
                            ?.count || 0;
                        return (
                          <div
                            key={status}
                            className="rounded-lg border border-border p-4 text-center"
                          >
                            <span
                              className={`inline-block rounded-full px-3 py-0.5 text-xs font-semibold ${statusColors[status]}`}
                            >
                              {status}
                            </span>
                            <p className="mt-2 text-2xl font-bold text-foreground">
                              {count}
                            </p>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              )}

              {/* Recent Bookings Preview */}
              <div className="mt-6 rounded-xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground">
                    Recent Bookings
                  </h3>
                  <button
                    onClick={() => setActiveTab("bookings")}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    View All
                  </button>
                </div>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-border text-xs uppercase text-muted-foreground">
                        <th className="pb-3 pr-4">Service</th>
                        <th className="pb-3 pr-4">User</th>
                        <th className="pb-3 pr-4">Cost</th>
                        <th className="pb-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading
                        ? [1, 2, 3].map((i) => (
                            <tr key={i} className="border-b border-border">
                              <td className="py-3 pr-4">
                                <div className="h-4 w-24 animate-pulse-soft rounded bg-gray-100" />
                              </td>
                              <td className="py-3 pr-4">
                                <div className="h-4 w-32 animate-pulse-soft rounded bg-gray-100" />
                              </td>
                              <td className="py-3 pr-4">
                                <div className="h-4 w-16 animate-pulse-soft rounded bg-gray-100" />
                              </td>
                              <td className="py-3">
                                <div className="h-5 w-16 animate-pulse-soft rounded-full bg-gray-100" />
                              </td>
                            </tr>
                          ))
                        : bookings.slice(0, 5).map((booking) => (
                            <tr
                              key={booking._id}
                              className="border-b border-border"
                            >
                              <td className="py-3 pr-4 font-medium text-foreground">
                                {booking.serviceName}
                              </td>
                              <td className="py-3 pr-4 text-muted-foreground">
                                {booking.userEmail}
                              </td>
                              <td className="py-3 pr-4 font-medium text-foreground">
                                ৳{booking.totalCost}
                              </td>
                              <td className="py-3">
                                <span
                                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                    statusColors[booking.status] ||
                                    statusColors.Pending
                                  }`}
                                >
                                  {booking.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Bookings Tab */}
          {activeTab === "bookings" && (
            <div className="animate-fade-in-up">
              {/* Filter */}
              <div className="mb-4 flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                  Filter by:
                </span>
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="appearance-none rounded-lg border border-border bg-card py-2 pl-3 pr-8 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  >
                    <option value="">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  <FiChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground" />
                </div>
              </div>

              {/* Bookings Table */}
              <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted text-xs uppercase text-muted-foreground">
                      <th className="px-4 py-3">Service</th>
                      <th className="px-4 py-3">User</th>
                      <th className="px-4 py-3">Duration</th>
                      <th className="px-4 py-3">Location</th>
                      <th className="px-4 py-3">Cost</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-4 py-12 text-center text-muted-foreground"
                        >
                          No bookings found
                        </td>
                      </tr>
                    ) : (
                      bookings.map((booking) => (
                        <tr
                          key={booking._id}
                          className="border-b border-border transition-colors hover:bg-muted/50"
                        >
                          <td className="px-4 py-3 font-medium text-foreground">
                            {booking.serviceName}
                          </td>
                          <td className="px-4 py-3">
                            <div>
                              <p className="font-medium text-foreground">
                                {booking.userName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {booking.userEmail}
                              </p>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {booking.durationValue} {booking.durationType}
                          </td>
                          <td className="max-w-[150px] truncate px-4 py-3 text-muted-foreground">
                            {booking.district}, {booking.division}
                          </td>
                          <td className="px-4 py-3 font-semibold text-foreground">
                            ৳{booking.totalCost}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                statusColors[booking.status] ||
                                statusColors.Pending
                              }`}
                            >
                              {booking.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {booking.status !== "Cancelled" &&
                              booking.status !== "Completed" && (
                                <div className="relative">
                                  <select
                                    value=""
                                    onChange={(e) => {
                                      if (e.target.value) {
                                        handleStatusChange(
                                          booking._id,
                                          e.target.value
                                        );
                                      }
                                    }}
                                    className="appearance-none rounded border border-border bg-card py-1 pl-2 pr-6 text-xs outline-none focus:border-primary"
                                  >
                                    <option value="">Change</option>
                                    {booking.status === "Pending" && (
                                      <option value="Confirmed">
                                        Confirm
                                      </option>
                                    )}
                                    {(booking.status === "Pending" ||
                                      booking.status === "Confirmed") && (
                                      <option value="Completed">
                                        Complete
                                      </option>
                                    )}
                                    {booking.status !== "Cancelled" && (
                                      <option value="Cancelled">Cancel</option>
                                    )}
                                  </select>
                                  <FiChevronDown className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground" />
                                </div>
                              )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <div className="animate-fade-in-up">
              <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted text-xs uppercase text-muted-foreground">
                      <th className="px-4 py-3">User</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Contact</th>
                      <th className="px-4 py-3">Role</th>
                      <th className="px-4 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-4 py-12 text-center text-muted-foreground"
                        >
                          Loading users...
                        </td>
                      </tr>
                    ) : (
                      users.map((u) => (
                        <tr
                          key={u._id}
                          className="border-b border-border transition-colors hover:bg-muted/50"
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                                {u.photoURL ? (
                                  <img
                                    src={u.photoURL}
                                    alt=""
                                    className="h-8 w-8 rounded-full object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                ) : (
                                  (u.name || u.email).charAt(0).toUpperCase()
                                )}
                              </div>
                              <span className="font-medium text-foreground">
                                {u.name || "—"}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {u.email}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {u.contact || "—"}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                u.role === "admin"
                                  ? "bg-primary/10 text-primary"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {u.role === "admin" ? (
                                <FiShield className="text-[10px]" />
                              ) : (
                                <FiUser className="text-[10px]" />
                              )}
                              {u.role}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {u.email !== adminEmail && (
                              <button
                                onClick={() =>
                                  handleRoleChange(
                                    u.email,
                                    u.role === "admin" ? "user" : "admin"
                                  )
                                }
                                className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                                  u.role === "admin"
                                    ? "border-danger/30 text-danger hover:bg-danger/5"
                                    : "border-primary/30 text-primary hover:bg-primary/5"
                                }`}
                              >
                                {u.role === "admin"
                                  ? "Remove Admin"
                                  : "Make Admin"}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminRoute>
  );
};

export default AdminDashboard;
