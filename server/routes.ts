import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Markify is a stateless calculator application
  // All calculations are performed client-side, no API routes needed
  // Backend serves the frontend and handles static files only
  
  return httpServer;
}
