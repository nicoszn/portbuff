import type { Metadata } from "next";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Plans from "@/components/landing/Plans";
import DashboardPreview from "@/components/landing/DashboardPreview";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: {
    default: "Portbuff - Global Investment Platform",
    template: "%s | Portbuff",
  },
  description:
    "Access exclusive investment opportunities across agriculture, minerals, energy, and more.",
};

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Plans />
        <DashboardPreview />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
