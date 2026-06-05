import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'
import { config } from './config/index.js';
import authRoutes from './routes/auth.routes.js'
import todoRoutes from './routes/note.routes.js'
import { errorHandler, notFound } from './middlewares/error.middleware.js';

export const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
    cors({
        origin: config.clientUrl,
        credentials: true
    })
)

app.get('/', (req, res) => {
    res.status(200).json({ status: "success", message: "API is running successfully!" });
});

app.use('/api/auth',  authRoutes)
app.use('/api/todos', todoRoutes)
// Alias for backward compatibility
app.use('/api/notes', todoRoutes)

app.use(notFound);
app.use(errorHandler)