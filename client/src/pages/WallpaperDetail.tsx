import { useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TrendingSection from "@/components/TrendingSection";
import AdBanner from "@/components/AdBanner";
import { Skeleton } from "@/components/ui/skeleton";
import { useModalContext } from "@/contexts/ModalContext";
import { SITE_NAME } from "@/lib/constants";
import type { Wallpaper } from "@shared/schema";

export default function WallpaperDetail() {
  const [, params] = useRoute<{ slug: string }>("/wallpaper/:slug");
  const [, setLocation] = useLocation();
  const slug = params?.slug;
  
  const { data: wallpaper, isLoading, error } = useQuery<Wallpaper>({
    queryKey: [`/api/wallpapers/${slug}`],
    enabled: !!slug,
  });

  const { openModal } = useModalContext();

  useEffect(() => {
    if (wallpaper) {
      document.title = `${wallpaper.title} | ${SITE_NAME}`;
      
      // If we have the wallpaper data, open it in the modal
      openModal(wallpaper);
    }
  }, [wallpaper, openModal]);

  // Redirect to 404 if error
  useEffect(() => {
    if (error) {
      setLocation("/not-found");
    }
  }, [error, setLocation]);

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const downloadWallpaper = () => {
    if (!wallpaper) return;
    window.open(wallpaper.imageUrl, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Skeleton className="w-full aspect-video rounded-xl" />
              <div className="space-y-4">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-24 w-full" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                </div>
              </div>
            </div>
          ) : wallpaper ? (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                <div className="relative rounded-xl overflow-hidden gradient-border">
                  <img 
                    src={wallpaper.imageUrl} 
                    alt={wallpaper.title}
                    className="w-full object-cover" 
                  />
                </div>
                
                <div className="glassmorphism rounded-xl p-6">
                  <h1 className="font-orbitron text-3xl font-semibold mb-4">{wallpaper.title}</h1>
                  
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-white/70 mb-2 font-medium">Description</h2>
                      <p className="text-white/90">{wallpaper.description}</p>
                    </div>
                    
                    <div>
                      <h2 className="text-white/70 mb-2 font-medium">Details</h2>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-white/70">Resolution</span>
                          <span className="text-white font-mono">{wallpaper.width} x {wallpaper.height}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Category</span>
                          <span className="text-[var(--color-accent)]">{wallpaper.tags[0]}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">File Size</span>
                          <span className="text-white font-mono">{wallpaper.fileSize}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Format</span>
                          <span className="text-white font-mono">{wallpaper.format}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Date Added</span>
                          <span className="text-white font-mono">{formatDate(wallpaper.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h2 className="text-white/70 mb-2 font-medium">Tags</h2>
                      <div className="flex flex-wrap gap-2">
                        {wallpaper.tags.map((tag) => (
                          <span 
                            key={tag}
                            className="px-3 py-1 bg-white/10 hover:bg-white/15 rounded-full text-sm transition-all cursor-pointer"
                            onClick={() => setLocation(`/search?q=${encodeURIComponent(tag)}`)}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <button 
                        onClick={downloadWallpaper}
                        className="w-full bg-gradient-primary bg-gradient-hover text-white font-medium px-6 py-3 rounded-lg transition-all flex items-center justify-center gap-2"
                      >
                        <i className="ri-download-line"></i> Download Wallpaper
                      </button>
                    </div>
                    
                    <div>
                      <h2 className="text-white/70 mb-2 font-medium">Share</h2>
                      <div className="flex gap-3">
                        <a href="#" className="bg-white/10 hover:bg-white/15 p-2 rounded-lg transition-colors">
                          <i className="ri-facebook-fill text-lg"></i>
                        </a>
                        <a href="#" className="bg-white/10 hover:bg-white/15 p-2 rounded-lg transition-colors">
                          <i className="ri-twitter-x-fill text-lg"></i>
                        </a>
                        <a href="#" className="bg-white/10 hover:bg-white/15 p-2 rounded-lg transition-colors">
                          <i className="ri-pinterest-fill text-lg"></i>
                        </a>
                        <a href="#" className="bg-white/10 hover:bg-white/15 p-2 rounded-lg transition-colors">
                          <i className="ri-link text-lg"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="my-8">
                <AdBanner format="horizontal" />
              </div>
            </>
          ) : null}
          
          <h2 className="font-orbitron text-2xl font-semibold mt-16 mb-6">You May Also Like</h2>
          <TrendingSection />
        </div>
      </main>
      <Footer />
    </div>
  );
}
