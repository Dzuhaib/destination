import HeroSection from "@/components/HeroSection";
import CategoriesSection from "@/components/CategoriesSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import TestimonialsSection from "@/components/TestimonialsSection";
import InstagramSection from "@/components/InstagramSection";
import BrandsSection from "@/components/BrandsSection";

export default function HomePage() {
  return (
    <main className="bg-white">
      <HeroSection />

      <BrandsSection />
      
      <div id="shop-categories">
        <CategoriesSection />
      </div>

      <div id="featured-products">
        <FeaturedProducts />
      </div>

      {/* Social Proof & Trust */}
      <TestimonialsSection />
      
      {/* Engagement */}
      <InstagramSection />
      
    </main>
  );
}
