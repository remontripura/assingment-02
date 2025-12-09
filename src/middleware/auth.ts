// higher order function return korbe funtion k

import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "unauthorized!" });
      }
      const token = authHeader.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "unauthorized!" });
      }
      const decoded = jwt.verify(token, config.jwtSecret!) as JwtPayload;
      req.user = decoded;

      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(401).json({
          error: "unauthorized!",
        });
      }
      next();
    } catch (err: any) {
      if (err.message === "invalid signature") {
        res.status(401).json({
          success: false,
          message: "Token not valid",
        });
      } else if (err.message === "jwt expired") {
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
export default auth;
