import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Plans from "../components/Plans";
import DashboardPreview from "../components/DashboardPreview";
import CTA from "../components/CTA";
import Footer from "../components/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-navy-950">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Plans />
        <DashboardPreview />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
