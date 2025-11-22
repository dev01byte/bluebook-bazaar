import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { PromoBanner } from "@/components/PromoBanner";
import { CouponSection } from "@/components/CouponSection";
import { FeaturedBooks } from "@/components/FeaturedBooks";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <PromoBanner />
        <FeaturedBooks />
        <CouponSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
