"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./config/db"));
const auth_route_1 = require("./modules/auth/auth.route");
const bookings_routes_1 = require("./modules/bookings/bookings.routes");
const users_route_1 = require("./modules/users/users.route");
const vehicles_routes_1 = require("./modules/vehicles/vehicles.routes");
const app = (0, express_1.default)();
app.use(express_1.default.json());
(0, db_1.default)();
app.use("/api/v1/auth", auth_route_1.SignupRoute);
app.use("/api/v1/vehicles", vehicles_routes_1.vehiclesRoute);
app.use("/api/v1/users", users_route_1.userRoutes);
app.use("/api/v1/bookings", bookings_routes_1.bookingsRoute);
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
        path: req.path,
    });
});
exports.default = app;
