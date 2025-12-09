import { Request, Response } from "express";
import { usersServices } from "./users.service";

const getUsers = async (req: Request, res: Response) => {
  try {
    const result = await usersServices.getUsers(req.headers.authorization!);
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const updateUsers = async (req: Request, res: Response) => {
  try {
    const result = await usersServices.updateUsers(
      req.body,
      req?.headers?.authorization!,
      req.params.id!
    );
    if (result?.length === 0) {
      res.status(404).json({
        success: false,
        message: "Users not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "User updated successfull",
        data: result[0],
      });
    }
  } catch (err: any) {
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

const deleteUsers = async (req: Request, res: Response) => {
  try {
    const result = await usersServices.deleteUsers(
      req.params.id as string,
      req?.headers?.authorization!
    );
    if (result.rowCount === 0) {
      res.status(200).json({
        success: false,
        message: "Users not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    }
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
export const usersController = {
  getUsers,
  updateUsers,
  deleteUsers,
};
