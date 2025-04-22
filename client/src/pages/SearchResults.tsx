import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MasonryGrid, MasonryItem } from "@/components/ui/masonry-grid";
import AdBanner from "@/components/AdBanner";
import WallpaperDetailModal from "@/components/WallpaperDetailModal";
import { useModalContext } from "@/contexts/ModalContext";
import { Skeleton } from "@/components/ui/skeleton";
import { SITE_NAME } from "@/lib/constants";
import type { Wallpaper } from "@shared/schema";

export default function SearchResults() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1]);
  const query = searchParams.get('q') || '';
  const { openModal } = useModalContext();
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  const { data: searchResults, isLoading } = useQuery<Wallpaper[]>({
    queryKey: [`/api/search?q=${encodeURIComponent(query)}`],
    enabled: query.length > 0,
  });

  // Pagination logic
  const [displayedWallpapers, setDisplayedWallpapers] = useState<Wallpaper[]>([]);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (searchResults) {
      const newDisplayed = searchResults.slice(0, page * itemsPerPage);
      setDisplayedWallpapers(newDisplayed);
      setHasMore(newDisplayed.length < searchResults.length);
    }
  }, [searchResults, page]);

  useEffect(() => {
    // Reset pagination when search query changes
    setPage(1);
  }, [query]);

  useEffect(() => {
    document.title = `Search: ${query} | ${SITE_NAME}`;
  }, [query]);

  const loadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <div className="mb-10">
            <h1 className="font-orbitron text-3xl md:text-4xl font-bold mb-4">
              Search Results: "{query}"
            </h1>
            <p className="text-white/70">
              {searchResults ? `Found ${searchResults.length} wallpapers` : 'Searching...'}
            </p>
          </div>

          <div className="mb-8">
            <AdBanner format="horizontal" />
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <Skeleton className="w-full aspect-[9/16] rounded-lg" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))}
            </div>
          ) : displayedWallpapers?.length ? (
            <MasonryGrid>
              {displayedWallpapers.map((wallpaper) => (
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
          ) : (
            <div className="text-center py-12">
              <i className="ri-search-line text-4xl text-[var(--color-accent)] mb-4"></i>
              <h2 className="text-xl font-medium mb-2">No results found</h2>
              <p className="text-white/60">Try a different search term or browse our categories.</p>
            </div>
          )}
          
          {hasMore && (
            <div className="mt-8 text-center">
              <button 
                onClick={loadMore}
                className="bg-white/10 hover:bg-white/15 text-white font-medium px-6 py-3 rounded-lg transition-all inline-flex items-center gap-2"
              >
                Load More <i className="ri-refresh-line"></i>
              </button>
            </div>
          )}
        </div>
      </main>
      <WallpaperDetailModal />
      <Footer />
    </div>
  );
}
