"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.vehiclesRoute = void 0;
const express_1 = __importDefault(require("express"));
const vehicles_controller_1 = require("./vehicles.controller");
const logger_1 = __importDefault(require("../../middleware/logger"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const router = express_1.default.Router();
router.post("/", logger_1.default, (0, auth_1.default)("admin"), vehicles_controller_1.vehiclesController.addVehicles);
router.get("/", vehicles_controller_1.vehiclesController.getVehicles);
router.get("/:id", vehicles_controller_1.vehiclesController.getSingleVehicles);
router.put("/:id", logger_1.default, (0, auth_1.default)("admin"), vehicles_controller_1.vehiclesController.updateVehicle);
router.delete("/:id", logger_1.default, (0, auth_1.default)("admin"), vehicles_controller_1.vehiclesController.deleteVehicles);
exports.vehiclesRoute = router;
