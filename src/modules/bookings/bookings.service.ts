import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import { pool } from "../../config/db";

const addBookings = async (payload: Record<string, unknown>) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;
  const vehicle = await pool.query(
    "SELECT daily_rent_price, availability_status FROM vehicles WHERE id = $1",
    [vehicle_id]
  );

  const { daily_rent_price, availability_status } = vehicle.rows[0];
  if (availability_status !== "available") {
    throw new Error("Vehicles not available!");
  }
  const dailyPrice = Number(daily_rent_price);
  const start = new Date(rent_start_date as string);
  const end = new Date(rent_end_date as string);
  const diffDay = end.getTime() - start.getTime();
  const days = diffDay / (1000 * 60 * 60 * 24);
  const totalDays = Math.ceil(days);

  const total_price = totalDays * dailyPrice;
  const status = "active";
  const result = await pool.query(
    `
    INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
    VALUES($1, $2, $3, $4, $5, $6)
    RETURNING *
    `,
    [
      customer_id,
      vehicle_id,
      rent_start_date,
      rent_end_date,
      total_price,
      status,
    ]
  );
  const booking = result.rows[0];
  if (booking) {
    await pool.query(
      `UPDATE vehicles SET availability_status = 'booked' WHERE id = $1`,
      [booking.vehicle_id]
    );
  }
  return booking;
};

const getBookings = async (reqestToken: string) => {
  const authHead = reqestToken;
  const token = authHead && authHead.split(" ")[1];
  const decoded = jwt.verify(token!, config.jwtSecret!) as JwtPayload;
  if (decoded.role !== "admin") {
    const result = await pool.query(
      `SELECT * FROM bookings WHERE customer_id = $1`,
      [decoded.id]
    );
    const today = new Date();
    for (const booking of result.rows) {
      const rentEndDate = new Date(booking.rent_end_date);
      if (rentEndDate < today && booking.status !== "returned") {
        await pool.query(
          `UPDATE bookings SET status = 'returned' WHERE id = $1`,
          [booking.id]
        );
      }
    }
    const updateData = await pool.query(
      `SELECT * FROM bookings WHERE customer_id = $1`,
      [decoded.id]
    );
    const booking = updateData.rows.map(({ customer_id, ...rest }) => rest);
    return booking;
  } else {
    const result = await pool.query(`SELECT * FROM bookings`);
    const today = new Date();
    for (const booking of result.rows) {
      const rentEndDate = new Date(booking.rent_end_date);
      if (rentEndDate < today && booking.status !== "returned") {
        await pool.query(
          `UPDATE bookings SET status = 'returned' WHERE id = $1`,
          [booking.id]
        );
      }
    }
    const updateData = await pool.query(`SELECT * FROM bookings`);
    return updateData.rows;
  }
};

const updateBookings = async (
  status: "active" | "cancelled" | "returned",
  reqestToken: string,
  id: string
) => {
  const authHead = reqestToken;
  const token = authHead && authHead.split(" ")[1];
  const decoded = jwt.verify(token!, config.jwtSecret!) as JwtPayload;
  const findData = await pool.query(`SELECT * FROM bookings WHERE id = $1`, [
    id,
  ]);
  const updateBook = findData.rows[0];
  if (decoded.role !== "admin") {
    if (decoded.id !== updateBook.customer_id) {
      throw new Error("Unathorized!");
    }
    if (status === "returned") {
      throw new Error("You are not to allow returned");
    }
    const newDate = new Date();
    const rentStartDate = new Date(findData.rows[0].rent_end_date);
    if (findData.rows[0].status === "cancelled") {
      throw new Error("You'r booking is allready canceled!");
    }
    if (findData.rows[0].status !== "returned" && newDate < rentStartDate) {
      await pool.query(
        `UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *`,
        [status, id]
      );

      await pool.query(
        `UPDATE vehicles SET availability_status = 'available' WHERE id = $1`,
        [updateBook.vehicle_id]
      );
      const findData = await pool.query(
        `SELECT * FROM bookings WHERE id = $1`,
        [id]
      );
      return findData;
    }
  } else {
    if (status === "cancelled") {
      throw new Error("Only user can cancelled");
    } else if (findData.rows[0].status === "cancelled") {
      throw new Error("Booking already cancelled");
    } else if (findData.rows[0].status === "returned") {
      throw new Error("Booking already returned");
    }
    const result = await pool.query(
      `UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *`,
      [status, id]
    );
    if (result.rows.length !== 0) {
      await pool.query(
        `UPDATE vehicles SET availability_status = 'available' WHERE id = $1`,
        [updateBook.vehicle_id]
      );
    }
    return result;
  }
};
export const bookingsService = {
  addBookings,
  getBookings,
  updateBookings,
};
