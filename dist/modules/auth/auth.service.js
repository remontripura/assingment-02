"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authServices = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const db_1 = require("../../config/db");
const createUser = async (payload) => {
    const { name, email, password, phone, role } = payload;
    const emailStr = String(email);
    if (/[A-Z]/.test(emailStr)) {
        throw new Error("Email must lowercase");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailStr)) {
        throw new Error("Invalid email format");
    }
    if (password.length < 6) {
        throw new Error("Password must be at least 6 characters long");
    }
    if (role !== "admin" && role !== "customer") {
        throw new Error("role must be admin or customer");
    }
    const hashPass = await bcryptjs_1.default.hash(password, 10);
    const result = await db_1.pool.query(`
    INSERT INTO customers(name, email, password, phone, role)
    VALUES($1, $2, $3, $4, $5)
    RETURNING *
    `, [name, email, hashPass, phone, role]);
    const user = result.rows[0];
    if (user && user.password) {
        delete user.password;
    }
    return user;
};
const loginUser = async (payload) => {
    const { email, password } = payload;
    const result = await db_1.pool.query(`SELECT * FROM customers WHERE email=$1`, [
        email,
    ]);
    if (result.rows.length === 0) {
        throw new Error("User not found");
    }
    const user = result.rows[0];
    const match = await bcryptjs_1.default.compare(password, user.password);
    if (!match) {
        throw new Error("Password doesn't match");
    }
    const token = jsonwebtoken_1.default.sign({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    }, config_1.default.jwtSecret, {
        expiresIn: "7d",
    });
    const { password: pas, ...rest } = user;
    return { token, rest };
};
exports.authServices = {
    createUser,
    loginUser,
};
