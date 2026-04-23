import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";

export const errorMiddleware = (
  error: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = error instanceof ApiError ? error.statusCode : 500;
  const message = error.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message
  });
};