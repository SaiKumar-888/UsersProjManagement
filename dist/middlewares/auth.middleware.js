import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma.js";
import { ApiError } from "../utils/ApiError.js";
export const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next(new ApiError(401, "Unauthorized: Token missing"));
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                name: true,
                email: true
            }
        });
        if (!user) {
            return next(new ApiError(401, "Unauthorized: User not found"));
        }
        req.user = user;
        next();
    }
    catch (error) {
        return next(new ApiError(401, "Unauthorized: Invalid token"));
    }
};
