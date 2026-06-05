import { useState } from 'react'
import { MdOutlineEmail } from "react-icons/md";
import { api } from '../api/axios'

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) return;

    try {
      setLoading(true);

      await api.post("/api/auth/forgot-password", { email });

      setMessage("If that email exists, we sent a reset link.");
    } catch (err) {
      setMessage("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full">
      <form className="auth-card" onSubmit={handleSubmit}>

        <div className="flex flex-col items-center gap-1 mb-2">
          <h2 className="font-bold text-2xl gradient-text">Forgot password?</h2>
          <p className="text-sm text-gray-500 dark:text-slate-400 text-center">Enter your email and we'll send you a reset link</p>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-xs font-medium text-gray-500 dark:text-slate-400">Email address</label>
          <div className="relative">
            <MdOutlineEmail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 text-lg pointer-events-none" />
            <input onChange={(e) => setEmail(e.target.value)} id="email" type="email" placeholder="you@example.com" className="form-input" />
          </div>
        </div>

        <button type="submit" className="btn-primary w-full py-3 text-base mt-1">
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
        {message && <p className="mt-3 text-sm">{message}</p>}

        <p className="text-center text-sm text-gray-500 dark:text-slate-400">
          Remembered it?{' '}
          <a href="/login" className="text-indigo-500 dark:text-indigo-400 font-semibold hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
            Sign in
          </a>
        </p>
      </form>
    </div>
  )
}

export default ForgetPassword