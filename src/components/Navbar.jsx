"use client";

import { useContext, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthContext } from "../providers/AuthProviders";
import { useTheme } from "../providers/ThemeProvider";
import { FiMenu, FiX, FiLogOut, FiSun, FiMoon, FiShield } from "react-icons/fi";
import useAdmin from "../hooks/useAdmin";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);
  const { theme, toggleTheme, mounted } = useTheme();
  const { isAdmin } = useAdmin();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const handleLogout = () => {
    logOut()
      .then(() => toast.success("Logged out successfully"))
      .catch((err) => toast.error(err.message));
  };

  const isActive = (path) => pathname === path;

  const linkClass = (path) =>
    `relative py-1 transition-colors duration-200 hover:text-primary ${
      isActive(path)
        ? "text-primary font-semibold after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-primary after:rounded-full"
        : "text-foreground"
    }`;

  const navLinks = (
    <>
      <li>
        <Link href="/" className={linkClass("/")} onClick={() => setMenuOpen(false)}>
          Home
        </Link>
      </li>
      <li>
        <Link href="/#services" className="py-1 transition-colors duration-200 hover:text-primary" onClick={() => setMenuOpen(false)}>
          Services
        </Link>
      </li>
      {user && (
        <>
          <li>
            <Link href="/create-service" className={linkClass("/create-service")} onClick={() => setMenuOpen(false)}>
              Create Service
            </Link>
          </li>
          <li>
            <Link href="/my-services" className={linkClass("/my-services")} onClick={() => setMenuOpen(false)}>
              My Services
            </Link>
          </li>
          <li>
            <Link href="/my-bookings" className={linkClass("/my-bookings")} onClick={() => setMenuOpen(false)}>
              My Bookings
            </Link>
          </li>
          {isAdmin && (
            <li>
              <Link href="/admin" className={`${linkClass("/admin")} inline-flex items-center gap-1`} onClick={() => setMenuOpen(false)}>
                <FiShield className="text-xs" />
                Admin
              </Link>
            </li>
          )}
        </>
      )}
    </>
  );

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-0.5 group">
          <span className="text-2xl font-bold text-primary transition-transform duration-200 group-hover:scale-105">
            Care
          </span>
          <span className="text-2xl font-bold text-accent transition-transform duration-200 group-hover:scale-105">
            .xyz
          </span>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden items-center gap-8 text-sm font-medium md:flex">
          {navLinks}
        </ul>

        {/* Auth Buttons - Desktop */}
        <div className="hidden items-center gap-3 md:flex">
          {/* Theme Toggle */}
          {mounted && (
            <button
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-foreground transition-all duration-200 hover:bg-muted hover:text-primary"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <FiSun className="text-lg" /> : <FiMoon className="text-lg" />}
            </button>
          )}
          {user ? (
            <div className="flex items-center gap-3">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-white ring-2 ring-primary/20 transition-shadow hover:ring-primary/40"
                title={user.displayName || user.email}
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="avatar"
                    className="h-9 w-9 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  (user.displayName || user.email).charAt(0).toUpperCase()
                )}
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-all duration-200 hover:border-danger hover:bg-danger/5 hover:text-danger"
              >
                <FiLogOut className="text-sm" />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition-all duration-200 hover:border-primary hover:bg-primary/5 hover:text-primary"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-primary-dark hover:shadow-md"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg text-xl transition-colors hover:bg-muted md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`transition-transform duration-200 ${menuOpen ? "rotate-90" : ""}`}>
            {menuOpen ? <FiX /> : <FiMenu />}
          </span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`overflow-hidden border-t border-border bg-background transition-all duration-300 ease-in-out md:hidden ${
          menuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 border-t-0"
        }`}
      >
        <div className="px-4 pb-4">
          <ul className="flex flex-col gap-3 py-4 text-sm font-medium">
            {navLinks}
          </ul>
          {/* Mobile Theme Toggle */}
          {mounted && (
            <button
              onClick={toggleTheme}
              className="mb-3 flex w-full items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
            >
              {theme === "dark" ? <FiSun /> : <FiMoon />}
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </button>
          )}
          <div className="flex flex-col gap-2">
            {user ? (
              <button
                onClick={() => { handleLogout(); setMenuOpen(false); }}
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-border px-4 py-2.5 text-sm font-medium transition-colors hover:border-danger hover:bg-danger/5 hover:text-danger"
              >
                <FiLogOut className="text-sm" />
                Logout
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="w-full rounded-lg border border-border px-4 py-2.5 text-center text-sm font-medium transition-colors hover:bg-muted"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMenuOpen(false)}
                  className="w-full rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-primary-dark"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
