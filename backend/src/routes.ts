import { Router } from "express";

const router = Router();

// Health check / blank starter route
router.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

export default router;

