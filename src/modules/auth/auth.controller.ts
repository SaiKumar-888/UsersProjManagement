import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import { getCurrentUserService, loginUserService, registerUserService } from "./auth.service.js";
import { ApiResponse } from "../../utils/ApiResponse.js";



export const registeruser = catchAsync(async(req: Request, res: Response) => {
    const user = await registerUserService(req.body);

    res.status(201).json(new ApiResponse('User registered successfully', user))
})

export const loginUser = catchAsync(async(req: Request, res: Response) => {
    const user = await loginUserService(req.body);

    res.status(200).json(new ApiResponse('User logged in successfully', user))
})

export const getCurrentUser = catchAsync(async (req: Request, res: Response) => {
    const user = await getCurrentUserService(req.user!.id);
  
    res.status(200).json(
      new ApiResponse("Current user fetched successfully", user)
    );
  });