import { Request, Response } from "express";
import { bookingsService } from "./bookings.service";
import config from "../../config";
import jwt, { JwtPayload } from "jsonwebtoken";

const addBookings = async (req: Request, res: Response) => {
  try {
    const result = await bookingsService.addBookings(req.body);
    res.status(200).json({
      success: true,
      message: "Booking created successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const getBookings = async (req: Request, res: Response) => {
  const authHead = req.headers.authorization;
  const token = authHead && authHead.split(" ")[1];
  const decoded = jwt.verify(token!, config.jwtSecret!) as JwtPayload;
  try {
    const result = await bookingsService.getBookings(
      req.headers.authorization!
    );
    res.status(200).json({
      success: true,
      message: `${
        decoded.role === "admin"
          ? "Bookings retrieved successfully"
          : "Your bookings retrieved successfully"
      }`,
      data: result,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.messsage,
    });
  }
};

const updateBookings = async (req: Request, res: Response) => {
  const { status } = req.body;
  try {
    const result = await bookingsService.updateBookings(
      status,
      req.headers.authorization!,
      req.params.id!
    );
    if (result?.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Bookings not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Booking cancelled successfully",
        data: result?.rows[0],
      });
    }
  } catch (err: any) {
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

export const bookingsController = {
  addBookings,
  getBookings,
  updateBookings,
};
