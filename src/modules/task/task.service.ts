import { TaskPriority, TaskStatus } from "@prisma/client";
import { prisma } from "../../config/prisma.js";
import { ApiError } from "../../utils/ApiError.js";
type CreateTaskPayload = {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  projectId: string;
};

type UpdateTaskPayload = {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
};

export const createTaskservice = async (
  userId: string,
  payload: CreateTaskPayload,
) => {
  const project = await prisma.project.findFirst({
    where: {
      id: payload.projectId,
      members: {
        some: {
          userId: userId
        }
      }
    } as any,
  });
console.log(project, 'project', userId, 'userId', payload, 'payload');
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const task = await prisma.task.create({
    data: {
      title: payload.title,
      description: payload.description,
      status: payload.status || TaskStatus.PENDING,
      priority: payload.priority || TaskPriority.MEDIUM,
      projectId: payload.projectId,
      createdById: userId,
    },
  });

  return task;
};

export const getTasksByProjectService = async (
  projectId: string, // ID of the project to fetch tasks from
  userId: string,    // ID of the current user
  query: any,        // Query object containing filter, pagination params
) => {
  // Extract pagination and filter params with default values
  const page = Number(query.page) || 1; // Current page number
  const limit = Number(query.limit) || 10; // Number of tasks per page
  const search = query.search || ""; // Search keyword for title
  const status = query.status || ""; // Task status filter
  const priority = query.priority || ""; // Task priority filter

  // Calculate number of records to skip for pagination
  const skip = (page - 1) * limit;

  // Initialize base where condition with projectId
  const whereCondition: any = {
    projectId: projectId,
  };

  // Ensure the user owns the project
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      members: {
        some: {
          userId: userId
        }
      }
    } as any,
  });

  // Throw error if project is not found
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  // Apply search filter for task title if provided
  if (search) {
    whereCondition.title = {
      contains: search,
      mode: "insensitive",
    };
  }

  // Apply status filter if provided
  if (status) {
    whereCondition.status = status;
  }

  // Apply priority filter if provided
  if (priority) {
    whereCondition.priority = priority;
  }

  // Fetch tasks and total count concurrently
  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where: whereCondition,
      skip, // Skip for pagination
      take: limit, // Limit number of tasks returned
      orderBy: {
        createdAt: "desc", // Sort by latest created
      },
    }),
    prisma.task.count({
      where: whereCondition, // Count for pagination meta
    }),
  ]);

  // Return tasks and pagination meta info
  return {
    tasks,
    meta: {
      total, // Total number of matching tasks
      page, // Current page
      limit, // Tasks per page
      totalPages: Math.ceil(total / limit), // Total pages available
    },
  };
};

export const updateTaskService = async(taskId:string, userId: string, payload: UpdateTaskPayload) => {
  const existingtask =await prisma.task.findFirst({
    where: {
      id: taskId,
      createdById: userId
    }
  })

  if(!existingtask) {
    throw new ApiError(404, "Task not found");
  }

  const updateTask = await prisma.task.update({
    where: {
      id: taskId
    },
    data: {
      ...(payload.title && { title: payload.title }),
      ...(payload.description && { description: payload.description }),
      ...(payload.status && { status: payload.status }),
      ...(payload.priority && { priority: payload.priority }),
    }

  })
  return updateTask;
}

export const deleteTaskService = async(taskId:string, userId: string) => {
  const existingtask =await prisma.task.findFirst({
    where: {
      id: taskId,
      createdById: userId
    }
  })

  if(!existingtask) {
    throw new ApiError(404, "Task not found");
  }
  await prisma.task.delete({
    where: {
      id: taskId
    }
  })
  return {
    message: "Task deleted successfully"
  }
}
