import { Link } from "wouter";
import { SITE_NAME } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-[var(--color-primary-dark)] py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-secondary)] rounded-lg flex items-center justify-center">
                <i className="ri-image-2-fill text-white text-xl"></i>
              </div>
              <h2 className="font-orbitron text-xl font-bold text-gradient">
                {SITE_NAME}
              </h2>
            </Link>
            <p className="text-white/60 mb-6">
              Discover thousands of AI-generated wallpapers for your devices. High-quality, unique, and completely free.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-white/60 hover:text-[var(--color-accent)] transition-colors">
                <i className="ri-twitter-x-fill text-xl"></i>
              </a>
              <a href="#" className="text-white/60 hover:text-[var(--color-accent)] transition-colors">
                <i className="ri-instagram-fill text-xl"></i>
              </a>
              <a href="#" className="text-white/60 hover:text-[var(--color-accent)] transition-colors">
                <i className="ri-facebook-fill text-xl"></i>
              </a>
              <a href="#" className="text-white/60 hover:text-[var(--color-accent)] transition-colors">
                <i className="ri-pinterest-fill text-xl"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-medium mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><Link href="/category/abstract" className="text-white/60 hover:text-[var(--color-accent)] transition-colors">Abstract</Link></li>
              <li><Link href="/category/nature" className="text-white/60 hover:text-[var(--color-accent)] transition-colors">Nature</Link></li>
              <li><Link href="/category/space" className="text-white/60 hover:text-[var(--color-accent)] transition-colors">Space</Link></li>
              <li><Link href="/category/cyberpunk" className="text-white/60 hover:text-[var(--color-accent)] transition-colors">Cyberpunk</Link></li>
              <li><Link href="/category/anime" className="text-white/60 hover:text-[var(--color-accent)] transition-colors">Anime</Link></li>
              <li><Link href="/category/minimal" className="text-white/60 hover:text-[var(--color-accent)] transition-colors">Minimal</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-medium mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-white/60 hover:text-[var(--color-accent)] transition-colors">Home</Link></li>
              <li><Link href="/category/all" className="text-white/60 hover:text-[var(--color-accent)] transition-colors">Browse All</Link></li>
              <li><Link href="#featured" className="text-white/60 hover:text-[var(--color-accent)] transition-colors">Featured</Link></li>
              <li><Link href="#popular" className="text-white/60 hover:text-[var(--color-accent)] transition-colors">Popular</Link></li>
              <li><Link href="#latest" className="text-white/60 hover:text-[var(--color-accent)] transition-colors">New Releases</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-medium mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-white/60 hover:text-[var(--color-accent)] transition-colors">About Us</Link></li>
              <li><Link href="/privacy" className="text-white/60 hover:text-[var(--color-accent)] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-white/60 hover:text-[var(--color-accent)] transition-colors">Terms of Service</Link></li>
              <li><Link href="/contact" className="text-white/60 hover:text-[var(--color-accent)] transition-colors">Contact Us</Link></li>
              <li><Link href="/faq" className="text-white/60 hover:text-[var(--color-accent)] transition-colors">FAQ</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/40 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
          <p className="text-white/40 text-sm">
            Powered by AI-Generated Content
          </p>
        </div>
      </div>
    </footer>
  );
}
