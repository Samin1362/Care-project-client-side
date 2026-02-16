"use client";

import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "../../providers/AuthProviders";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import PrivateRoute from "../../components/PrivateRoute";
import {
  FiPlus,
  FiX,
  FiDollarSign,
  FiTag,
  FiFileText,
  FiImage,
  FiList,
} from "react-icons/fi";
import toast from "react-hot-toast";

const categories = [
  { value: "baby-care", label: "Baby Care", icon: "👶" },
  { value: "elderly", label: "Elderly Care", icon: "🧓" },
  { value: "sick-people", label: "Sick People Care", icon: "🏥" },
];

const CreateServicePage = () => {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const axiosSecure = useAxiosSecure();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [chargePerHour, setChargePerHour] = useState("");
  const [chargePerDay, setChargePerDay] = useState("");
  const [image, setImage] = useState("");
  const [features, setFeatures] = useState([""]);
  const [submitting, setSubmitting] = useState(false);

  const addFeature = () => setFeatures([...features, ""]);

  const removeFeature = (index) => {
    if (features.length === 1) return;
    setFeatures(features.filter((_, i) => i !== index));
  };

  const updateFeature = (index, value) => {
    const updated = [...features];
    updated[index] = value;
    setFeatures(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const filteredFeatures = features.filter((f) => f.trim() !== "");
    if (filteredFeatures.length === 0) {
      toast.error("Please add at least one feature");
      return;
    }

    setSubmitting(true);

    const serviceData = {
      title,
      description,
      category,
      chargePerHour: Number(chargePerHour),
      chargePerDay: Number(chargePerDay),
      image: image || "https://i.ibb.co/placeholder.jpg",
      features: filteredFeatures,
      createdBy: user.email,
    };

    try {
      await axiosSecure.post("/services", serviceData);
      toast.success("Service created successfully!");
      router.push("/my-services");
    } catch {
      toast.error("Failed to create service. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PrivateRoute>
      <div className="bg-muted py-10">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="animate-fade-in-down mb-8">
            <h1 className="text-3xl font-bold text-foreground">
              Create a Service
            </h1>
            <p className="mt-2 text-muted-foreground">
              List your care service and start receiving bookings
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="animate-fade-in-up space-y-6 rounded-2xl bg-card p-6 shadow-sm sm:p-8"
          >
            {/* Title */}
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-foreground">
                <FiFileText className="text-primary" />
                Service Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g. Professional Baby Sitting"
                className="w-full rounded-lg border border-border py-2.5 px-4 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Description */}
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-foreground">
                <FiList className="text-primary" />
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
                placeholder="Describe your service in detail..."
                className="w-full resize-none rounded-lg border border-border py-2.5 px-4 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Category */}
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-foreground">
                <FiTag className="text-primary" />
                Category
              </label>
              <div className="grid grid-cols-3 gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setCategory(cat.value)}
                    className={`flex flex-col items-center gap-1.5 rounded-lg border-2 py-4 text-sm font-medium transition-all duration-200 ${
                      category === cat.value
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border text-muted-foreground hover:border-gray-300"
                    }`}
                  >
                    <span className="text-2xl">{cat.icon}</span>
                    {cat.label}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={category}
                required
                readOnly
                className="sr-only"
                tabIndex={-1}
              />
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-foreground">
                  <FiDollarSign className="text-primary" />
                  Charge Per Hour (৳)
                </label>
                <input
                  type="number"
                  min="1"
                  value={chargePerHour}
                  onChange={(e) => setChargePerHour(e.target.value)}
                  required
                  placeholder="e.g. 150"
                  className="w-full rounded-lg border border-border py-2.5 px-4 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-foreground">
                  <FiDollarSign className="text-secondary" />
                  Charge Per Day (৳)
                </label>
                <input
                  type="number"
                  min="1"
                  value={chargePerDay}
                  onChange={(e) => setChargePerDay(e.target.value)}
                  required
                  placeholder="e.g. 1200"
                  className="w-full rounded-lg border border-border py-2.5 px-4 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-foreground">
                <FiImage className="text-primary" />
                Image URL (optional)
              </label>
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full rounded-lg border border-border py-2.5 px-4 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Features */}
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-foreground">
                <FiList className="text-primary" />
                Features
              </label>
              <div className="space-y-2">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                      placeholder={`Feature ${index + 1}`}
                      className="flex-1 rounded-lg border border-border py-2.5 px-4 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                    {features.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-danger hover:bg-danger/5 hover:text-danger"
                      >
                        <FiX />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addFeature}
                className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-dashed border-border px-4 py-2 text-xs font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <FiPlus /> Add Feature
              </button>
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
                  Creating...
                </>
              ) : (
                <>
                  <FiPlus />
                  Create Service
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </PrivateRoute>
  );
};

export default CreateServicePage;
