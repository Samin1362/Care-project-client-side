"use client";

import { useContext, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AuthContext } from "../../../providers/AuthProviders";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import { FiCheckCircle, FiClock, FiCalendar, FiArrowLeft } from "react-icons/fi";
import Link from "next/link";

const categoryIcons = {
  "baby-care": "👶",
  elderly: "🧓",
  "sick-people": "🏥",
};

const ServiceDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const axiosPublic = useAxiosPublic();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosPublic
      .get(`/services/${id}`)
      .then((res) => {
        setService(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, axiosPublic]);

  const handleBookService = () => {
    if (user) {
      router.push(`/booking/${id}`);
    } else {
      router.push("/login");
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <div className="animate-pulse-soft space-y-6">
          <div className="h-8 w-48 rounded bg-gray-100" />
          <div className="h-64 rounded-2xl bg-gray-100" />
          <div className="h-6 w-3/4 rounded bg-gray-100" />
          <div className="h-4 w-full rounded bg-gray-50" />
          <div className="h-4 w-2/3 rounded bg-gray-50" />
        </div>
      </div>
    );
  }

  if (!service || service.message) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
        <p className="text-lg text-muted-foreground">Service not found.</p>
        <Link href="/" className="mt-4 text-primary hover:underline">Go back home</Link>
      </div>
    );
  }

  return (
    <div className="bg-muted py-10">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Link href="/#services" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary">
          <FiArrowLeft />
          Back to Services
        </Link>

        <div className="animate-fade-in-up overflow-hidden rounded-2xl bg-card shadow-lg">
          <div className="flex h-56 items-center justify-center bg-gradient-to-br from-primary/10 via-white to-secondary/10 sm:h-72">
            <span className="text-8xl transition-transform duration-500 hover:scale-110">
              {categoryIcons[service.category] || "💙"}
            </span>
          </div>

          <div className="p-6 sm:p-10">
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">{service.title}</h1>
            <p className="mt-4 leading-relaxed text-muted-foreground">{service.description}</p>

            <div className="mt-8 flex flex-wrap gap-4">
              <div className="flex items-center gap-2.5 rounded-xl border border-border bg-muted px-5 py-3">
                <FiClock className="text-xl text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Per Hour</p>
                  <p className="text-lg font-bold text-primary">৳{service.chargePerHour}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 rounded-xl border border-border bg-muted px-5 py-3">
                <FiCalendar className="text-xl text-secondary" />
                <div>
                  <p className="text-xs text-muted-foreground">Per Day</p>
                  <p className="text-lg font-bold text-secondary">৳{service.chargePerDay}</p>
                </div>
              </div>
            </div>

            {service.features && service.features.length > 0 && (
              <div className="mt-8">
                <h3 className="mb-4 text-lg font-semibold text-foreground">What&apos;s Included</h3>
                <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <FiCheckCircle className="mt-0.5 shrink-0 text-success" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              onClick={handleBookService}
              className="mt-10 w-full rounded-lg bg-primary py-3.5 text-base font-semibold text-white shadow-lg shadow-primary/25 transition-all duration-200 hover:bg-primary-dark hover:shadow-xl sm:w-auto sm:px-12"
            >
              Book This Service
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailPage;
