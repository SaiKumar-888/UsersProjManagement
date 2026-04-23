import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { addProjectMemberService, createProjectService, deleteProjectService, getAllProjectsService, getProjectByIdService, updateProjectService } from "./project.service.js";
const getRequiredParam = (value, name) => {
    if (typeof value === "string") {
        return value;
    }
    if (Array.isArray(value) && typeof value[0] === "string") {
        return value[0];
    }
    throw new ApiError(400, `Invalid ${name} parameter`);
};
export const createProject = catchAsync(async (req, res) => {
    const project = await createProjectService(req.user.id, req.body);
    res.status(201).json(new ApiResponse("Project created successfully", project));
});
export const getAllProjects = catchAsync(async (req, res) => {
    const projects = await getAllProjectsService(req.user.id, req.query);
    console.log(req.query, req.user.id, 'id..', req);
    res.status(200).json(new ApiResponse("Projects fetched successfully", projects));
});
export const getProjectById = catchAsync(async (req, res) => {
    const projectId = getRequiredParam(req.params.id, "project id");
    const project = await getProjectByIdService(projectId, req.user.id);
    res.status(200).json(new ApiResponse("Project fetched successfully", project));
});
export const updateProject = catchAsync(async (req, res) => {
    const projectId = getRequiredParam(req.params.id, "project id");
    const updatedProject = await updateProjectService(projectId, req.user.id, req.body);
    res.status(200).json(new ApiResponse("Project updated successfully", updatedProject));
});
export const deleteProject = catchAsync(async (req, res) => {
    const projectId = getRequiredParam(req.params.id, "project id");
    const result = await deleteProjectService(req.user.id, projectId);
    res.status(200).json(new ApiResponse(result.message, null));
});
export const addProjectMemberController = catchAsync(async (req, res) => {
    const projectId = getRequiredParam(req.params.id, "project id");
    const member = await addProjectMemberService(req.user.id, projectId, req.body.userId, req.body.role);
    res.status(201).json(new ApiResponse("Project member added successfully", member));
});
