import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import { pool } from "../../config/db";

const getUsers = async (reqestToken: string) => {
  const authHead = reqestToken;
  const token = authHead && authHead.split(" ")[1];
  const decoded = jwt.verify(token!, config.jwtSecret!) as JwtPayload;
  if (decoded.role !== "admin") {
    const result = await pool.query(`SELECT * FROM customers WHERE id = $1`, [
      decoded.id,
    ]);
    const user = result.rows[0];
    if (user && user.password) {
      delete user.password;
    }
    return user;
  }
  const result = await pool.query(`SELECT * FROM customers`);
  const users = result.rows.map(({ password, ...rest }) => rest);
  return users;
};

const updateUsers = async (
  payload: Record<string, unknown>,
  authToken: string,
  id: string
) => {
  const { name, email, phone, role } = payload;
  const authHead = authToken as string | undefined;
  const token = authHead && authHead.split(" ")[1];
  const decoded = jwt.verify(token!, config.jwtSecret!) as JwtPayload;
  if (decoded.role === "customer") {
    const checkUser = await pool.query(
      `SELECT * FROM customers WHERE id = $1`,
      [id]
    );

    if (checkUser.rows.length === 0) {
      throw new Error("User not found");
    }
    if (Number(decoded.id) !== Number(id)) {
      throw new Error("Unathorized");
    }
    if (role !== undefined && role !== "") {
      throw new Error("Only admin can update role");
    }
    const result = await pool.query(
      `UPDATE customers SET name=$1, email=$2, phone=$3 WHERE id=$4 RETURNING *`,
      [name, email, phone, id]
    );
    const users = result.rows.map(({ password, ...rest }) => rest);
    return users;
  } else {
    const result = await pool.query(
      `UPDATE customers SET name=$1, email=$2, phone=$3, role=$4 WHERE id=$5 RETURNING *`,
      [name, email, phone, role, id]
    );
    const users = result.rows.map(({ password, ...rest }) => rest);
    return users;
  }
};

const deleteUsers = async (id: string, authToken: string) => {
  const bookingCheck = await pool.query(
    `SELECT customer_id FROM bookings WHERE id = $1`,
    [id]
  );
  if (bookingCheck.rows.length !== 0) {
    throw new Error("Customer has bookings");
  } else {
    const result = await pool.query(`DELETE FROM customers WHERE id = $1`, [
      id,
    ]);
    return result;
  }
};
export const usersServices = {
  getUsers,
  updateUsers,
  deleteUsers,
};
