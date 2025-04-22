import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useModalContext } from "@/contexts/ModalContext";
import type { Wallpaper } from "@shared/schema";

export default function WallpaperDetailModal() {
  const { isOpen, closeModal, selectedWallpaper } = useModalContext();
  const [similarWallpapers, setSimilarWallpapers] = useState<Wallpaper[]>([]);
  const { toast } = useToast();

  // Fetch the selected wallpaper's category to get similar wallpapers
  const { data: wallpapers } = useQuery<Wallpaper[]>({
    queryKey: ["/api/wallpapers"],
    enabled: isOpen && !!selectedWallpaper,
  });

  useEffect(() => {
    if (wallpapers && selectedWallpaper) {
      // Get wallpapers from the same category
      const similar = wallpapers
        .filter(w => 
          w.categoryId === selectedWallpaper.categoryId && 
          w.id !== selectedWallpaper.id
        )
        .slice(0, 5);
      
      setSimilarWallpapers(similar);
    }
  }, [wallpapers, selectedWallpaper]);

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const downloadWallpaper = () => {
    if (!selectedWallpaper) return;
    
    // In a real app, this would be a proper download link
    // For now, we'll just open the image in a new tab
    window.open(selectedWallpaper.imageUrl, '_blank');
    
    toast({
      title: "Download started",
      description: `Downloading ${selectedWallpaper.title}`,
    });
  };

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  if (!isOpen || !selectedWallpaper) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-neutral-dark)]/90 backdrop-blur-sm"
      onClick={handleOutsideClick}
    >
      <div className="container max-w-6xl mx-auto px-4 py-8 animate-[slideUp_0.5s_ease-out]">
        <div className="flex justify-end mb-4">
          <button 
            className="text-white p-2 hover:text-[var(--color-accent)] transition-colors"
            onClick={closeModal}
            aria-label="Close"
          >
            <i className="ri-close-line text-2xl"></i>
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="relative rounded-xl overflow-hidden gradient-border">
              <img 
                src={selectedWallpaper.imageUrl} 
                alt={selectedWallpaper.title} 
                className="w-full object-cover"
              />
            </div>
          </div>
          
          <div className="glassmorphism rounded-xl p-6">
            <h2 className="font-orbitron text-2xl font-semibold mb-4">{selectedWallpaper.title}</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-white/70 mb-2 font-medium">Description</h3>
                <p className="text-white/90">{selectedWallpaper.description}</p>
              </div>
              
              <div>
                <h3 className="text-white/70 mb-2 font-medium">Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-white/70">Resolution</span>
                    <span className="text-white font-mono">{selectedWallpaper.width} x {selectedWallpaper.height}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Category</span>
                    <span className="text-[var(--color-accent)]">{selectedWallpaper.tags[0]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">File Size</span>
                    <span className="text-white font-mono">{selectedWallpaper.fileSize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Format</span>
                    <span className="text-white font-mono">{selectedWallpaper.format}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Date Added</span>
                    <span className="text-white font-mono">{formatDate(selectedWallpaper.createdAt)}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-white/70 mb-2 font-medium">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedWallpaper.tags.map((tag) => (
                    <Link 
                      key={tag}
                      href={`/search?q=${encodeURIComponent(tag)}`}
                      className="px-3 py-1 bg-white/10 hover:bg-white/15 rounded-full text-sm transition-all"
                    >
                      {tag}
                    </Link>
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
                <h3 className="text-white/70 mb-2 font-medium">Share</h3>
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
        
        {similarWallpapers.length > 0 && (
          <div className="mt-10">
            <h3 className="font-orbitron text-xl font-semibold mb-6">You May Also Like</h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {similarWallpapers.map((wallpaper) => (
                <div 
                  key={wallpaper.id}
                  className="group cursor-pointer"
                  onClick={() => {
                    closeModal();
                    setTimeout(() => {
                      window.history.pushState({}, "", `/wallpaper/${wallpaper.slug}`);
                      window.dispatchEvent(new PopStateEvent("popstate"));
                    }, 100);
                  }}
                >
                  <div className="relative overflow-hidden rounded-lg aspect-[9/16] mb-2">
                    <img 
                      src={wallpaper.imageUrl} 
                      alt={wallpaper.title} 
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
