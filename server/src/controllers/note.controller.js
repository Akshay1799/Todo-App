// todo.controller.js
import mongoose from "mongoose";
import Todo from "../models/notes.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";


export const createTodo = asyncHandler(async (req, res, next) => {
    const { title, content, priority } = req.body;

    if (!title) return next(new AppError("Title is required", 400));

    const todo = await Todo.create({
        title,
        content: content || "",
        priority: priority || "medium",
        owner: req.user._id,
    });

    return res.status(201).json({ status: "success", todo });
});


export const getMyTodos = asyncHandler(async (req, res, next) => {
    const page      = Number(req.query.page)  || 1;
    const limit     = Number(req.query.limit) || 10;
    const q         = req.query.q             || '';
    const sortBy    = req.query.sortBy        || 'createdAt';
    const order     = req.query.order === 'asc' ? 1 : -1;
    const priority  = req.query.priority;   // 'low' | 'medium' | 'high'
    const completed = req.query.completed;  // 'true' | 'false'

    const skip = (page - 1) * limit;

    const filter = { owner: req.user._id };

    if (q) {
        filter.$or = [
            { title:   { $regex: q, $options: 'i' } },
            { content: { $regex: q, $options: 'i' } },
        ];
    }
    if (priority)  filter.priority  = priority;
    if (completed !== undefined && completed !== '') {
        filter.completed = completed === 'true';
    }

    const sort  = { [sortBy]: order };
    const todos = await Todo.find(filter).sort(sort).skip(skip).limit(limit);
    const total      = await Todo.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
        status: "success",
        results: todos.length,
        page,
        limit,
        total,
        totalPages,
        todos,
    });
});


export const getTodoById = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new AppError('Invalid ID', 400));
    }

    const todo = await Todo.findOne({ _id: id, owner: req.user._id });
    if (!todo) return next(new AppError('Todo not found', 404));

    return res.status(200).json({ status: 'success', todo });
});


export const updateTodo = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new AppError('Invalid ID', 400));
    }

    const todo = await Todo.findOne({ _id: id, owner: req.user._id });
    if (!todo) return next(new AppError('Todo not found', 404));

    todo.title    = req.body.title    ?? todo.title;
    todo.content  = req.body.content  ?? todo.content;
    todo.priority = req.body.priority ?? todo.priority;

    await todo.save();

    return res.status(200).json({ status: 'success', message: 'Todo updated successfully', todo });
});


export const toggleComplete = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new AppError('Invalid ID', 400));
    }

    const todo = await Todo.findOne({ _id: id, owner: req.user._id });
    if (!todo) return next(new AppError('Todo not found', 404));

    todo.completed = !todo.completed;
    await todo.save();

    return res.status(200).json({ status: 'success', message: 'Todo updated successfully', todo });
});


export const deleteTodo = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new AppError('Invalid ID', 400));
    }

    const todo = await Todo.findOne({ _id: id, owner: req.user._id });
    if (!todo) return next(new AppError('Todo not found', 404));

    await todo.deleteOne();

    return res.status(200).json({ status: 'success', message: 'Todo deleted successfully' });
});
