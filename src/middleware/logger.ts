import { NextFunction, Request, Response } from "express";
const logger = (req: Request, res: Response, next: NextFunction) => {
  next();
};
export default logger;
