"use client";

import { useContext, useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { AuthContext } from "../../../providers/AuthProviders";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import PrivateRoute from "../../../components/PrivateRoute";
import {
  FiClock,
  FiCalendar,
  FiMapPin,
  FiHome,
  FiArrowLeft,
  FiCheck,
} from "react-icons/fi";
import Link from "next/link";
import toast from "react-hot-toast";
import axios from "axios";

const BookingPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();

  // Service data
  const [service, setService] = useState(null);
  const [serviceLoading, setServiceLoading] = useState(true);

  // Booking form state
  const [durationType, setDurationType] = useState("hours");
  const [durationValue, setDurationValue] = useState(1);
  const [address, setAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Location state (Zapshift)
  const [divisions, setDivisions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedArea, setSelectedArea] = useState("");

  // Fetch service
  useEffect(() => {
    axiosPublic
      .get(`/services/${id}`)
      .then((res) => {
        setService(res.data);
        setServiceLoading(false);
      })
      .catch(() => setServiceLoading(false));
  }, [id, axiosPublic]);

  // Fetch divisions
  useEffect(() => {
    axios
      .get("https://bdapis.com/api/v1.2/divisions")
      .then((res) => {
        setDivisions(res.data?.data || []);
      })
      .catch(() => {
        // Fallback static divisions if API fails
        setDivisions([
          { division: "Dhaka" },
          { division: "Chittagong" },
          { division: "Rajshahi" },
          { division: "Khulna" },
          { division: "Barishal" },
          { division: "Sylhet" },
          { division: "Rangpur" },
          { division: "Mymensingh" },
        ]);
      });
  }, []);

  // Fetch districts when division changes
  useEffect(() => {
    if (!selectedDivision) {
      setDistricts([]);
      return;
    }
    axios
      .get(`https://bdapis.com/api/v1.2/division/${selectedDivision}`)
      .then((res) => {
        setDistricts(res.data?.data || []);
      })
      .catch(() => setDistricts([]));
    setSelectedDistrict("");
    setSelectedCity("");
    setSelectedArea("");
  }, [selectedDivision]);

  // Calculate total cost
  const totalCost = useMemo(() => {
    if (!service) return 0;
    const rate =
      durationType === "hours" ? service.chargePerHour : service.chargePerDay;
    return rate * (durationValue || 0);
  }, [service, durationType, durationValue]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDivision || !selectedDistrict) {
      toast.error("Please select your location");
      return;
    }

    setSubmitting(true);

    const bookingData = {
      serviceId: id,
      serviceName: service.title,
      userEmail: user.email,
      userName: user.displayName || user.email,
      durationType,
      durationValue: Number(durationValue),
      division: selectedDivision,
      district: selectedDistrict,
      city: selectedCity || selectedDistrict,
      area: selectedArea || "",
      address,
      totalCost,
    };

    try {
      await axiosSecure.post("/bookings", bookingData);
      toast.success("Booking confirmed! Check your email for the invoice.");
      router.push("/my-bookings");
    } catch (error) {
      toast.error("Failed to create booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (serviceLoading) {
    return (
      <PrivateRoute>
        <div className="mx-auto max-w-3xl px-4 py-16">
          <div className="animate-pulse-soft space-y-6">
            <div className="h-8 w-64 rounded bg-gray-100" />
            <div className="h-48 rounded-2xl bg-gray-100" />
            <div className="h-64 rounded-2xl bg-gray-100" />
          </div>
        </div>
      </PrivateRoute>
    );
  }

  if (!service || service.message) {
    return (
      <PrivateRoute>
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
          <p className="text-lg text-muted-foreground">Service not found.</p>
          <Link href="/" className="mt-4 text-primary hover:underline">
            Go back home
          </Link>
        </div>
      </PrivateRoute>
    );
  }

  return (
    <PrivateRoute>
      <div className="bg-muted py-10">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Back */}
          <Link
            href={`/service/${id}`}
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <FiArrowLeft />
            Back to Service
          </Link>

          {/* Service Info Card */}
          <div className="animate-fade-in-up mb-6 rounded-2xl bg-card p-6 shadow-sm">
            <h1 className="text-2xl font-bold text-foreground">
              Book: {service.title}
            </h1>
            <div className="mt-3 flex flex-wrap gap-3 text-sm">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">
                <FiClock className="text-xs" />
                ৳{service.chargePerHour}/hr
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/10 px-3 py-1 font-medium text-secondary">
                <FiCalendar className="text-xs" />
                ৳{service.chargePerDay}/day
              </span>
            </div>
          </div>

          {/* Booking Form */}
          <form
            onSubmit={handleSubmit}
            className="animate-fade-in-up space-y-6 rounded-2xl bg-card p-6 shadow-sm [animation-delay:150ms] sm:p-8"
          >
            {/* Step 1: Duration */}
            <div>
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                  1
                </span>
                Select Duration
              </h2>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setDurationType("hours")}
                  className={`flex-1 rounded-lg border-2 py-3 text-sm font-semibold transition-all duration-200 ${
                    durationType === "hours"
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border text-muted-foreground hover:border-gray-300"
                  }`}
                >
                  <FiClock className="mx-auto mb-1 text-lg" />
                  Hours
                </button>
                <button
                  type="button"
                  onClick={() => setDurationType("days")}
                  className={`flex-1 rounded-lg border-2 py-3 text-sm font-semibold transition-all duration-200 ${
                    durationType === "days"
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border text-muted-foreground hover:border-gray-300"
                  }`}
                >
                  <FiCalendar className="mx-auto mb-1 text-lg" />
                  Days
                </button>
              </div>
              <div className="mt-3">
                <label className="mb-1 block text-sm text-muted-foreground">
                  Number of {durationType}
                </label>
                <input
                  type="number"
                  min="1"
                  max={durationType === "hours" ? 24 : 365}
                  value={durationValue}
                  onChange={(e) => setDurationValue(e.target.value)}
                  required
                  className="w-full rounded-lg border border-border py-2.5 px-4 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            {/* Step 2: Location */}
            <div>
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                  2
                </span>
                Select Location
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {/* Division */}
                <div>
                  <label className="mb-1 block text-sm text-muted-foreground">
                    <FiMapPin className="mr-1 inline text-xs" />
                    Division
                  </label>
                  <select
                    value={selectedDivision}
                    onChange={(e) => setSelectedDivision(e.target.value)}
                    required
                    className="w-full rounded-lg border border-border bg-card py-2.5 px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                  >
                    <option value="">Select Division</option>
                    {divisions.map((d) => (
                      <option key={d.division} value={d.division}>
                        {d.division}
                      </option>
                    ))}
                  </select>
                </div>

                {/* District */}
                <div>
                  <label className="mb-1 block text-sm text-muted-foreground">
                    District
                  </label>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    required
                    className="w-full rounded-lg border border-border bg-card py-2.5 px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                  >
                    <option value="">Select District</option>
                    {districts.map((d) => (
                      <option key={d.district} value={d.district}>
                        {d.district}
                      </option>
                    ))}
                  </select>
                </div>

                {/* City */}
                <div>
                  <label className="mb-1 block text-sm text-muted-foreground">
                    City
                  </label>
                  <input
                    type="text"
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    placeholder="Enter city name"
                    className="w-full rounded-lg border border-border py-2.5 px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>

                {/* Area */}
                <div>
                  <label className="mb-1 block text-sm text-muted-foreground">
                    Area
                  </label>
                  <input
                    type="text"
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.target.value)}
                    placeholder="Enter area"
                    className="w-full rounded-lg border border-border py-2.5 px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="mt-3">
                <label className="mb-1 block text-sm text-muted-foreground">
                  <FiHome className="mr-1 inline text-xs" />
                  Full Address
                </label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  rows={2}
                  placeholder="House/Road/Block details..."
                  className="w-full resize-none rounded-lg border border-border py-2.5 px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            {/* Step 3: Cost Summary */}
            <div>
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                  3
                </span>
                Cost Summary
              </h2>
              <div className="rounded-xl border border-border bg-muted p-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Rate</span>
                  <span className="font-medium">
                    ৳
                    {durationType === "hours"
                      ? service.chargePerHour
                      : service.chargePerDay}
                    /{durationType === "hours" ? "hr" : "day"}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium">
                    {durationValue} {durationType}
                  </span>
                </div>
                <div className="mt-3 border-t border-border pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-semibold">Total Cost</span>
                    <span className="text-2xl font-bold text-primary">
                      ৳{totalCost.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3.5 text-base font-semibold text-white shadow-lg shadow-primary/25 transition-all duration-200 hover:bg-primary-dark hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Processing...
                </>
              ) : (
                <>
                  <FiCheck />
                  Confirm Booking
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </PrivateRoute>
  );
};

export default BookingPage;
