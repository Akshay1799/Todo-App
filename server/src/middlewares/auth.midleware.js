// auth.middleware.js

import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { config } from "../config/index.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const protect = asyncHandler(async (req, res, next) => {

    let token = req.cookies?.token;

    if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(new AppError("Not authorized, token missing", 400));
    }

    const decoded = jwt.verify(token, config.jwtSecret);

    const user = await User.findById(decoded.id).select("-password");
    if (!user)
      return next(new AppError("user not found", 404))

    req.user = user;

    next();
    
});
