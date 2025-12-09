"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingsRoute = void 0;
const express_1 = __importDefault(require("express"));
const bookings_controller_1 = require("./bookings.controller");
const logger_1 = __importDefault(require("../../middleware/logger"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const router = express_1.default.Router();
router.post("/", bookings_controller_1.bookingsController.addBookings);
router.get("/", logger_1.default, (0, auth_1.default)("admin", "customer"), bookings_controller_1.bookingsController.getBookings);
router.put("/:id", logger_1.default, (0, auth_1.default)("admin", "customer"), bookings_controller_1.bookingsController.updateBookings);
exports.bookingsRoute = router;
