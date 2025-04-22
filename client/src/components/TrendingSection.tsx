import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { MasonryGrid, MasonryItem } from "@/components/ui/masonry-grid";
import { Skeleton } from "@/components/ui/skeleton";
import { useModalContext } from "@/contexts/ModalContext";
import type { Wallpaper } from "@shared/schema";

export default function TrendingSection() {
  const { data: wallpapers, isLoading, error } = useQuery<Wallpaper[]>({
    queryKey: ["/api/wallpapers/trending"],
  });

  const { openModal } = useModalContext();

  return (
    <section className="py-12" id="popular">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-orbitron text-2xl md:text-3xl font-semibold">
            Trending <span className="text-[var(--color-accent)]">Today</span>
          </h2>
          <Link 
            href="/category/all" 
            className="text-[var(--color-accent)] hover:text-[var(--color-accent-light)] flex items-center gap-1 transition-colors"
          >
            View All <i className="ri-arrow-right-line"></i>
          </Link>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="w-full h-[200px] rounded-lg" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            Failed to load trending wallpapers. Please try again later.
          </div>
        ) : (
          <MasonryGrid>
            {wallpapers?.map((wallpaper) => (
              <MasonryItem key={wallpaper.id}>
                <div 
                  className="block group cursor-pointer"
                  onClick={() => openModal(wallpaper)}
                >
                  <div className="relative overflow-hidden rounded-lg mb-2 gradient-border">
                    <img 
                      src={wallpaper.imageUrl} 
                      alt={wallpaper.title}
                      className="w-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary-dark)]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                      <div className="p-3 w-full">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="bg-[var(--color-accent)]/20 text-[var(--color-accent)] text-xs px-2 py-1 rounded-full">4K</span>
                            {wallpaper.isNew && (
                              <span className="bg-[var(--color-secondary)]/20 text-[var(--color-secondary-light)] text-xs px-2 py-1 rounded-full">New</span>
                            )}
                            {wallpaper.isPopular && (
                              <span className="bg-[var(--color-warning)]/20 text-[var(--color-warning)] text-xs px-2 py-1 rounded-full">Popular</span>
                            )}
                          </div>
                          <button className="bg-white/10 hover:bg-white/20 p-1.5 rounded-lg transition-colors">
                            <i className="ri-download-line text-white"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <h3 className="font-medium text-sm text-white/90 group-hover:text-[var(--color-accent)] transition-colors">
                    {wallpaper.title}
                  </h3>
                </div>
              </MasonryItem>
            ))}
          </MasonryGrid>
        )}
        
        <div className="mt-8 text-center">
          <button className="bg-white/10 hover:bg-white/15 text-white font-medium px-6 py-3 rounded-lg transition-all inline-flex items-center gap-2">
            Load More <i className="ri-refresh-line"></i>
          </button>
        </div>
      </div>
    </section>
  );
}
