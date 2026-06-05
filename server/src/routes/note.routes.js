// todo.routes.js
import express from 'express';
import { protect } from '../middlewares/auth.midleware.js';
import {
    createTodo,
    deleteTodo,
    getMyTodos,
    getTodoById,
    updateTodo,
    toggleComplete,
} from '../controllers/note.controller.js';

const router = express.Router();

router.use(protect);

router.post('/',  createTodo);
router.get('/',   getMyTodos);

router.route('/:id')
    .get(getTodoById)
    .patch(updateTodo)
    .delete(deleteTodo);

router.patch('/:id/toggle', toggleComplete);

export default router;