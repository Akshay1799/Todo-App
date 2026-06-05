import {useState, } from 'react'
import { MdLockOutline } from "react-icons/md";
import { api } from '../api/axios';
import {useParams, useNavigate} from 'react-router-dom'

const ResetPassword = () => {

  const { token } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    const updatedForm = {
      ...formData,
      [name]: value,
    };

    setFormData(updatedForm);
    setErrors(validate(updatedForm));
  };

  const validate = (values) => {
    const newErrors = {};

    if (!values.password) {
      newErrors.password = "Password is required";
    } else if (values.password.length < 8) {
      newErrors.password = "At least 8 characters required";
    } else if (!/[a-z]/.test(values.password)) {
      newErrors.password = "Must include lowercase letter";
    } else if (!/[A-Z]/.test(values.password)) {
      newErrors.password = "Must include uppercase letter";
    } else if (!/[0-9]/.test(values.password)) {
      newErrors.password = "Must include a number";
    } else if (!/[!@#$%^&*]/.test(values.password)) {
      newErrors.password = "Must include special character";
    }

    if (!values.confirmPassword) {
      newErrors.confirmPassword = "Please confirm password";
    } else if (values.confirmPassword !== values.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  const isFormValid =
    Object.keys(errors).length === 0 &&
    formData.password &&
    formData.confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting reset...");
    const validationErrors = validate(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    try {
      setLoading(true);

      await api.patch(`/api/auth/reset-password/${token}`, {
        password: formData.password,
      });

      setMessage("Password reset successful. Redirecting...");

      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMessage(err.response?.data.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="auth-bg min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-slide-up">
        <form onSubmit={handleSubmit} className="auth-card">

          <div className="flex flex-col items-center gap-1 mb-2">
            <h2 className="font-bold text-2xl gradient-text">Reset password</h2>
            <p className="text-sm text-gray-500 dark:text-slate-400 text-center">Choose a strong new password</p>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="newPassword" className="text-xs font-medium text-gray-500 dark:text-slate-400">New password</label>
            <div className="relative">
              <MdLockOutline className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 text-lg pointer-events-none" />
              <input name="password" value={formData.password} onChange={handleChange}  id="newPassword" type="password" placeholder="New password" className="form-input" />
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="confirmNewPassword" className="text-xs font-medium text-gray-500 dark:text-slate-400">Confirm new password</label>
            <div className="relative">
              <MdLockOutline className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 text-lg pointer-events-none" />
              <input name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} id="confirmNewPassword" type="password" placeholder="New password" className="form-input" />
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button disabled={!isFormValid || loading} type="submit" className="btn-primary w-full py-3 text-base mt-1">
            {loading ? "Updating..." : "Reset Password"}
          </button>

          {message && <p className="mt-3 text-sm text-center">{message}</p>}

        </form>
      </div>
    </div>
  )
}

export default ResetPassword