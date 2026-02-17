import BookingClient from "./BookingClient";

export async function generateStaticParams() {
  try {
    const res = await fetch("https://server-side-lemon-five.vercel.app/services");
    const services = await res.json();
    return services.map((s) => ({ id: s._id }));
  } catch {
    return [];
  }
}

export default function BookingPage() {
  return <BookingClient />;
}
