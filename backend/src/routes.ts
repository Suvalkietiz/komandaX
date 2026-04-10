import { Router } from "express";
import * as studyPlacesController from "./controllers/studyPlacesController";
import * as reviewController from "./controllers/reviewController";

const router = Router();

router.post("/study-places", studyPlacesController.create);
router.get("/study-places", studyPlacesController.getAll);
router.get("/study-places/filtered", studyPlacesController.getFiltered);
router.get("/study-places/:id", studyPlacesController.getById);
router.post("/reviews", reviewController.create);

// Health check / blank starter route
router.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

export default router;
