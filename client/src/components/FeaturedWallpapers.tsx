import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { useModalContext } from "@/contexts/ModalContext";
import type { Wallpaper } from "@shared/schema";

export default function FeaturedWallpapers() {
  const { data: wallpapers, isLoading, error } = useQuery<Wallpaper[]>({
    queryKey: ["/api/wallpapers/featured"],
  });

  const { openModal } = useModalContext();

  return (
    <section className="py-12 bg-[var(--color-primary)]/40">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-orbitron text-2xl md:text-3xl font-semibold">
            Featured <span className="text-[var(--color-accent)]">Wallpapers</span>
          </h2>
          <div className="flex gap-2">
            <button className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors">
              <i className="ri-arrow-left-s-line text-xl"></i>
            </button>
            <button className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors">
              <i className="ri-arrow-right-s-line text-xl"></i>
            </button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="space-y-3">
                <Skeleton className="w-full aspect-[9/16] rounded-xl" />
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            Failed to load featured wallpapers. Please try again later.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wallpapers?.map((wallpaper) => (
              <div key={wallpaper.id} className="group cursor-pointer" onClick={() => openModal(wallpaper)}>
                <div className="relative overflow-hidden rounded-xl aspect-[9/16] mb-3 glassmorphism gradient-border">
                  <img 
                    src={wallpaper.imageUrl} 
                    alt={wallpaper.title} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-[var(--color-primary-dark)]/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-2">
                      <span className="bg-[var(--color-accent)]/20 text-[var(--color-accent)] text-xs px-2 py-1 rounded-full">4K</span>
                      {wallpaper.isNew && (
                        <span className="bg-[var(--color-secondary)]/20 text-[var(--color-secondary-light)] text-xs px-2 py-1 rounded-full">New</span>
                      )}
                      {wallpaper.isPopular && (
                        <span className="bg-[var(--color-warning)]/20 text-[var(--color-warning)] text-xs px-2 py-1 rounded-full">Popular</span>
                      )}
                    </div>
                  </div>
                </div>
                <h3 className="font-medium text-white/90 group-hover:text-[var(--color-accent)] transition-colors">
                  {wallpaper.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <span>{wallpaper.width} x {wallpaper.height}</span>
                  <span className="w-1 h-1 bg-white/60 rounded-full"></span>
                  <span>{wallpaper.tags[0]}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
