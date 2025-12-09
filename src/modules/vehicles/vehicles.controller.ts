import { Request, Response } from "express";
import { vehicleService } from "./vehicles.service";

const addVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehicleService.addVehicles(
      req.body,
      req.headers.authorization!
    );
    res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: result,
    });
  } catch (err: any) {
    if (err.message === "Unathorized!") {
      res.status(401).json({ message: err.message });
    }
    res.status(400).json({ success: false, message: err.message });
  }
};

const getVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehicleService.getVehicles();
    res.status(200).json({
      success: true,
      message: `${
        result.length === 0
          ? "No vehicles found"
          : "Vehicle created successfully"
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

const getSingleVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehicleService.getSingleVehicles(
      req.params.id as string
    );
    if (result.rows.length === 0) {
      res.status(200).json({
        success: false,
        message: "Vehicles not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Vehicle retrieved successfully",
        data: result.rows[0],
      });
    }
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.messsage,
    });
  }
};

const updateVehicle = async (req: Request, res: Response) => {
  const { daily_rent_price, availability_status } = req.body;
  try {
    const result = await vehicleService.updateVehicle(
      daily_rent_price,
      availability_status,
      req.params.id!
    );
    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Not Found Vehicle",
      });
    } else {
      res.status(200).json({
        success: false,
        message: "Vehicle updated successfully",
        data: result.rows[0],
      });
    }
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err?.message,
    });
  }
};
const deleteVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehicleService.deleteVehicles(
      req.params.id as string,
      req.headers.authorization!
    );
    if (result.rowCount === 0) {
      res.status(200).json({
        success: false,
        message: "Vehicles not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Vehicle deleted successfully",
      });
    }
  } catch (err: any) {
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

export const vehiclesController = {
  addVehicles,
  getVehicles,
  getSingleVehicles,
  updateVehicle,
  deleteVehicles,
};
