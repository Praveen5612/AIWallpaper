import { useState } from "react";
import { Link, useLocation } from "wouter";
import { SITE_NAME } from "@/lib/constants";

export default function Header() {
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [currentLocation] = useLocation();

  const toggleMobileMenu = () => {
    setMobileMenuVisible(!mobileMenuVisible);
  };

  const navigationLinks = [
    { name: "Home", path: "/" },
    { name: "Categories", path: "#categories" },
    { name: "Latest", path: "#latest" },
    { name: "Popular", path: "#popular" },
    { name: "About", path: "#about" }
  ];

  return (
    <header className="sticky top-0 z-50 glassmorphism">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-secondary)] rounded-lg flex items-center justify-center">
            <i className="ri-image-2-fill text-white text-xl"></i>
          </div>
          <h1 className="font-orbitron text-xl md:text-2xl font-bold text-gradient">
            {SITE_NAME}
          </h1>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navigationLinks.map((link) => (
            <Link 
              key={link.name}
              href={link.path}
              className={`text-white/90 hover:text-[var(--color-accent)] transition-colors ${
                (currentLocation === link.path || (currentLocation === "/" && link.path === "/")) 
                  ? "text-[var(--color-accent)]" 
                  : ""
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white p-1"
          onClick={toggleMobileMenu}
        >
          <i className="ri-menu-line text-2xl"></i>
        </button>
      </div>
      
      {/* Mobile Navigation */}
      <div className={`md:hidden ${mobileMenuVisible ? '' : 'hidden'}`}>
        <nav className="px-4 py-3 flex flex-col gap-4">
          {navigationLinks.map((link) => (
            <Link 
              key={link.name}
              href={link.path}
              className={`text-white/90 hover:text-[var(--color-accent)] transition-colors py-2 ${
                (currentLocation === link.path || (currentLocation === "/" && link.path === "/")) 
                  ? "text-[var(--color-accent)]" 
                  : ""
              }`}
              onClick={() => setMobileMenuVisible(false)}
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
