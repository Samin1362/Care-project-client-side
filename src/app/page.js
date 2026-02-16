import { FiHeart, FiShield, FiClock, FiStar } from "react-icons/fi";
import HeroBanner from "../components/HeroBanner";
import ServicesSection from "../components/ServicesSection";

export const metadata = {
  title: "Care.xyz - Trusted Baby Sitting & Elderly Care Services",
  description:
    "Find reliable babysitting, elderly care, and special home care services for your family. Book trusted caregivers with ease on Care.xyz.",
  openGraph: {
    title: "Care.xyz - Trusted Care Services",
    description:
      "Professional babysitting, elderly care, and sick care services. Book now!",
    type: "website",
  },
};

export default function Home() {
  return (
    <div>
      {/* Hero Banner Slider */}
      <HeroBanner />

      {/* About / Why Choose Us */}
      <section className="bg-card py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
              Why Care.xyz
            </p>
            <h2 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">
              Caregiving Made Simple
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              We connect families with verified, professional caregivers you can
              trust. Here&apos;s why thousands choose us.
            </p>
          </div>
          <div className="stagger-children mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                icon: FiHeart,
                title: "Compassionate Care",
                desc: "Our caregivers are trained to provide loving, patient care tailored to every family member's unique needs.",
                color: "primary",
                bg: "bg-blue-50",
              },
              {
                icon: FiShield,
                title: "Verified & Secure",
                desc: "Every caregiver is background-checked, NID-verified, and trained to meet our high safety standards.",
                color: "secondary",
                bg: "bg-cyan-50",
              },
              {
                icon: FiClock,
                title: "Flexible Booking",
                desc: "Book by the hour or day, select your location, and get instant cost estimates — all in a few clicks.",
                color: "accent",
                bg: "bg-amber-50",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="group animate-fade-in-up rounded-2xl border border-border bg-card p-7 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div
                  className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl ${item.bg} transition-transform duration-300 group-hover:scale-110`}
                >
                  <item.icon className={`text-2xl text-${item.color}`} />
                </div>
                <h3 className="mt-5 text-lg font-bold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section — Dynamic from API */}
      <ServicesSection />

      {/* Stats Section */}
      <section className="bg-card py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-gradient-to-r from-primary to-secondary p-10 text-white shadow-xl sm:p-14">
            <div className="stagger-children grid grid-cols-2 gap-8 md:grid-cols-4">
              {[
                { label: "Families Served", value: "500+" },
                { label: "Certified Caregivers", value: "100+" },
                { label: "Cities Covered", value: "50+" },
                { label: "Client Satisfaction", value: "98%" },
              ].map((stat) => (
                <div key={stat.label} className="animate-fade-in-up text-center">
                  <p className="text-3xl font-extrabold sm:text-4xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm text-white/80">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-muted py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
              Testimonials
            </p>
            <h2 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">
              What Our Clients Say
            </h2>
          </div>
          <div className="stagger-children mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                name: "Fatima Rahman",
                text: "Care.xyz found us an amazing babysitter. My kids absolutely love her! The booking process was so smooth and transparent.",
                role: "Parent",
                stars: 5,
              },
              {
                name: "Karim Ahmed",
                text: "The elderly care service for my mother has been outstanding. The caregiver is professional, compassionate, and truly dedicated.",
                role: "Family Member",
                stars: 5,
              },
              {
                name: "Nusrat Jahan",
                text: "After my surgery, the home care service helped me recover quickly and comfortably. Highly recommended for anyone in need.",
                role: "Patient",
                stars: 5,
              },
            ].map((testimonial) => (
              <div
                key={testimonial.name}
                className="animate-fade-in-up rounded-2xl bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Stars */}
                <div className="mb-3 flex gap-1">
                  {Array.from({ length: testimonial.stars }).map((_, i) => (
                    <FiStar
                      key={i}
                      className="fill-accent text-accent"
                      size={16}
                    />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-card py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-[#1a1a2e] p-10 text-center text-white sm:p-14">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Ready to Book a Caregiver?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-gray-400">
              Join hundreds of families who trust Care.xyz for professional and
              compassionate care services.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="/#services"
                className="inline-flex rounded-lg bg-primary px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all duration-200 hover:bg-primary-dark hover:shadow-xl"
              >
                Browse Services
              </a>
              <a
                href="/register"
                className="inline-flex rounded-lg border border-gray-600 px-8 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-card/10"
              >
                Create Account
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
