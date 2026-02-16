"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import useAxiosPublic from "../hooks/useAxiosPublic";

const categoryIcons = {
  "baby-care": "👶",
  elderly: "🧓",
  "sick-people": "🏥",
};

const categoryColors = {
  "baby-care": { bg: "bg-blue-50", text: "text-primary", border: "border-blue-100" },
  elderly: { bg: "bg-cyan-50", text: "text-secondary", border: "border-cyan-100" },
  "sick-people": { bg: "bg-amber-50", text: "text-accent", border: "border-amber-100" },
};

const ServicesSection = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosPublic = useAxiosPublic();

  useEffect(() => {
    axiosPublic
      .get("/services")
      .then((res) => {
        setServices(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [axiosPublic]);

  if (loading) {
    return (
      <section id="services" className="bg-muted py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground">Our Services</h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Choose from our range of professional care services
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse-soft rounded-xl bg-card p-6 shadow-sm">
                <div className="h-44 rounded-lg bg-gray-100" />
                <div className="mt-4 h-6 w-3/4 rounded bg-gray-100" />
                <div className="mt-2 h-4 w-full rounded bg-gray-50" />
                <div className="mt-1 h-4 w-2/3 rounded bg-gray-50" />
                <div className="mt-5 h-10 rounded-lg bg-gray-100" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="bg-muted py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="animate-fade-in-up text-center">
          <h2 className="text-3xl font-bold text-foreground">Our Services</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Choose from our range of professional care services
          </p>
        </div>
        <div className="stagger-children mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {services.map((service) => {
            const colors = categoryColors[service.category] || categoryColors["baby-care"];
            return (
              <div
                key={service._id}
                className="group animate-fade-in-up rounded-xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className={`flex h-44 items-center justify-center rounded-lg ${colors.bg} ${colors.border} border transition-colors duration-300`}>
                  <span className="text-6xl transition-transform duration-300 group-hover:scale-110">
                    {categoryIcons[service.category] || "💙"}
                  </span>
                </div>

                <h3 className="mt-5 text-xl font-bold text-foreground">{service.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{service.description}</p>

                <div className="mt-4 flex items-center gap-3 text-sm">
                  <span className="rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary">৳{service.chargePerHour}/hr</span>
                  <span className="rounded-full bg-secondary/10 px-3 py-1 font-semibold text-secondary">৳{service.chargePerDay}/day</span>
                </div>

                <Link
                  href={`/service/${service._id}`}
                  className="group/btn mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-primary-dark hover:shadow-md"
                >
                  View Details
                  <FiArrowRight className="transition-transform duration-200 group-hover/btn:translate-x-1" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
