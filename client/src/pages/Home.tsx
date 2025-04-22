import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CategoriesSection from "@/components/CategoriesSection";
import FeaturedWallpapers from "@/components/FeaturedWallpapers";
import TrendingSection from "@/components/TrendingSection";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";
import WallpaperDetailModal from "@/components/WallpaperDetailModal";
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/constants";

export default function Home() {
  useEffect(() => {
    // Set the document title
    document.title = `${SITE_NAME} | AI-Generated Wallpapers for Every Device`;
  }, []);

  return (
    <>
      <Helmet>
        <title>{SITE_NAME} | AI-Generated Wallpapers for Every Device</title>
        <meta name="description" content={SITE_DESCRIPTION} />
        <meta property="og:title" content={SITE_NAME} />
        <meta property="og:description" content={SITE_DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={SITE_NAME} />
        <meta name="twitter:description" content={SITE_DESCRIPTION} />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <HeroSection />
          <CategoriesSection />
          <FeaturedWallpapers />
          <TrendingSection />
          <NewsletterSection />
          <WallpaperDetailModal />
        </main>
        <Footer />
      </div>
    </>
  );
}
