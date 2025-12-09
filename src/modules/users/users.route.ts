import express from "express";
import { usersController } from "./users.controller";
import logger from "../../middleware/logger";
import auth from "../../middleware/auth";
const router = express.Router();

router.get("/", logger, auth("admin", "customer"), usersController.getUsers);
router.put(
  "/:id",
  logger,
  auth("admin", "customer"),
  usersController.updateUsers
);
router.delete("/:id", logger, auth("admin"), usersController.deleteUsers);

export const userRoutes = router;
