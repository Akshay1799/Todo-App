import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api/axios'
import { MdOutlineEmail, MdLockOutline } from "react-icons/md";
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [isLoading, setisLoading] = useState(false)
  const [error, setError] = useState("")
  const [errors, setErrors] = useState({});
  const { setUser } = useAuth();
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);
    setErrors(validate(updated));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate(formData);
    setErrors(validationError);
    if (Object.keys(validationError).length > 0) return;
    try {
      setisLoading(true); setError('');
      const res = await api.post("/api/auth/login", formData);
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      navigate('/notes');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally { setisLoading(false); }
  }

  const validate = (v) => {
    const e = {};
    if (!v.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(v.email)) e.email = "Invalid email format";
    if (!v.password) e.password = "Password is required";
    else if (v.password.length < 6) e.password = "Password must be at least 6 characters";
    return e;
  }

  const isFormValid = formData.email && formData.password && Object.keys(validate(formData)).length === 0;

  return (
    <div className="flex flex-col justify-center items-center w-full">
      <form onSubmit={handleSubmit} className="auth-card">

        {/* Header */}
        <div className="flex flex-col items-center gap-1 mb-2">
          <h2 className="font-bold text-2xl gradient-text">Welcome back</h2>
          <p className="text-sm text-gray-500 dark:text-slate-400">Sign in to manage your todos</p>
        </div>

        {/* Global error */}
        {error && (
          <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-400/30 rounded-xl px-4 py-2.5 text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Email */}
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-xs font-medium text-gray-500 dark:text-slate-400">Email address</label>
          <div className="relative">
            <MdOutlineEmail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 text-lg pointer-events-none" />
            <input name="email" value={formData.email} onChange={handleChange} id="email" type="email"
              placeholder="you@example.com" className="form-input" />
          </div>
          {errors.email && <p className="text-red-500 dark:text-red-400 text-xs">{errors.email}</p>}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1">
          <label htmlFor="Password" className="text-xs font-medium text-gray-500 dark:text-slate-400">Password</label>
          <div className="relative">
            <MdLockOutline className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 text-lg pointer-events-none" />
            <input name="password" value={formData.password} onChange={handleChange} id="Password" type="password"
              placeholder="••••••••" className="form-input" />
          </div>
          {errors.password && <p className="text-red-500 dark:text-red-400 text-xs">{errors.password}</p>}
          <div className="text-right mt-1">
            <Link to="/forgetPassword" className="text-xs text-indigo-500 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors">
              Forgot password?
            </Link>
          </div>
        </div>

        {/* Submit */}
        <button disabled={!isFormValid || isLoading} type="submit"
          className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-base mt-1">
          {isLoading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Signing in...
            </>
          ) : 'Sign in'}
        </button>

        <p className="text-center text-sm text-gray-500 dark:text-slate-400 mt-1">
          Don't have an account?{' '}
          <Link to="/signup" className="text-indigo-500 dark:text-indigo-400 font-semibold hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  )
}

export default Login