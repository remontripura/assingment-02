"use strict";
// higher order function return korbe funtion k
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const auth = (...roles) => {
    return async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return res.status(401).json({ message: "unauthorized!" });
            }
            const token = authHeader.split(" ")[1];
            if (!token) {
                return res.status(401).json({ message: "unauthorized!" });
            }
            const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwtSecret);
            req.user = decoded;
            if (roles.length && !roles.includes(decoded.role)) {
                return res.status(401).json({
                    error: "unauthorized!",
                });
            }
            next();
        }
        catch (err) {
            if (err.message === "invalid signature") {
                res.status(401).json({
                    success: false,
                    message: "Token not valid",
                });
            }
            else if (err.message === "jwt expired") {
                res.status(403).json({
                    success: false,
                    message: "Token expired",
                });
            }
            res.status(500).json({
                success: false,
                message: err.message,
            });
        }
    };
};
exports.default = auth;
