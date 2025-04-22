import { useEffect, useRef } from "react";
import { ADSENSE_CLIENT_ID } from "@/lib/constants";

interface AdBannerProps {
  className?: string;
  format?: "horizontal" | "vertical" | "rectangle";
  slot?: string;
}

export default function AdBanner({ 
  className = "", 
  format = "horizontal",
  slot = "1234567890"
}: AdBannerProps) {
  const adRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Wait for AdSense to load
    if (adRef.current && typeof window !== "undefined") {
      try {
        // Check if adsbygoogle is loaded
        if (window.adsbygoogle && adRef.current.innerHTML === '') {
          // Push ad to adsbygoogle
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      } catch (error) {
        console.error("AdSense error:", error);
      }
    }
  }, []);

  // Determine ad size based on format
  let adStyle = {};
  switch (format) {
    case "horizontal":
      adStyle = { height: "90px" };
      break;
    case "vertical":
      adStyle = { height: "600px", width: "160px" };
      break;
    case "rectangle":
      adStyle = { height: "250px", width: "300px" };
      break;
    default:
      adStyle = { height: "90px" };
  }

  return (
    <div className={`p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg text-center ${className}`}>
      <div
        ref={adRef}
        style={adStyle}
        className="flex items-center justify-center mx-auto overflow-hidden"
      >
        <ins
          className="adsbygoogle"
          style={{ display: "block", width: "100%", height: "100%" }}
          data-ad-client={ADSENSE_CLIENT_ID}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
        {/* Fallback when ads not loaded */}
        <span className="text-white/40 text-sm">Advertisement</span>
      </div>
    </div>
  );
}

// Add the adsbygoogle type
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}
