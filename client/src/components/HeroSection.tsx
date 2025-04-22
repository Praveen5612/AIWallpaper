import { useState } from "react";
import { useLocation } from "wouter";
import { POPULAR_TAGS } from "@/lib/constants";

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [, setLocation] = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleTagClick = (tag: string) => {
    setSearchQuery(tag);
    setLocation(`/search?q=${encodeURIComponent(tag)}`);
  };

  return (
    <section className="relative py-12 md:py-20 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[var(--color-primary)]/80 to-[var(--color-neutral-dark)]/95 z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1634634482850-acd088cee426?q=80&w=1932&auto=format&fit=crop" 
          alt="AI-generated abstract art background" 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="container mx-auto px-4 relative z-20">
        <div className="max-w-4xl">
          <h1 className="font-orbitron text-3xl md:text-5xl lg:text-6xl font-bold mb-4 text-gradient">
            The Future of Wallpapers is Here
          </h1>
          <p className="text-lg md:text-xl mb-8 text-white/80">
            Discover thousands of AI-generated wallpapers created just for you. Download high-quality unique designs for any device.
          </p>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-grow">
              <input 
                type="text" 
                placeholder="Search wallpapers..." 
                className="w-full px-5 py-4 bg-white/10 backdrop-blur-sm border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <i className="ri-search-line absolute right-4 top-1/2 -translate-y-1/2 text-white/50 text-xl"></i>
            </div>
            <button 
              type="submit"
              className="bg-gradient-primary bg-gradient-hover text-white font-medium px-6 py-4 rounded-lg transition-all"
            >
              Discover
            </button>
          </form>
          
          {/* Popular Tags */}
          <div>
            <div className="flex flex-wrap gap-2 md:gap-3">
              <span className="text-sm font-medium text-white/60 py-2">Popular:</span>
              {POPULAR_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/15 backdrop-blur-sm rounded-full text-sm transition-all"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
