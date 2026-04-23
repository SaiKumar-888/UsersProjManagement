import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import { createTaskservice, deleteTaskService, getTasksByProjectService, updateTaskService } from "./task.service.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";

const getRequiredParam = (value: string | string[] | undefined, name: string): string => {
    if(typeof value === 'string') {
        return value;
    }
    if(Array.isArray(value) && typeof value[0] === 'string') {
        return value[0];
    }
    throw new ApiError(400, `Invalid ${name} parameter`);
}

export const createTaskcontroller = catchAsync(async(req: Request, res: Response) => {
    const task = await createTaskservice(req.user!.id, req.body);

    res.status(201).json(new ApiResponse('Task created successfully', task))
})

export const getTasksByProjectController = catchAsync(async(req: Request, res: Response) => {
    const projectId  = getRequiredParam(req.params.id, 'project id');
    const tasks = await getTasksByProjectService(projectId, req.user!.id, req.query);

    res.status(200).json(new ApiResponse('Tasks fetched successfully', tasks))

})

export const updateTaskController =  catchAsync( async(req: Request, res: Response) => {
    const taskId = getRequiredParam(req.params.id, 'task id');
    const updatedTask = await updateTaskService(taskId, req.user!.id, req.body);

    res.status(200).json(new ApiResponse('Task updated successfully', updatedTask))
})


export const deleteTaskController = catchAsync(async(req: Request, res: Response) => {
const taskId = getRequiredParam(req.params.id, 'task id');
const result = await deleteTaskService(taskId, req.user!.id);

res.status(200).json(new ApiResponse(result.message, null))
})