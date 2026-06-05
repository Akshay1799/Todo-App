// api/todos.js
import { api } from "./axios";

export const getTodos = async (params = {}, signal) => {
    const response = await api.get('/api/todos', { params, signal });
    return response.data;
}

export const createTodo = async (todoData) => {
    const response = await api.post('/api/todos', todoData);
    return response.data;
}

export const updateTodo = async (id, todoData) => {
    const response = await api.patch(`/api/todos/${id}`, todoData);
    return response.data;
}

export const toggleTodo = async (id) => {
    const response = await api.patch(`/api/todos/${id}/toggle`);
    return response.data;
}

export const deleteTodo = async (id) => {
    const response = await api.delete(`/api/todos/${id}`);
    return response.data;
}