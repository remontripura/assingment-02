"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = __importDefault(require("express"));
const users_controller_1 = require("./users.controller");
const logger_1 = __importDefault(require("../../middleware/logger"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const router = express_1.default.Router();
router.get("/", logger_1.default, (0, auth_1.default)("admin", "customer"), users_controller_1.usersController.getUsers);
router.put("/:id", logger_1.default, (0, auth_1.default)("admin", "customer"), users_controller_1.usersController.updateUsers);
router.delete("/:id", logger_1.default, (0, auth_1.default)("admin"), users_controller_1.usersController.deleteUsers);
exports.userRoutes = router;
