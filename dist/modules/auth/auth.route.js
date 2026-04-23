import { Router } from "express";
import { getCurrentUser, loginUser, registeruser } from "./auth.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { validateRequest } from "../../middlewares/validate.middleware.js";
import { loginSchema, registerSchema } from "../../validations/auth.validation.js";
const router = Router();
// Registers a new user. 
// Arguments: 
//   "/register" - The route path.
//   validateRequest(registerSchema) - Middleware that validates the request body against the registration schema.
//   registeruser - service function that registers a new user.
router.post("/register", validateRequest(registerSchema), registeruser);
router.post("/login", validateRequest(loginSchema), loginUser);
router.get("/me", authMiddleware, getCurrentUser);
export default router;
