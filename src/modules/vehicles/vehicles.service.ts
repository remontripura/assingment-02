import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import { pool } from "../../config/db";

const addVehicles = async (
  payload: Record<string, unknown>,
  reqestToken: string
) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;
  const authHead = reqestToken;
  const token = authHead && authHead.split(" ")[1];
  const decoded = jwt.verify(token!, config.jwtSecret!) as JwtPayload;
  if (decoded.role !== "admin") {
    throw new Error("Unathorized!");
  }
  const result = await pool.query(
    `
    INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status)
    VALUES($1, $2, $3, $4, $5)
    RETURNING *
    `,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    ]
  );
  return result.rows[0];
};

const getVehicles = async () => {
  const result = await pool.query(`SELECT * FROM vehicles`);
  return result.rows;
};
const getSingleVehicles = async (id: string) => {
  const result = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [id]);
  return result;
};
const updateVehicle = async (
  daily_rent_price: string,
  availability_status: string,
  id: string
) => {
  if (Number(daily_rent_price) <= 0) {
    throw new Error("Price must be a positive number");
  }

  if (availability_status !== "available" && availability_status !== "booked") {
    throw new Error("Vehicle status only allow available or booked");
  }
  const result = await pool.query(
    `UPDATE vehicles SET daily_rent_price=$1, availability_status=$2 WHERE id=$3 RETURNING *`,
    [daily_rent_price, availability_status, id]
  );
  return result;
};
const deleteVehicles = async (id: string, reqestToken: string) => {
  const authHead = reqestToken;
  const token = authHead && authHead.split(" ")[1];
  const decoded = jwt.verify(token!, config.jwtSecret!) as JwtPayload;
  if (decoded.role !== "admin") {
    throw new Error("Unathorized!");
  }
  const vehicle = await pool.query(
    `SELECT availability_status FROM vehicles WHERE id = $1`,
    [id]
  );
  if (vehicle.rowCount === 0) {
    throw new Error("Vehicles not found");
  }
  if (vehicle.rows[0].availability_status === "booked") {
    throw new Error("Vehicle is booked, Cann't delete");
  }
  const result = await pool.query(
    `DELETE FROM vehicles WHERE id = $1 RETURNING *`,
    [id]
  );
  return result;
};

export const vehicleService = {
  addVehicles,
  getVehicles,
  getSingleVehicles,
  updateVehicle,
  deleteVehicles,
};
