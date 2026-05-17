import { Features } from "@/components/landing/Features";
import { Hero } from "@/components/landing/Hero";
import { Navbar } from "@/components/landing/Navbar";

export default function HomePage() {
  return (
    <main className="landing-shell landing-home no-scroll-page">
      <Navbar />
      <div className="landing-home-content relative">
        <Hero>
          <Features />
        </Hero>
      </div>
    </main>
  );
}
