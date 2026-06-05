// AppRoutes.jsx

import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import ResetPassword from '../pages/ResetPassword'
import ForgetPassword from '../pages/ForgetPassword'
import Todos from '../pages/Notes'
import MainLayout from '../components/Layout/MainLayout'
import AuthLayout from '../components/Layout/AuthLayout'
import ProtectedRoute from './ProtectedRoute'


const router = createBrowserRouter([
    {
        element: <AuthLayout />,
        children: [
            {
                path: '/',
                element: <Navigate to="/login" replace />
            },
            {
                path: '/login',
                element: <Login />
            },
            {
                path: '/signup',
                element: <Signup />
            },
            {
                path: '/forgetPassword',
                element: <ForgetPassword />
            },
        ]
    },

    {
        element: (
            <ProtectedRoute>
                <MainLayout />
            </ProtectedRoute>
        ),
        children: [
            { path: "/todos", element: <Todos /> }
        ]
    },

    {
        path: '/reset-password/:token',
        element: <ResetPassword />
    },

])

function AppRoute() {
    return (
        <RouterProvider router={router} />
    )
}

export default AppRoute;