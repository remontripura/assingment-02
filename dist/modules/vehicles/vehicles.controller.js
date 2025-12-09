"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vehiclesController = void 0;
const vehicles_service_1 = require("./vehicles.service");
const addVehicles = async (req, res) => {
    try {
        const result = await vehicles_service_1.vehicleService.addVehicles(req.body, req.headers.authorization);
        res.status(201).json({
            success: true,
            message: "Vehicle created successfully",
            data: result,
        });
    }
    catch (err) {
        if (err.message === "Unathorized!") {
            res.status(401).json({ message: err.message });
        }
        res.status(400).json({ success: false, message: err.message });
    }
};
const getVehicles = async (req, res) => {
    try {
        const result = await vehicles_service_1.vehicleService.getVehicles();
        res.status(200).json({
            success: true,
            message: `${result.length === 0
                ? "No vehicles found"
                : "Vehicle created successfully"}`,
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
const getSingleVehicles = async (req, res) => {
    try {
        const result = await vehicles_service_1.vehicleService.getSingleVehicles(req.params.id);
        if (result.rows.length === 0) {
            res.status(200).json({
                success: false,
                message: "Vehicles not found",
            });
        }
        else {
            res.status(200).json({
                success: true,
                message: "Vehicle retrieved successfully",
                data: result.rows[0],
            });
        }
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: err.messsage,
        });
    }
};
const updateVehicle = async (req, res) => {
    const { daily_rent_price, availability_status } = req.body;
    try {
        const result = await vehicles_service_1.vehicleService.updateVehicle(daily_rent_price, availability_status, req.params.id);
        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "Not Found Vehicle",
            });
        }
        else {
            res.status(200).json({
                success: false,
                message: "Vehicle updated successfully",
                data: result.rows[0],
            });
        }
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: err?.message,
        });
    }
};
const deleteVehicles = async (req, res) => {
    try {
        const result = await vehicles_service_1.vehicleService.deleteVehicles(req.params.id, req.headers.authorization);
        if (result.rowCount === 0) {
            res.status(200).json({
                success: false,
                message: "Vehicles not found",
            });
        }
        else {
            res.status(200).json({
                success: true,
                message: "Vehicle deleted successfully",
            });
        }
    }
    catch (err) {
        if (err.message === "Unathorized!") {
            res.status(401).json({
                message: err.message,
            });
        }
        res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};
exports.vehiclesController = {
    addVehicles,
    getVehicles,
    getSingleVehicles,
    updateVehicle,
    deleteVehicles,
};
