import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import type { Category } from "@shared/schema";

export default function CategoriesSection() {
  const { data: categories, isLoading, error } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  return (
    <section className="py-12" id="categories">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-orbitron text-2xl md:text-3xl font-semibold">
            Discover <span className="text-[var(--color-accent)]">Categories</span>
          </h2>
          <Link 
            href="/category/all" 
            className="text-[var(--color-accent)] hover:text-[var(--color-accent-light)] flex items-center gap-1 transition-colors"
          >
            View All <i className="ri-arrow-right-line"></i>
          </Link>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-36 md:h-40">
                <Skeleton className="h-full w-full rounded-xl" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            Failed to load categories. Please try again later.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories?.map((category) => (
              <Link 
                key={category.id}
                href={`/category/${category.slug}`} 
                className="category-card relative overflow-hidden rounded-xl group h-36 md:h-40"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary-dark)]/90 to-transparent z-10"></div>
                <img 
                  src={category.imageUrl} 
                  alt={`${category.name} category`} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute bottom-0 left-0 w-full p-4 z-20">
                  <h3 className="font-orbitron text-lg font-medium text-white">{category.name}</h3>
                  <span className="text-xs text-white/70">{category.count} wallpapers</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
