import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProviders from "../providers/AuthProviders";
import ThemeProvider from "../providers/ThemeProvider";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Care.xyz - Trusted Care Services",
  description:
    "Find reliable babysitting, elderly care, and special care services for your family. Book trusted caregivers with ease.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground transition-colors duration-300`}
      >
        <ThemeProvider>
          <AuthProviders>
            <Toaster position="top-center" />
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </AuthProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
