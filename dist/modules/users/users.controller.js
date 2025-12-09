"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersController = void 0;
const users_service_1 = require("./users.service");
const getUsers = async (req, res) => {
    try {
        const result = await users_service_1.usersServices.getUsers(req.headers.authorization);
        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: result,
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};
const updateUsers = async (req, res) => {
    try {
        const result = await users_service_1.usersServices.updateUsers(req.body, req?.headers?.authorization, req.params.id);
        if (result?.length === 0) {
            res.status(404).json({
                success: false,
                message: "Users not found",
            });
        }
        else {
            res.status(200).json({
                success: true,
                message: "User updated successfull",
                data: result[0],
            });
        }
    }
    catch (err) {
        if (err.message === "Unathorized") {
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
const deleteUsers = async (req, res) => {
    try {
        const result = await users_service_1.usersServices.deleteUsers(req.params.id, req?.headers?.authorization);
        if (result.rowCount === 0) {
            res.status(200).json({
                success: false,
                message: "Users not found",
            });
        }
        else {
            res.status(200).json({
                success: true,
                message: "User deleted successfully",
            });
        }
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};
exports.usersController = {
    getUsers,
    updateUsers,
    deleteUsers,
};
