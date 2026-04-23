import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../config/prisma.js";
import { ApiError } from "../../utils/ApiError.js";
export const registerUserService = async ({ name, email, password }) => {
    const existingUser = await prisma.user.findUnique({
        where: { email }
    });
    if (existingUser) {
        throw new ApiError(409, "User already exists with this email");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword
        }
    });
    return {
        id: user.id,
        name: user.name,
        email: user.email
    };
};
export const loginUserService = async ({ email, password }) => {
    const user = await prisma.user.findUnique({
        where: { email }
    });
    if (!user) {
        throw new ApiError(401, "Invalid email or password");
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid email or password");
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    // const decoded = jwt.decode(token);
    // console.log(decoded, 'decoded');
    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        }
    };
};
export const getCurrentUserService = async (userId) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            updatedAt: true
        }
    });
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    return user;
};
