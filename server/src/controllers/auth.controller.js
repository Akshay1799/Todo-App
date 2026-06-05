// auth.controller.js
import User from "../models/user.model.js";
import { config } from "../config/index.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateToken } from "../utils/generateToken.js";
import crypto from "crypto";

export const signup = asyncHandler(async(req, res, next)=>{

        const{name, email, password} = req.body;

        if(!name || !email || !password) return next(new AppError("All fields required", 400))

        const existingUser = await User.findOne({email});
        if(existingUser) return next(new AppError("User already exists", 409))

        const user = await User.create({name, email, password});

        return res.status(201).json({
            message:'User created succesfully!',
            user:{
                name: user.name,
                email:user.email,
            }
        })
})

export const login = asyncHandler(async(req, res, next)=>{   

        const {email, password} = req.body;

        if(!email || !password) return next(new AppError("Not authorized, token missing", 401))

        const user = await User.findOne({email});
        if(!user)return next(new AppError("Invalid credentials", 401))
        
        const isMatch = await user.comparePassword(password);
        if(!isMatch)return next(new AppError("Invalid credentials", 401))

        const token = generateToken(user._id);

        const isProd = config.env === "production"

        res.cookie('token', token, {
            httpOnly:true,
            secure:isProd,
            sameSite:isProd ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(200).json({
            message:'Logged in succesfully',
            token,
            user:{
                id: user._id,
                email: user.email,
            }
        })
        
})

export const logout = asyncHandler(async(req, res)=>{

        const isProd = config.env === "production"

        res.clearCookie('token',{
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? "none" : "lax",
        })

        res.status(200).json({status:'success', message:'Logged out successfully!'})
})

export const forgotPassword = asyncHandler(async(req, res, next)=>{
    const {email} = req.body;
    if(!email) return next(new AppError("Email is required", 400));

    const user = await User.findOne({email});
    if(!user) return res.status(200).json({
        status:'success',
        message: "If that email exists, we sent a reset link."
    })

    const resetToken =  user.createPasswordResetToken()

    await user.save({validateBeforeSave:false});

    const resetUrl = `${config.resetPasswordUrl}/${resetToken}`;

    console.log('RESET URL: ', resetUrl);

    return res.status(200).json({
        status:'success', 
        message:'If that email exists, we sent a reset link'
    })
    
})

export const resetPassword = asyncHandler(async(req, res, next)=>{
    const {password} = req.body;
    const {token} = req.params;

    if(!token) return next(new AppError('Token is required', 400));
    if(!password) return next(new AppError('Password is required', 400));
    if(password.length < 6) return next(new AppError('Password must be minimum of 6 characters', 400));

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: {$gt: Date.now()}
    })

    if(!user) return next(new AppError('Token is invalid or expired', 400));

    user.password = password;

    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    return res.status(200).json({
        status:'success',
        message: 'Password reset succesfully. Please login again!'
    })
})

export const me = asyncHandler(async(req, res)=>{

        return res.status(200).json({
            status:'success',
            user:req.user,
        })
})