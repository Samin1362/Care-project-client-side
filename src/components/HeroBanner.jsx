"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

const slides = [
  {
    title: "Trusted Care for Your Little Ones",
    subtitle:
      "Professional babysitting services that keep your children safe, happy, and engaged all day long.",
    accent: "text-primary",
    emoji: "👶",
  },
  {
    title: "Compassionate Elderly Care",
    subtitle:
      "Dedicated caregivers providing mobility assistance, medication management, and warm companionship.",
    accent: "text-secondary",
    emoji: "🧓",
  },
  {
    title: "Specialized Home Recovery Care",
    subtitle:
      "Skilled caregivers offering post-surgery care, rehabilitation support, and vital monitoring at home.",
    accent: "text-accent",
    emoji: "🏥",
  },
];

const HeroBanner = () => {
  return (
    <Swiper
      modules={[Autoplay, Pagination, EffectFade]}
      autoplay={{ delay: 5000, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      effect="fade"
      loop
      className="w-full"
    >
      {slides.map((slide, index) => (
        <SwiperSlide key={index}>
          <section
            className="relative overflow-hidden bg-muted"
          >
            {/* Decorative circles */}
            <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-primary/5" />
            <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-secondary/5" />

            <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
              <div className="text-center">
                <span className="mb-4 inline-block text-5xl">{slide.emoji}</span>
                <h1 className="animate-fade-in-up text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                  {slide.title.split(" ").slice(0, -2).join(" ")}{" "}
                  <span className={slide.accent}>
                    {slide.title.split(" ").slice(-2).join(" ")}
                  </span>
                </h1>
                <p className="mx-auto mt-6 max-w-2xl animate-fade-in-up text-lg text-muted-foreground [animation-delay:150ms]">
                  {slide.subtitle}
                </p>
                <div className="mt-8 flex animate-fade-in-up flex-col items-center justify-center gap-4 [animation-delay:300ms] sm:flex-row">
                  <Link
                    href="/#services"
                    className="group inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all duration-300 hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/30"
                  >
                    Explore Services
                    <FiArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2 rounded-lg border border-border bg-card/50 px-6 py-3 text-sm font-semibold text-foreground backdrop-blur-sm transition-all duration-200 hover:bg-card hover:shadow-md"
                  >
                    Get Started Free
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default HeroBanner;
