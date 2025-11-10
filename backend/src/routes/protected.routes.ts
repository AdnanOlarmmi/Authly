import { Router } from "express";
import { authenticateToken, requireRole } from "../middleware/auth.middleware";

const router = Router();

router.get("/profile", authenticateToken, (req, res) => {
  res.json({
    message: "Profile accessed successfully",
    user: req.user,
  });
});

router.get("/admin", authenticateToken, requireRole("ADMIN"), (req, res) => {
  res.json({
    message: "Admin access granted",
    user: req.user,
  });
});

router.get(
  "/users",
  authenticateToken,
  requireRole("ADMIN"),
  async (req, res) => {
    try {
      res.json({
        message: "Users fetched successfully",
        users: [],
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch users",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

export default router;
