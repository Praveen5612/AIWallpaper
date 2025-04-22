import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import AdBanner from "@/components/AdBanner";

interface SubscribeResponse {
  message: string;
}

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const subscribeMutation = useMutation({
    mutationFn: async (email: string) => {
      const res = await apiRequest("POST", "/api/subscribe", { email });
      return res.json() as Promise<SubscribeResponse>;
    },
    onSuccess: (data) => {
      toast({
        title: "Subscribed!",
        description: data.message,
        variant: "default",
      });
      setEmail("");
    },
    onError: (error) => {
      toast({
        title: "Failed to subscribe",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      });
    },
  });

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      subscribeMutation.mutate(email);
    }
  };

  return (
    <section className="py-12 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-full h-full opacity-10">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path fill="#4cc9f0" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,88.5,-1.5C87,13.4,81.3,26.8,73.6,38.7C65.9,50.6,56.1,61,44,65.7C31.8,70.4,17.4,69.4,3.3,69.9C-10.8,70.4,-21.6,72.4,-33,70C-44.4,67.5,-56.4,60.7,-64.4,50.6C-72.4,40.5,-76.4,27.1,-77,13.9C-77.7,0.7,-75.1,-12.4,-70.8,-24.8C-66.6,-37.2,-60.8,-49,-51.5,-56.9C-42.1,-64.8,-29.4,-68.8,-16.5,-71.8C-3.6,-74.8,9.4,-76.8,22.9,-77.8C36.3,-78.9,50.2,-79,61.2,-73.9Z" transform="translate(100 100)" />
        </svg>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h2 className="font-orbitron text-2xl md:text-3xl font-semibold mb-4">
            Stay Updated with <span className="text-[var(--color-accent)]">New Releases</span>
          </h2>
          <p className="text-white/70 mb-6">
            Subscribe to our newsletter to get notified about new wallpapers, features, and special offers.
          </p>
          
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-grow px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/50"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button 
              type="submit"
              className="bg-gradient-primary bg-gradient-hover text-white font-medium px-6 py-3 rounded-lg transition-all whitespace-nowrap disabled:opacity-70"
              disabled={subscribeMutation.isPending}
            >
              {subscribeMutation.isPending ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
        </div>
        
        <AdBanner className="max-w-4xl mx-auto" />
      </div>
    </section>
  );
}
