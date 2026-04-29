import { Features } from "@/components/landing/Features";
import { Hero } from "@/components/landing/Hero";
import { Navbar } from "@/components/landing/Navbar";

export default function HomePage() {
  return (
    <main className="landing-shell">
      <Navbar />
      <div className="relative pb-16">
        <Hero />
        <Features />
      </div>
    </main>
  );
}
