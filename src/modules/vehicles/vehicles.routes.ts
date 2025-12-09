import express from "express";
import { vehiclesController } from "./vehicles.controller";
import logger from "../../middleware/logger";
import auth from "../../middleware/auth";
const router = express.Router();

router.post("/", logger, auth("admin"), vehiclesController.addVehicles);
router.get("/", vehiclesController.getVehicles);
router.get("/:id", vehiclesController.getSingleVehicles);
router.put("/:id", logger, auth("admin"), vehiclesController.updateVehicle);
router.delete("/:id", logger, auth("admin"), vehiclesController.deleteVehicles);

export const vehiclesRoute = router;
