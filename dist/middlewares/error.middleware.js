import { ApiError } from "../utils/ApiError.js";
export const errorMiddleware = (error, req, res, next) => {
    const statusCode = error instanceof ApiError ? error.statusCode : 500;
    const message = error.message || "Internal Server Error";
    res.status(statusCode).json({
        success: false,
        message
    });
};
