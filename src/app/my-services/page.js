"use client";

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../providers/AuthProviders";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import PrivateRoute from "../../components/PrivateRoute";
import Link from "next/link";
import {
  FiPlus,
  FiEdit3,
  FiTrash2,
  FiClock,
  FiCalendar,
  FiX,
  FiCheck,
} from "react-icons/fi";
import toast from "react-hot-toast";

const categoryIcons = {
  "baby-care": "👶",
  elderly: "🧓",
  "sick-people": "🏥",
};

const MyServicesPage = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    if (user?.email) {
      axiosSecure
        .get(`/services?email=${user.email}`)
        .then((res) => {
          setServices(res.data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [user, axiosSecure]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this service?")) return;

    try {
      await axiosSecure.delete(`/services/${id}`);
      setServices((prev) => prev.filter((s) => s._id !== id));
      toast.success("Service deleted successfully");
    } catch {
      toast.error("Failed to delete service");
    }
  };

  const openEdit = (service) => {
    setEditingService(service._id);
    setEditForm({
      title: service.title,
      description: service.description,
      chargePerHour: service.chargePerHour,
      chargePerDay: service.chargePerDay,
    });
  };

  const handleUpdate = async (id) => {
    try {
      await axiosSecure.put(`/services/${id}`, editForm);
      setServices((prev) =>
        prev.map((s) => (s._id === id ? { ...s, ...editForm } : s))
      );
      setEditingService(null);
      toast.success("Service updated successfully");
    } catch {
      toast.error("Failed to update service");
    }
  };

  return (
    <PrivateRoute>
      <div className="bg-muted py-10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="animate-fade-in-down mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                My Services
              </h1>
              <p className="mt-2 text-muted-foreground">
                Manage services you have created
              </p>
            </div>
            <Link
              href="/create-service"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-primary-dark hover:shadow-md"
            >
              <FiPlus /> Create New Service
            </Link>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="animate-pulse-soft rounded-xl bg-card p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="h-6 w-48 rounded bg-gray-100" />
                    <div className="h-6 w-20 rounded bg-gray-100" />
                  </div>
                  <div className="mt-4 h-4 w-full rounded bg-gray-50" />
                  <div className="mt-2 h-4 w-2/3 rounded bg-gray-50" />
                </div>
              ))}
            </div>
          ) : services.length === 0 ? (
            <div className="animate-fade-in-up rounded-2xl bg-card py-20 text-center shadow-sm">
              <FiPlus className="mx-auto text-5xl text-muted-foreground/30" />
              <p className="mt-4 text-lg font-medium text-muted-foreground">
                No services created yet
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Create your first care service and start receiving bookings!
              </p>
              <Link
                href="/create-service"
                className="mt-6 inline-block rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
              >
                Create Service
              </Link>
            </div>
          ) : (
            <div className="stagger-children space-y-4">
              {services.map((service) => (
                <div
                  key={service._id}
                  className="animate-fade-in-up rounded-xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:shadow-md sm:p-6"
                >
                  {editingService === service._id ? (
                    /* Edit Mode */
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) =>
                          setEditForm({ ...editForm, title: e.target.value })
                        }
                        className="w-full rounded-lg border border-border py-2.5 px-4 text-sm font-bold outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      />
                      <textarea
                        value={editForm.description}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            description: e.target.value,
                          })
                        }
                        rows={3}
                        className="w-full resize-none rounded-lg border border-border py-2.5 px-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="mb-1 block text-xs text-muted-foreground">
                            Charge/Hour (৳)
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={editForm.chargePerHour}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                chargePerHour: Number(e.target.value),
                              })
                            }
                            className="w-full rounded-lg border border-border py-2 px-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs text-muted-foreground">
                            Charge/Day (৳)
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={editForm.chargePerDay}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                chargePerDay: Number(e.target.value),
                              })
                            }
                            className="w-full rounded-lg border border-border py-2 px-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdate(service._id)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-primary-dark"
                        >
                          <FiCheck /> Save
                        </button>
                        <button
                          onClick={() => setEditingService(null)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-xs font-medium transition-colors hover:bg-muted"
                        >
                          <FiX /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* View Mode */
                    <>
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">
                            {categoryIcons[service.category] || "💙"}
                          </span>
                          <h3 className="text-lg font-bold text-foreground">
                            {service.title}
                          </h3>
                        </div>
                        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                          {service.category}
                        </span>
                      </div>

                      <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                        {service.description}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-3 text-sm">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">
                          <FiClock className="text-xs" />৳
                          {service.chargePerHour}/hr
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/10 px-3 py-1 font-medium text-secondary">
                          <FiCalendar className="text-xs" />৳
                          {service.chargePerDay}/day
                        </span>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
                        <button
                          onClick={() => openEdit(service)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-xs font-medium transition-all duration-200 hover:border-primary hover:bg-primary/5 hover:text-primary"
                        >
                          <FiEdit3 /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(service._id)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-xs font-medium transition-all duration-200 hover:border-danger hover:bg-danger/5 hover:text-danger"
                        >
                          <FiTrash2 /> Delete
                        </button>
                        <Link
                          href={`/service/${service._id}`}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-xs font-medium transition-all duration-200 hover:border-secondary hover:bg-secondary/5 hover:text-secondary"
                        >
                          View Details
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PrivateRoute>
  );
};

export default MyServicesPage;
