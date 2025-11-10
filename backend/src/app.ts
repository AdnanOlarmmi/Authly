import express from "express";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";

// Load environment variables
dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.json());

// Health check route
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Authly server is running!" });
});

// Database test route
app.get("/test-db", async (req, res) => {
  try {
    const userCount = await prisma.user.count();
    res.json({
      message: "Database connected successfully!",
      userCount,
    });
  } catch (error) {
    res.status(500).json({
      error: "Database connection failed",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Auth routes
app.use("/auth", authRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Authly server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
