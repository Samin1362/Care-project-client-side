import Link from "next/link";
import {
  FiPhone,
  FiMail,
  FiMapPin,
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiLinkedin,
} from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-[#1a1a2e] text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="mb-4 flex items-center gap-0.5">
              <span className="text-2xl font-bold text-primary">Care</span>
              <span className="text-2xl font-bold text-accent">.xyz</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              Providing reliable and trusted care services for children, elderly,
              and family members. Making caregiving easy, secure, and accessible
              for everyone.
            </p>
            {/* Social Icons */}
            <div className="mt-5 flex items-center gap-3">
              {[
                { icon: FiFacebook, label: "Facebook" },
                { icon: FiTwitter, label: "Twitter" },
                { icon: FiInstagram, label: "Instagram" },
                { icon: FiLinkedin, label: "LinkedIn" },
              ].map((social) => (
                <a
                  key={social.label}
                  href="#"
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-gray-400 transition-all duration-200 hover:bg-primary hover:text-white"
                >
                  <social.icon className="text-base" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-300">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <Link href="/" className="transition-colors duration-200 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#services" className="transition-colors duration-200 hover:text-white">
                  Our Services
                </Link>
              </li>
              <li>
                <Link href="/my-bookings" className="transition-colors duration-200 hover:text-white">
                  My Bookings
                </Link>
              </li>
              <li>
                <Link href="/register" className="transition-colors duration-200 hover:text-white">
                  Get Started
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-300">
              Our Services
            </h3>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <span className="transition-colors duration-200 hover:text-white cursor-default">
                  Baby Care
                </span>
              </li>
              <li>
                <span className="transition-colors duration-200 hover:text-white cursor-default">
                  Elderly Service
                </span>
              </li>
              <li>
                <span className="transition-colors duration-200 hover:text-white cursor-default">
                  Sick People Service
                </span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-300">
              Contact Us
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2.5">
                <FiPhone className="mt-0.5 shrink-0 text-primary" />
                +880 1234-567890
              </li>
              <li className="flex items-start gap-2.5">
                <FiMail className="mt-0.5 shrink-0 text-primary" />
                support@care.xyz
              </li>
              <li className="flex items-start gap-2.5">
                <FiMapPin className="mt-0.5 shrink-0 text-primary" />
                Dhaka, Bangladesh
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-700/50 pt-6 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Care.xyz. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
