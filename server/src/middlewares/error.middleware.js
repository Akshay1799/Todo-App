// error.middleware.js
import mongoose from "mongoose";
import { AppError } from "../utils/AppError.js";

export const notFound = (req, res, next)=>{
    next(new AppError(`Route not found ${req.originalUrl}`))
}

export function errorHandler(err, req, res, next){
    const statusCode = err.statusCode || 500;
    const message= err.message || 'Something went wrong';


    if(err.name === 'CastError'){
        return res.status(400).json({
            status:'fail',
            message:'Invalid ID format'
        })
    }

    if(err.code === 11000){
        return res.status(409).json({
            status:'fail',
            message:'Duplicate key, Already exists.'
        })
    }

    return res.status(statusCode).json({
        status: err.status || "error",
        message
    })


}

