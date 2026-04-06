import { Router } from "express";
import * as studyPlacesController from "./controllers/studyPlacesController";

const router = Router();

router.post("/study-places", studyPlacesController.create);
router.get("/study-places", studyPlacesController.getAll);
router.get("/study-places/:id", studyPlacesController.getById);


// Health check / blank starter route
router.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

export default router;

