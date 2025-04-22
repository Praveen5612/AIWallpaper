import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes
  app.get("/api/categories", async (_req: Request, res: Response) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.get("/api/categories/:slug", async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const category = await storage.getCategoryBySlug(slug);
      
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch category" });
    }
  });

  app.get("/api/wallpapers", async (_req: Request, res: Response) => {
    try {
      const wallpapers = await storage.getAllWallpapers();
      res.json(wallpapers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch wallpapers" });
    }
  });

  app.get("/api/wallpapers/featured", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const wallpapers = await storage.getFeaturedWallpapers(limit);
      res.json(wallpapers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured wallpapers" });
    }
  });

  app.get("/api/wallpapers/trending", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const wallpapers = await storage.getTrendingWallpapers(limit);
      res.json(wallpapers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trending wallpapers" });
    }
  });

  app.get("/api/wallpapers/:slug", async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const wallpaper = await storage.getWallpaperBySlug(slug);
      
      if (!wallpaper) {
        return res.status(404).json({ message: "Wallpaper not found" });
      }
      
      res.json(wallpaper);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch wallpaper" });
    }
  });

  app.get("/api/categories/:slug/wallpapers", async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const wallpapers = await storage.getWallpapersByCategorySlug(slug);
      res.json(wallpapers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch wallpapers by category" });
    }
  });

  app.get("/api/search", async (req: Request, res: Response) => {
    try {
      const { q } = req.query;
      
      if (!q || typeof q !== 'string') {
        return res.status(400).json({ message: "Search query is required" });
      }
      
      const wallpapers = await storage.searchWallpapers(q);
      res.json(wallpapers);
    } catch (error) {
      res.status(500).json({ message: "Failed to search wallpapers" });
    }
  });

  app.get("/api/tags", async (_req: Request, res: Response) => {
    try {
      const tags = await storage.getAllTags();
      res.json(tags);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tags" });
    }
  });

  // Subscribe to newsletter endpoint
  const subscribeSchema = z.object({
    email: z.string().email(),
  });

  app.post("/api/subscribe", async (req: Request, res: Response) => {
    try {
      const result = subscribeSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid email address" 
        });
      }
      
      // In a real app, you would store the email in a database
      res.json({ 
        message: "Subscribed successfully" 
      });
    } catch (error) {
      res.status(500).json({ 
        message: "Failed to subscribe" 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
