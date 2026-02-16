import Link from "next/link";
import { FiHome } from "react-icons/fi";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-8xl font-extrabold text-primary/20 sm:text-9xl">404</p>
      <h1 className="mt-4 text-3xl font-bold text-foreground">
        Page Not Found
      </h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        Sorry, the page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-primary-dark hover:shadow-lg"
      >
        <FiHome />
        Back to Home
      </Link>
    </div>
  );
}
