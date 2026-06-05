import { useState } from 'react'
import { FaRegUser } from "react-icons/fa";
import { MdOutlineEmail, MdLockOutline } from "react-icons/md";
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api/axios';

const Signup = () => {
  const [formdata, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    const updated = { ...formdata, [name]: value };
    setFormData(updated);
    setErrors(validate(updated));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formdata.name || !formdata.email || !formdata.password) { setError("All fields are required!"); return; }
    try {
      setIsLoading(true); setError('');
      await api.post("/api/auth/signup", formdata);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally { setIsLoading(false); }
  }

  const validate = (v) => {
    const e = {};
    if (!v.name.trim()) e.name = "Name is required";
    else if (v.name.length < 2) e.name = "Name must be at least 2 characters";
    if (!v.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(v.email)) e.email = "Invalid email format";
    if (!v.password) e.password = "Password is required";
    else if (v.password.length < 8) e.password = "Password must be at least 8 characters";
    else if (!/[a-z]/.test(v.password)) e.password = "Must include a lowercase letter";
    else if (!/[A-Z]/.test(v.password)) e.password = "Must include an uppercase letter";
    else if (!/[0-9]/.test(v.password)) e.password = "Must include a number";
    else if (!/[!@#$%^&*(),.?":{}|<>]/.test(v.password)) e.password = "Must include a special character";
    if (!v.confirmPassword) e.confirmPassword = "Please confirm password";
    else if (v.confirmPassword !== v.password) e.confirmPassword = "Passwords do not match";
    return e;
  }

  const isFormValid = Object.keys(errors).length === 0 && formdata.name && formdata.email && formdata.password && formdata.confirmPassword;

  const iconCls = "absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 text-lg pointer-events-none";

  return (
    <div className="flex flex-col justify-center items-center w-full">
      <form onSubmit={handleSubmit} className="auth-card">

        {/* Header */}
        <div className="flex flex-col items-center gap-1 mb-2">
          <h2 className="font-bold text-2xl gradient-text">Create account</h2>
          <p className="text-sm text-gray-500 dark:text-slate-400">Start organizing your tasks for free</p>
        </div>

        {/* Global error */}
        {isError && (
          <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-400/30 rounded-xl px-4 py-2.5 text-red-600 dark:text-red-400 text-sm">
            {isError}
          </div>
        )}

        {/* Name */}
        <div className="flex flex-col gap-1">
          <label htmlFor="username" className="text-xs font-medium text-gray-500 dark:text-slate-400">Full name</label>
          <div className="relative">
            <FaRegUser className={iconCls} />
            <input name="name" value={formdata.name} onChange={handleChange} id="username" type="text"
              placeholder="Name" className="form-input" />
          </div>
          {errors.name && <p className="text-red-500 dark:text-red-400 text-xs">{errors.name}</p>}
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-xs font-medium text-gray-500 dark:text-slate-400">Email address</label>
          <div className="relative">
            <MdOutlineEmail className={iconCls} />
            <input name="email" value={formdata.email} onChange={handleChange} id="email" type="email"
              placeholder="you@example.com" className="form-input" />
          </div>
          {errors.email && <p className="text-red-500 dark:text-red-400 text-xs">{errors.email}</p>}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1">
          <label htmlFor="Password" className="text-xs font-medium text-gray-500 dark:text-slate-400">Password</label>
          <div className="relative">
            <MdLockOutline className={iconCls} />
            <input name="password" value={formdata.password} onChange={handleChange} id="Password" type="password"
              placeholder="••••••••" className="form-input" />
          </div>
          {errors.password && (
            <>
              <p className="text-red-500 dark:text-red-400 text-xs">{errors.password}</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {['8+ chars', 'Uppercase', 'Lowercase', 'Number', 'Special char'].map(r => (
                  <span key={r} className="text-[10px] px-2 py-0.5 rounded-md bg-violet-100 dark:bg-white/8 border border-violet-200 dark:border-white/10 text-gray-500 dark:text-slate-400">
                    {r}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-1">
          <label htmlFor="confirmPassword" className="text-xs font-medium text-gray-500 dark:text-slate-400">Confirm password</label>
          <div className="relative">
            <MdLockOutline className={iconCls} />
            <input name="confirmPassword" value={formdata.confirmPassword} onChange={handleChange} id="confirmPassword" type="password"
              placeholder="••••••••" className="form-input" />
          </div>
          {errors.confirmPassword && <p className="text-red-500 dark:text-red-400 text-xs">{errors.confirmPassword}</p>}
        </div>

        {/* Submit */}
        <button disabled={!isFormValid || isLoading} type="submit"
          className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-base mt-1">
          {isLoading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Creating account...
            </>
          ) : 'Create account'}
        </button>

        <p className="text-center text-sm text-gray-500 dark:text-slate-400 mt-1">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-500 dark:text-indigo-400 font-semibold hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  )
}

export default Signup;