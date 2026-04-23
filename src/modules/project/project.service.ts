import { prisma } from "../../config/prisma.js";
import { ApiError } from "../../utils/ApiError.js";

type CreateProjectPayload = {
  name: string;
  description: string;
};

type UpdateProjectPayload = {
  name: string;
  description: string;
};

/**
 * CREATE PROJECT
 * - Creates project
 * - Adds owner to ProjectMember table
 */
export const createProjectService = async (
  userId: string,
  payload: CreateProjectPayload
) => {
  const project = await prisma.project.create({
    data: {
      name: payload.name,
      description: payload.description,
      ownerId: userId,

      // 🔥 IMPORTANT: add owner as member
      // This line adds the owner as a member of the project (role: "OWNER") in the ProjectMember table when a new project is created.
      // It creates a record in the ProjectMember table (not the Project table) linked to this project and user.
      members: {
        create: {
          userId,
          role: "OWNER"
        }
      }
    }
  });

  console.log(project, 'project..');
  return project;
};

/**
 * GET ALL PROJECTS (pagination unchanged)
 */
export const getAllProjectsService = async (
  userId: string,
  query: any
) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const search = query.search || "";
  const skip = (page - 1) * limit;

  const whereCondition: any = {
    ownerId: userId
  };

  if (search) {
    whereCondition.name = {
      contains: search,
      mode: "insensitive"
    };
  }

  const [projects, total] = await Promise.all([
    prisma.project.findMany({
      where: whereCondition,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc"
      }
    }),
    prisma.project.count({
      where: whereCondition
    })
  ]);

  return {
    projects,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};

/**
 * GET PROJECT BY ID
 */
export const getProjectByIdService = async (
  projectId: string,
  userId: string
) => {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      ownerId: userId
    }
  });

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  return project;
};

/**
 * UPDATE PROJECT
 */
export const updateProjectService = async (
  projectId: string,
  userId: string,
  payload: UpdateProjectPayload
) => {
  const existingProject = await prisma.project.findFirst({
    where: {
      id: projectId,
      ownerId: userId
    }
  });

  if (!existingProject) {
    throw new ApiError(404, "Project not found");
  }

  const updatedProject = await prisma.project.update({
    where: {
      id: projectId
    },
    data: {
      ...(payload.name && { name: payload.name }),
      ...(payload.description && { description: payload.description })
    }
  });

  return updatedProject;
};

/**
 * DELETE PROJECT
 */
export const deleteProjectService = async (
  userId: string,
  projectId: string
) => {
  const existingProject = await prisma.project.findFirst({
    where: {
      id: projectId,
      ownerId: userId
    }
  });

  if (!existingProject) {
    throw new ApiError(404, "Project not found");
  }

  await prisma.project.delete({
    where: {
      id: projectId
    }
  });

  return {
    message: "Project deleted successfully"
  };
};

/**
 * ADD PROJECT MEMBER
 * - Only OWNER can add
 * - Validates role
 * - Prevents duplicate
 * - Checks user existence
 */
export const addProjectMemberService = async (
  userId: string,
  projectId: string,
  memberUserId: string,
  role: "ADMIN" | "MEMBER"
) => {
  // ✅ 1. Check project & ownership
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      ownerId: userId
    }
  });

  if (!project) {
    throw new ApiError(403, "Only owner can add members or project not found");
  }

  // ✅ 2. Validate role
  if (!["ADMIN", "MEMBER"].includes(role)) {
    throw new ApiError(400, "Invalid role");
  }

  // ✅ 3. Check user exists
  const userExists = await prisma.user.findUnique({
    where: {
      id: memberUserId
    }
  });

  if (!userExists) {
    throw new ApiError(404, "User not found");
  }

  // ✅ 4. Prevent duplicate member
  const alreadyExists = await prisma.projectMember.findFirst({
    where: {
      projectId,
      userId: memberUserId
    }
  });

  if (alreadyExists) {
    throw new ApiError(400, "User already a member of this project");
  }

  // ✅ 5. Add member
  const member = await prisma.projectMember.create({
    data: {
      userId: memberUserId,
      projectId,
      role
    }
  });

  return member;
};

// WHY Promise.all?

// Instead of:

// const projects = await prisma.project.findMany(...)
// const total = await prisma.project.count(...)

// We do:

// await Promise.all([...])
// Benefit:

// Both queries run in parallel, so we get the results faster