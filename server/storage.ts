import { 
  users, type User, type InsertUser,
  categories, type Category, type InsertCategory,
  wallpapers, type Wallpaper, type InsertWallpaper,
  tags, type Tag, type InsertTag
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Category methods
  getAllCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategoryCount(id: number, count: number): Promise<Category | undefined>;

  // Wallpaper methods
  getAllWallpapers(): Promise<Wallpaper[]>;
  getFeaturedWallpapers(limit?: number): Promise<Wallpaper[]>;
  getTrendingWallpapers(limit?: number): Promise<Wallpaper[]>;
  getWallpapersByCategory(categoryId: number): Promise<Wallpaper[]>;
  getWallpapersByCategorySlug(categorySlug: string): Promise<Wallpaper[]>;
  getWallpaper(id: number): Promise<Wallpaper | undefined>;
  getWallpaperBySlug(slug: string): Promise<Wallpaper | undefined>;
  createWallpaper(wallpaper: InsertWallpaper): Promise<Wallpaper>;
  searchWallpapers(query: string): Promise<Wallpaper[]>;
  
  // Tag methods
  getAllTags(): Promise<Tag[]>;
  createTag(tag: InsertTag): Promise<Tag>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private wallpapers: Map<number, Wallpaper>;
  private tags: Map<number, Tag>;
  
  private currentUserId: number;
  private currentCategoryId: number;
  private currentWallpaperId: number;
  private currentTagId: number;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.wallpapers = new Map();
    this.tags = new Map();
    
    this.currentUserId = 1;
    this.currentCategoryId = 1;
    this.currentWallpaperId = 1;
    this.currentTagId = 1;
    
    // Add sample data
    this.initializeData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Category methods
  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(
      (category) => category.slug === slug,
    );
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.currentCategoryId++;
    const category: Category = { ...insertCategory, id, count: 0 };
    this.categories.set(id, category);
    return category;
  }

  async updateCategoryCount(id: number, count: number): Promise<Category | undefined> {
    const category = await this.getCategory(id);
    if (!category) return undefined;
    
    const updatedCategory = { ...category, count };
    this.categories.set(id, updatedCategory);
    return updatedCategory;
  }

  // Wallpaper methods
  async getAllWallpapers(): Promise<Wallpaper[]> {
    return Array.from(this.wallpapers.values());
  }

  async getFeaturedWallpapers(limit = 4): Promise<Wallpaper[]> {
    return Array.from(this.wallpapers.values())
      .filter(wallpaper => wallpaper.isFeatured)
      .slice(0, limit);
  }

  async getTrendingWallpapers(limit = 6): Promise<Wallpaper[]> {
    return Array.from(this.wallpapers.values())
      .filter(wallpaper => wallpaper.isPopular)
      .slice(0, limit);
  }

  async getWallpapersByCategory(categoryId: number): Promise<Wallpaper[]> {
    return Array.from(this.wallpapers.values()).filter(
      (wallpaper) => wallpaper.categoryId === categoryId,
    );
  }

  async getWallpapersByCategorySlug(categorySlug: string): Promise<Wallpaper[]> {
    const category = await this.getCategoryBySlug(categorySlug);
    if (!category) return [];
    
    return this.getWallpapersByCategory(category.id);
  }

  async getWallpaper(id: number): Promise<Wallpaper | undefined> {
    return this.wallpapers.get(id);
  }

  async getWallpaperBySlug(slug: string): Promise<Wallpaper | undefined> {
    return Array.from(this.wallpapers.values()).find(
      (wallpaper) => wallpaper.slug === slug,
    );
  }

  async createWallpaper(insertWallpaper: InsertWallpaper): Promise<Wallpaper> {
    const id = this.currentWallpaperId++;
    const now = new Date();
    const wallpaper: Wallpaper = { 
      ...insertWallpaper, 
      id, 
      createdAt: now
    };
    
    this.wallpapers.set(id, wallpaper);
    
    // Update category count
    const category = await this.getCategory(wallpaper.categoryId);
    if (category) {
      await this.updateCategoryCount(category.id, category.count + 1);
    }
    
    return wallpaper;
  }

  async searchWallpapers(query: string): Promise<Wallpaper[]> {
    const lowerQuery = query.toLowerCase();
    
    return Array.from(this.wallpapers.values()).filter(
      (wallpaper) => 
        wallpaper.title.toLowerCase().includes(lowerQuery) ||
        wallpaper.description.toLowerCase().includes(lowerQuery) ||
        wallpaper.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  // Tag methods
  async getAllTags(): Promise<Tag[]> {
    return Array.from(this.tags.values());
  }

  async createTag(insertTag: InsertTag): Promise<Tag> {
    const id = this.currentTagId++;
    const tag: Tag = { ...insertTag, id };
    this.tags.set(id, tag);
    return tag;
  }

  // Initialize with sample data
  private async initializeData() {
    // Create categories
    const abstractCategory = await this.createCategory({
      name: "Abstract",
      slug: "abstract",
      imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop",
    });
    
    const cyberpunkCategory = await this.createCategory({
      name: "Cyberpunk",
      slug: "cyberpunk",
      imageUrl: "https://images.unsplash.com/photo-1604076913837-52ab5629fba9?q=80&w=1964&auto=format&fit=crop",
    });
    
    const natureCategory = await this.createCategory({
      name: "Nature",
      slug: "nature",
      imageUrl: "https://images.unsplash.com/photo-1511207538754-e8555f2bc187?q=80&w=1974&auto=format&fit=crop",
    });
    
    const spaceCategory = await this.createCategory({
      name: "Space",
      slug: "space",
      imageUrl: "https://images.unsplash.com/photo-1626544827763-d516dce335e2?q=80&w=1974&auto=format&fit=crop",
    });
    
    const animeCategory = await this.createCategory({
      name: "Anime",
      slug: "anime",
      imageUrl: "https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=1979&auto=format&fit=crop",
    });
    
    const minimalCategory = await this.createCategory({
      name: "Minimal",
      slug: "minimal",
      imageUrl: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=1964&auto=format&fit=crop",
    });

    // Create tags
    await this.createTag({ name: "abstract" });
    await this.createTag({ name: "gradient" });
    await this.createTag({ name: "colorful" });
    await this.createTag({ name: "modern" });
    await this.createTag({ name: "digital" });
    await this.createTag({ name: "cyberpunk" });
    await this.createTag({ name: "neon" });
    await this.createTag({ name: "nature" });
    await this.createTag({ name: "mountains" });
    await this.createTag({ name: "space" });
    await this.createTag({ name: "galaxy" });
    await this.createTag({ name: "anime" });
    await this.createTag({ name: "minimal" });
    await this.createTag({ name: "tech" });
    
    // Create wallpapers
    await this.createWallpaper({
      title: "Futuristic Code",
      slug: "futuristic-code",
      description: "A stunning visualization of futuristic code patterns, perfect for developers and tech enthusiasts.",
      imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1950&auto=format&fit=crop",
      width: 3840,
      height: 2160,
      fileSize: "2.4 MB",
      format: "JPG",
      categoryId: cyberpunkCategory.id,
      tags: ["tech", "code", "digital", "cyberpunk"],
      isNew: true,
      isPopular: false,
      isFeatured: true,
    });
    
    await this.createWallpaper({
      title: "Neon City Lights",
      slug: "neon-city-lights",
      description: "Vibrant neon city lights illuminate the night in this cyberpunk-inspired wallpaper.",
      imageUrl: "https://images.unsplash.com/photo-1525373698358-041e3a460346?q=80&w=1964&auto=format&fit=crop",
      width: 3840,
      height: 2160,
      fileSize: "3.2 MB",
      format: "JPG",
      categoryId: cyberpunkCategory.id,
      tags: ["cyberpunk", "neon", "city", "night"],
      isNew: false,
      isPopular: true,
      isFeatured: true,
    });
    
    await this.createWallpaper({
      title: "Abstract Mountains",
      slug: "abstract-mountains",
      description: "A breathtaking view of abstract mountain ranges with stunning color gradients.",
      imageUrl: "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?q=80&w=1970&auto=format&fit=crop",
      width: 3840,
      height: 2160,
      fileSize: "2.8 MB",
      format: "JPG",
      categoryId: natureCategory.id,
      tags: ["nature", "mountains", "abstract", "colorful"],
      isNew: false,
      isPopular: false,
      isFeatured: true,
    });
    
    await this.createWallpaper({
      title: "Galactic View",
      slug: "galactic-view",
      description: "Explore the cosmos with this stunning view of our galaxy and beyond.",
      imageUrl: "https://images.unsplash.com/photo-1502481851512-e93e0c02ed2e?q=80&w=1969&auto=format&fit=crop",
      width: 3840,
      height: 2160,
      fileSize: "3.5 MB",
      format: "JPG",
      categoryId: spaceCategory.id,
      tags: ["space", "galaxy", "stars", "cosmos"],
      isNew: true,
      isPopular: false,
      isFeatured: true,
    });
    
    await this.createWallpaper({
      title: "Abstract Gradient",
      slug: "abstract-gradient",
      description: "A stunning abstract gradient wallpaper with vibrant colors that blend seamlessly.",
      imageUrl: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1470&auto=format&fit=crop",
      width: 3840,
      height: 2160,
      fileSize: "2.4 MB",
      format: "JPG",
      categoryId: abstractCategory.id,
      tags: ["abstract", "gradient", "colorful", "modern", "digital"],
      isNew: false,
      isPopular: true,
      isFeatured: false,
    });
    
    await this.createWallpaper({
      title: "Tech Circuit",
      slug: "tech-circuit",
      description: "A detailed visualization of technological circuits and microchips.",
      imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1470&auto=format&fit=crop",
      width: 3840,
      height: 2160,
      fileSize: "2.7 MB",
      format: "JPG",
      categoryId: cyberpunkCategory.id,
      tags: ["tech", "digital", "circuit", "cyberpunk"],
      isNew: false,
      isPopular: true,
      isFeatured: false,
    });
    
    await this.createWallpaper({
      title: "Minimal Mountain",
      slug: "minimal-mountain",
      description: "A minimalist representation of mountain silhouettes at sunset.",
      imageUrl: "https://images.unsplash.com/photo-1493514789931-586cb221d7a7?q=80&w=1471&auto=format&fit=crop",
      width: 3840,
      height: 2160,
      fileSize: "1.9 MB",
      format: "JPG",
      categoryId: minimalCategory.id,
      tags: ["minimal", "mountains", "nature", "sunset"],
      isNew: false,
      isPopular: true,
      isFeatured: false,
    });
    
    await this.createWallpaper({
      title: "Neon Lights",
      slug: "neon-lights",
      description: "Vibrant neon lights create an atmospheric cyberpunk scene.",
      imageUrl: "https://images.unsplash.com/photo-1520262494112-9fe481d36ec3?q=80&w=1632&auto=format&fit=crop",
      width: 3840,
      height: 2160,
      fileSize: "2.9 MB",
      format: "JPG",
      categoryId: cyberpunkCategory.id,
      tags: ["neon", "cyberpunk", "lights", "colorful"],
      isNew: false,
      isPopular: true,
      isFeatured: false,
    });
    
    await this.createWallpaper({
      title: "Cosmic Nebula",
      slug: "cosmic-nebula",
      description: "A spectacular cosmic nebula with swirling clouds of gas and stellar formations.",
      imageUrl: "https://images.unsplash.com/photo-1514905552197-0610a4d8fd73?q=80&w=1470&auto=format&fit=crop",
      width: 3840,
      height: 2160,
      fileSize: "3.2 MB",
      format: "JPG",
      categoryId: spaceCategory.id,
      tags: ["space", "cosmic", "nebula", "stars"],
      isNew: true,
      isPopular: true,
      isFeatured: false,
    });
    
    await this.createWallpaper({
      title: "Holographic",
      slug: "holographic",
      description: "A mesmerizing holographic texture with iridescent rainbow colors.",
      imageUrl: "https://images.unsplash.com/photo-1541367777708-7905fe3296c0?q=80&w=1470&auto=format&fit=crop",
      width: 3840,
      height: 2160,
      fileSize: "2.6 MB",
      format: "JPG",
      categoryId: abstractCategory.id,
      tags: ["holographic", "abstract", "colorful", "modern"],
      isNew: false,
      isPopular: true,
      isFeatured: false,
    });
  }
}

export const storage = new MemStorage();
