import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';

export const generateToken = (userId)=>{
    return jwt.sign({id:userId}, config.jwtSecret, {expiresIn:config.jwtExpiresIn || '1d'});
}