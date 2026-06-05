import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { LuSun, LuListTodo } from "react-icons/lu";
import { AiOutlineMoon } from "react-icons/ai";

const Navbar = () => {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const isDark = theme === 'dark';

  return (
    <nav className="flex justify-between items-center h-16 px-4 sm:px-6 md:px-8
                    bg-white/90 dark:bg-slate-950/85
                    backdrop-blur-xl
                    border-b border-violet-100 dark:border-white/8
                    shadow-sm shadow-indigo-50 dark:shadow-none
                    sticky top-0 z-50
                    transition-all duration-300">

      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-linear-to-br from-fuchsia-500 to-rose-500
                        flex items-center justify-center text-lg text-white
                        shadow-lg shadow-indigo-400/30 shrink-0">
          <LuListTodo />
        </div>
        <h1 className="text-base sm:text-xl font-extrabold tracking-tight
                       bg-linear-to-r from-fuchsia-600 to-rose-500
                       dark:from-fuchsia-400 dark:to-rose-400
                       bg-clip-text text-transparent">
          TodoApp
        </h1>
      </div>

      <div className="flex items-center gap-2">

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg
                     bg-violet-50 dark:bg-white/[0.07]
                     border border-violet-200 dark:border-white/12
                     text-indigo-500 dark:text-slate-300
                     hover:bg-violet-100 dark:hover:bg-white/13
                     hover:scale-105 active:scale-95
                     transition-all duration-200 cursor-pointer"
        >
          {isDark ? <LuSun /> : <AiOutlineMoon />}
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold
                     bg-red-50 dark:bg-red-500/8
                     border border-red-200 dark:border-red-400/[0.28]
                     text-red-600 dark:text-red-400
                     hover:bg-red-100 dark:hover:bg-red-500/15
                     hover:-translate-y-px hover:shadow-md hover:shadow-red-200/50 dark:hover:shadow-red-500/10
                     active:translate-y-0
                     transition-all duration-200 cursor-pointer"
        >
          <span>⎋</span><span className="hidden sm:inline"> Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;