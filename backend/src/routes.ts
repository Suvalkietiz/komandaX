import { Router } from "express";
import * as studyPlacesController from "./controllers/studyPlacesController";
import * as reviewController from "./controllers/reviewController";
import * as savedPlacesController from "./controllers/savedPlacesController";

const router = Router();

router.post("/study-places", studyPlacesController.create);
router.get("/study-places", studyPlacesController.getAll);
router.get("/study-places/filtered", studyPlacesController.getFiltered);
router.get("/study-places/:id", studyPlacesController.getById);

router.post("/reviews", reviewController.create);
router.get("/reviews/study-place/:studyPlaceId", reviewController.getByStudyPlace);

router.post("/saved-places", savedPlacesController.savePlace);
router.get("/saved-places", savedPlacesController.getSavedPlaces);
router.delete("/saved-places/:savedPlaceId", savedPlacesController.removeSavedPlace);

router.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

export default router;