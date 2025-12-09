import express from "express";
import auth from "../../middleware/auth";
import logger from "../../middleware/logger";
import { bookingsController } from "./bookings.controller";
const router = express.Router();

router.post("/", bookingsController.addBookings);
router.get(
  "/",
  logger,
  auth("admin", "customer"),
  bookingsController.getBookings
);
router.put(
  "/:id",
  logger,
  auth("admin", "customer"),
  bookingsController.updateBookings
);

export const bookingsRoute = router;
