import { Router } from "express";
import { AuthService } from "../services/auth.service";
import { RegisterRequest, LoginRequest } from "../types/auth.types";

const router = Router();

// User Registration
router.post("/register", async (req, res) => {
  try {
    const { email, password }: RegisterRequest = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await AuthService.registerUser({ email, password });

    res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    console.error("Registration error:", error);

    if (error instanceof Error && error.message === "User already exists") {
      return res.status(409).json({ error: error.message });
    }

    res.status(500).json({ error: "Internal server error" });
  }
});

// User Login
router.post("/login", async (req, res) => {
  try {
    const { email, password }: LoginRequest = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const result = await AuthService.loginUser({ email, password });

    res.json({
      message: "Login successful",
      ...result,
    });
  } catch (error) {
    console.error("Login error:", error);

    if (error instanceof Error && error.message === "Invalid credentials") {
      return res.status(401).json({ error: error.message });
    }

    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
