import { z } from "zod";

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(3, "Task title must be at least 3 characters")
    .max(100, "Task title cannot exceed 100 characters"),

  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),

  status: z
    .enum(["PENDING", "IN_PROGRESS", "COMPLETED"])
    .optional(),

  priority: z
    .enum(["LOW", "MEDIUM", "HIGH"])
    .optional(),

  projectId: z
    .string()
    .min(1, "Project ID is required")
});

export const updateTaskSchema = z.object({
  title: z
    .string()
    .min(3, "Task title must be at least 3 characters")
    .max(100, "Task title cannot exceed 100 characters")
    .optional(),

  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),

  status: z
    .enum(["PENDING", "IN_PROGRESS", "COMPLETED"])
    .optional(),

  priority: z
    .enum(["LOW", "MEDIUM", "HIGH"])
    .optional()
});