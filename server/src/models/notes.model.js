// notes.model.js (used as todos)
import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
    title:     { type: String, trim: true, required: true },
    content:   { type: String, default: '' },
    completed: { type: Boolean, default: false },
    priority:  { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    owner:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const Todo = mongoose.model('Todo', todoSchema);

export default Todo;