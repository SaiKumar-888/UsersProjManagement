import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { addProjectMemberController, createProject, deleteProject, getAllProjects, getProjectById, updateProject } from "./project.controller.js";
import { validateRequest } from "../../middlewares/validate.middleware.js";
import { createProjectSchema, updateProjectSchema } from "../../validations/project.validation.js";
const router = Router();
// Protected routes - only authenticated users can access these routes
router.use(authMiddleware);
// Creates a new project. 
// Arguments: 
//   "/" - The route path.
//   validateRequest(createProjectSchema) - Middleware that validates the request body against the create project schema.
//   createProject - service function that creates a new project.
router.post("/", validateRequest(createProjectSchema), createProject); // Create a new project
router.get("/", getAllProjects); // Get all projects
router.get("/:id", getProjectById); // Get a project by ID
router.patch("/:id", validateRequest(updateProjectSchema), updateProject); // Update a project
router.delete("/:id", deleteProject); // Delete a project
router.post("/:id/members", addProjectMemberController); // Add or update a project member
export default router;
