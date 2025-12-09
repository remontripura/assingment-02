import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";
import { pool } from "../../config/db";

const createUser = async (payload: Record<string, unknown>) => {
  const { name, email, password, phone, role } = payload;
  const emailStr = String(email);
  if (/[A-Z]/.test(emailStr)) {
    throw new Error("Email must lowercase");
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailStr)) {
    throw new Error("Invalid email format");
  }
  if ((password as string).length < 6) {
    throw new Error("Password must be at least 6 characters long");
  }
  if (role !== "admin" && role !== "customer") {
    throw new Error("role must be admin or customer");
  }
  const hashPass = await bcrypt.hash(password as string, 10);
  const result = await pool.query(
    `
    INSERT INTO customers(name, email, password, phone, role)
    VALUES($1, $2, $3, $4, $5)
    RETURNING *
    `,
    [name, email, hashPass, phone, role]
  );

  const user = result.rows[0];
  if (user && user.password) {
    delete user.password;
  }
  return user;
};

const loginUser = async (payload: Record<string, unknown>) => {
  const { email, password } = payload;
  const result = await pool.query(`SELECT * FROM customers WHERE email=$1`, [
    email,
  ]);
  if (result.rows.length === 0) {
    throw new Error("User not found");
  }
  const user = result.rows[0];
  const match = await bcrypt.compare(password as string, user.password);
  if (!match) {
    throw new Error("Password doesn't match");
  }
  const token = jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    config.jwtSecret!,
    {
      expiresIn: "7d",
    }
  );
  const { password: pas, ...rest } = user;
  return { token, rest };
};

export const authServices = {
  createUser,
  loginUser,
};
