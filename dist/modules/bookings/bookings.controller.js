"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingsController = void 0;
const bookings_service_1 = require("./bookings.service");
const config_1 = __importDefault(require("../../config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const addBookings = async (req, res) => {
    try {
        const result = await bookings_service_1.bookingsService.addBookings(req.body);
        res.status(200).json({
            success: true,
            message: "Booking created successfully",
            data: result,
        });
    }
    catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
const getBookings = async (req, res) => {
    const authHead = req.headers.authorization;
    const token = authHead && authHead.split(" ")[1];
    const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwtSecret);
    try {
        const result = await bookings_service_1.bookingsService.getBookings(req.headers.authorization);
        res.status(200).json({
            success: true,
            message: `${decoded.role === "admin"
                ? "Bookings retrieved successfully"
                : "Your bookings retrieved successfully"}`,
            data: result,
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: err.messsage,
        });
    }
};
const updateBookings = async (req, res) => {
    const { status } = req.body;
    try {
        const result = await bookings_service_1.bookingsService.updateBookings(status, req.headers.authorization, req.params.id);
        if (result?.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "Bookings not found",
            });
        }
        else {
            res.status(200).json({
                success: true,
                message: "Booking cancelled successfully",
                data: result?.rows[0],
            });
        }
    }
    catch (err) {
        if (err.message === "Unathorized!") {
            res.status(401).json({
                message: err?.message,
            });
        }
        res.status(400).json({
            success: false,
            message: err?.message,
        });
    }
};
exports.bookingsController = {
    addBookings,
    getBookings,
    updateBookings,
};
