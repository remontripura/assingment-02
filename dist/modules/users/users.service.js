"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersServices = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const db_1 = require("../../config/db");
const getUsers = async (reqestToken) => {
    const authHead = reqestToken;
    const token = authHead && authHead.split(" ")[1];
    const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwtSecret);
    if (decoded.role !== "admin") {
        const result = await db_1.pool.query(`SELECT * FROM customers WHERE id = $1`, [
            decoded.id,
        ]);
        const user = result.rows[0];
        if (user && user.password) {
            delete user.password;
        }
        return user;
    }
    const result = await db_1.pool.query(`SELECT * FROM customers`);
    const users = result.rows.map(({ password, ...rest }) => rest);
    return users;
};
const updateUsers = async (payload, authToken, id) => {
    const { name, email, phone, role } = payload;
    const authHead = authToken;
    const token = authHead && authHead.split(" ")[1];
    const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwtSecret);
    if (decoded.role === "customer") {
        const checkUser = await db_1.pool.query(`SELECT * FROM customers WHERE id = $1`, [id]);
        if (checkUser.rows.length === 0) {
            throw new Error("User not found");
        }
        if (Number(decoded.id) !== Number(id)) {
            throw new Error("Unathorized");
        }
        if (role !== undefined && role !== "") {
            throw new Error("Only admin can update role");
        }
        const result = await db_1.pool.query(`UPDATE customers SET name=$1, email=$2, phone=$3 WHERE id=$4 RETURNING *`, [name, email, phone, id]);
        const users = result.rows.map(({ password, ...rest }) => rest);
        return users;
    }
    else {
        const result = await db_1.pool.query(`UPDATE customers SET name=$1, email=$2, phone=$3, role=$4 WHERE id=$5 RETURNING *`, [name, email, phone, role, id]);
        const users = result.rows.map(({ password, ...rest }) => rest);
        return users;
    }
};
const deleteUsers = async (id, authToken) => {
    const bookingCheck = await db_1.pool.query(`SELECT customer_id FROM bookings WHERE id = $1`, [id]);
    if (bookingCheck.rows.length !== 0) {
        throw new Error("Customer has bookings");
    }
    else {
        const result = await db_1.pool.query(`DELETE FROM customers WHERE id = $1`, [
            id,
        ]);
        return result;
    }
};
exports.usersServices = {
    getUsers,
    updateUsers,
    deleteUsers,
};
