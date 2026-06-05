import dotenv from 'dotenv';
dotenv.config();

export const config = {
    port:process.env.PORT || 5000,
    env:process.env.NODE_ENV,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
    mongoUri: process.env.MONGO_URI,
    clientUrl: process.env.CLIENT_URL,
    resetPasswordUrl: process.env.RESET_PASSWORD_URL
}