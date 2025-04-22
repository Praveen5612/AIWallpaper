import { useEffect, useRef, ReactNode, useState } from "react";

interface MasonryGridProps {
  children: ReactNode;
  className?: string;
}

interface MasonryItemProps {
  children: ReactNode;
  className?: string;
}

const calculateItemSpan = (element: HTMLElement) => {
  const imgElement = element.querySelector("img");
  if (!imgElement) return 30; // Default height if no image found
  
  const height = imgElement.getBoundingClientRect().height;
  return Math.ceil(height / 10);
};

export function MasonryGrid({ children, className = "" }: MasonryGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [itemsLoaded, setItemsLoaded] = useState(false);

  useEffect(() => {
    const resizeGridItems = () => {
      if (!gridRef.current) return;
      
      const items = gridRef.current.querySelectorAll(".masonry-item");
      items.forEach(item => {
        const span = calculateItemSpan(item as HTMLElement);
        (item as HTMLElement).style.setProperty("--span", span.toString());
      });
      
      setItemsLoaded(true);
    };

    // Initialize and add event listeners
    resizeGridItems();
    window.addEventListener("resize", resizeGridItems);
    
    // Recalculate after images are loaded
    const images = gridRef.current?.querySelectorAll("img") || [];
    let loadedCount = 0;
    
    const onImageLoad = () => {
      loadedCount++;
      if (loadedCount === images.length) {
        resizeGridItems();
      }
    };
    
    images.forEach(img => {
      if (img.complete) {
        loadedCount++;
      } else {
        img.addEventListener("load", onImageLoad);
      }
    });
    
    if (loadedCount === images.length) {
      resizeGridItems();
    }

    return () => {
      window.removeEventListener("resize", resizeGridItems);
      images.forEach(img => {
        img.removeEventListener("load", onImageLoad);
      });
    };
  }, [children]);

  return (
    <div 
      ref={gridRef} 
      className={`masonry-grid ${className} ${!itemsLoaded ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}`}
    >
      {children}
    </div>
  );
}

export function MasonryItem({ children, className = "" }: MasonryItemProps) {
  return (
    <div className={`masonry-item ${className}`}>
      {children}
    </div>
  );
}
