import { Router } from "express";
import projectRoutes from "../modules/project/project.route.js";
import taskRoutes from "../modules/task/task.route.js";
import authRoutes from "../modules/auth/auth.route.js";
const router = Router();
router.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "TaskFlow Backend API is running 🚀"
    });
});
router.use("/projects", projectRoutes);
router.use("/tasks", taskRoutes);
router.use("/auth", authRoutes);
export default router;
