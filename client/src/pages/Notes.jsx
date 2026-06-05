// pages/Notes.jsx  (Todos page)

import { useState, useEffect, useRef } from 'react'
import { getTodos, createTodo, deleteTodo, updateTodo, toggleTodo } from '../api/notes'
import { MdDeleteOutline, MdOutlineCancel, MdOutlineCheck, MdOutlineCheckBox, MdOutlineCheckBoxOutlineBlank } from "react-icons/md";
import { RiPencilFill } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";
import { IoSearchOutline } from "react-icons/io5";
import { LuPlus, LuListTodo } from "react-icons/lu";

/* Priority config */
const PRIORITY_CONFIG = {
  high:   { label: 'High',   cls: 'bg-rose-100 dark:bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/30' },
  medium: { label: 'Medium', cls: 'bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/30' },
  low:    { label: 'Low',    cls: 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30' },
};

/* Left accent colours per card */
const CARD_ACCENTS = [
  'bg-gradient-to-b from-indigo-500 to-indigo-400',
  'bg-gradient-to-b from-purple-500 to-purple-400',
  'bg-gradient-to-b from-blue-500 to-blue-400',
  'bg-gradient-to-b from-cyan-500 to-cyan-400',
  'bg-gradient-to-b from-emerald-500 to-emerald-400',
  'bg-gradient-to-b from-amber-500 to-amber-400',
];

const FILTER_TABS = ['All', 'Active', 'Completed'];

const Todos = () => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [priority, setPriority] = useState("medium");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [debounceSearch, setDebounceSearch] = useState(search);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editPriority, setEditPriority] = useState("medium");
  const [activeFilter, setActiveFilter] = useState('All');
  const [togglingId, setTogglingId] = useState(null);

  const abortControllerRef = useRef(null);
  const editInputRef = useRef(null);

  useEffect(() => { fetchTodos(); }, [page, debounceSearch, activeFilter])

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => { setPage(1); setDebounceSearch(search); }, 400);
    return () => clearTimeout(timer);
  }, [search])

  useEffect(() => {
    if (editingId && editInputRef.current) editInputRef.current.focus();
  }, [editingId])

  const fetchTodos = async () => {
    try {
      setLoading(true);
      if (abortControllerRef.current) abortControllerRef.current.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      const params = { page, limit, q: debounceSearch };
      if (activeFilter === 'Active')    params.completed = 'false';
      if (activeFilter === 'Completed') params.completed = 'true';

      const data = await getTodos(params, controller.signal);
      setTodos(data.todos || []);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
    } catch (err) {
      if (err.name !== "CanceledError" && err.name !== "AbortError") setError("Failed to load todos");
    } finally { setLoading(false); }
  }

  const handleCreateTodo = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const data = await createTodo({ title, content, priority });
      // Only show if matches current filter
      const show = activeFilter === 'All' || activeFilter === 'Active';
      if (show) setTodos(prev => [data.todo, ...prev]);
      setTitle(""); setContent(""); setPriority("medium"); setIsFormOpen(false);
      fetchTodos();
    } catch { setError('Failed to create todo'); }
  }

  const handleDeleteTodo = async (id) => {
    const prev = todos;
    setTodos(n => n.filter(t => t._id !== id));
    try { await deleteTodo(id); fetchTodos(); }
    catch { setTodos(prev); setError('Failed to delete todo'); }
  }

  const handleToggle = async (id) => {
    if (togglingId === id) return;
    setTogglingId(id);
    const prev = todos;
    setTodos(n => n.map(t => t._id === id ? { ...t, completed: !t.completed } : t));
    try {
      await toggleTodo(id);
      // Re-fetch to respect active filter
      fetchTodos();
    } catch {
      setTodos(prev);
      setError('Failed to update todo');
    } finally { setTogglingId(null); }
  }

  const handleStartEdit = (todo) => {
    setEditingId(todo._id);
    setEditTitle(todo.title);
    setEditContent(todo.content);
    setEditPriority(todo.priority || 'medium');
  }

  const handleCancelEdit = () => {
    setEditingId(null); setEditTitle(""); setEditContent(""); setEditPriority("medium");
  }

  const handleSaveEdit = async (id) => {
    const prev = todos;
    try {
      const data = await updateTodo(id, { title: editTitle, content: editContent, priority: editPriority });
      setTodos(n => n.map(t => t._id === id ? data.todo : t));
      setEditingId(null); setEditTitle(""); setEditContent(""); setEditPriority("medium");
    } catch {
      setTodos(prev);
      setError("Failed to update todo");
    }
  }

  /* Counts for filter tabs */
  const completedCount = todos.filter(t => t.completed).length;
  const activeCount    = todos.filter(t => !t.completed).length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-11 h-11 rounded-full border-4 border-violet-200 dark:border-slate-700 border-t-indigo-500 animate-spin" />
        <p className="text-gray-400 dark:text-slate-500 text-sm">Loading your todos...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 pb-20 flex flex-col
                    min-h-[calc(100vh-64px)] bg-violet-50 dark:bg-slate-950
                    transition-colors duration-300">

      {/* Error */}
      {error && (
        <div className="mb-5 px-4 py-2.5 rounded-xl text-sm
                        bg-red-50 dark:bg-red-500/10
                        border border-red-200 dark:border-red-400/30
                        text-red-600 dark:text-red-400
                        flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError('')} className="text-red-400 hover:text-red-600 ml-4 cursor-pointer">✕</button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-indigo-900 dark:text-slate-100 transition-colors">
            My Todos
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">
            {total === 0 ? 'No todos yet' : `${total} todo${total !== 1 ? 's' : ''} total`}
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 text-lg pointer-events-none" />
          <input
            type="text" value={search} placeholder="Search todos..."
            onChange={e => { setPage(1); setSearch(e.target.value); }}
            className="bg-white dark:bg-white/[0.07]
                       border border-violet-200 dark:border-white/10 rounded-xl
                       pl-9 pr-4 py-2.5 text-sm w-full sm:w-56
                       text-indigo-950 dark:text-slate-100
                       placeholder:text-gray-400 dark:placeholder:text-slate-500
                       outline-none focus:border-indigo-400 dark:focus:border-indigo-500
                       focus:ring-2 focus:ring-indigo-200/40 dark:focus:ring-indigo-500/15
                       shadow-sm dark:shadow-none transition-all duration-300"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 mb-5 p-1 bg-white dark:bg-white/[0.05] border border-violet-100 dark:border-white/8 rounded-xl w-fit">
        {FILTER_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => { setActiveFilter(tab); setPage(1); }}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer
              ${activeFilter === tab
                ? 'bg-linear-to-r from-fuchsia-500 to-rose-500 text-white shadow-sm'
                : 'text-gray-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-slate-200'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Add Todo Button / Form */}
      <div className="w-full mb-6">
        {isFormOpen ? (
          <div className="animate-slide-up">
            <form onSubmit={handleCreateTodo}
              className="bg-white dark:bg-white/5 dark:backdrop-blur-xl
                         border border-violet-100 dark:border-white/10
                         rounded-2xl p-5 flex flex-col gap-3
                         shadow-xl shadow-indigo-100/50 dark:shadow-black/30">

              {/* Title */}
              <input
                value={title} onChange={e => setTitle(e.target.value)}
                type="text" placeholder="What needs to be done?"
                autoFocus
                className="w-full bg-violet-50 dark:bg-white/[0.07]
                           border border-violet-100 dark:border-white/10 rounded-xl
                           px-4 py-3 text-indigo-950 dark:text-slate-100 font-semibold text-base
                           placeholder:text-gray-400 dark:placeholder:text-slate-500
                           outline-none focus:border-indigo-400 dark:focus:border-indigo-500
                           focus:ring-2 focus:ring-indigo-200/40 dark:focus:ring-indigo-500/15
                           transition-all duration-300"
              />

              {/* Description */}
              <textarea
                placeholder="Add a description (optional)..."
                value={content} onChange={e => setContent(e.target.value)}
                rows={3}
                className="w-full bg-violet-50 dark:bg-white/[0.07]
                           border border-violet-100 dark:border-white/10 rounded-xl
                           px-4 py-3 text-indigo-950 dark:text-slate-100 text-sm
                           placeholder:text-gray-400 dark:placeholder:text-slate-500
                           outline-none focus:border-indigo-400 dark:focus:border-indigo-500
                           focus:ring-2 focus:ring-indigo-200/40 dark:focus:ring-indigo-500/15
                           resize-y min-h-20 max-h-48 transition-all duration-300"
              />

              {/* Priority + Actions row */}
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-500 dark:text-slate-400">Priority:</span>
                  <div className="flex gap-1">
                    {['low', 'medium', 'high'].map(p => (
                      <button
                        key={p} type="button"
                        onClick={() => setPriority(p)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold border capitalize
                                    transition-all duration-200 cursor-pointer
                                    ${priority === p
                                      ? PRIORITY_CONFIG[p].cls + ' ring-2 ring-offset-1 ring-current'
                                      : 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-500 dark:text-slate-400 hover:border-gray-300'
                                    }`}
                      >{p}</button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => { setIsFormOpen(false); setTitle(''); setContent(''); setPriority('medium'); }}
                    className="btn-ghost px-4 py-2 text-sm">
                    <MdOutlineCancel size={16} /> Cancel
                  </button>
                  <button type="submit"
                    className="btn-primary flex items-center gap-1.5 px-5 py-2 text-sm rounded-xl">
                    <LuPlus size={16} /> Add Todo
                  </button>
                </div>
              </div>
            </form>
          </div>
        ) : (
          <button
            onClick={() => setIsFormOpen(true)}
            className="btn-primary flex items-center gap-2 px-5 py-2.5 text-sm rounded-xl">
            <LuPlus size={18} /> New Todo
          </button>
        )}
      </div>

      {/* Empty State */}
      {todos.length === 0 && (
        <div className="flex flex-col items-center justify-center min-h-[35vh] gap-4">
          <div className="w-20 h-20 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-4xl border border-indigo-100 dark:border-indigo-500/20">
            <LuListTodo className="text-indigo-300 dark:text-indigo-500" />
          </div>
          <p className="text-xl font-bold text-indigo-900 dark:text-slate-100">
            {activeFilter === 'Completed' ? 'No completed todos' :
             activeFilter === 'Active'    ? 'No active todos' :
             'No todos yet'}
          </p>
          <p className="text-sm text-gray-400 dark:text-slate-500">
            {activeFilter === 'All' ? 'Click "New Todo" to get started' : `Switch to "All" to see all todos`}
          </p>
        </div>
      )}

      {/* Todo List */}
      {todos.length > 0 && (
        <ul className="flex flex-col gap-3 w-full p-0 list-none">
          {todos.map((todo, index) => (
            <li
              key={todo._id}
              className={`todo-card w-full animate-card-in
                          ${editingId === todo._id ? '' : 'todo-card-hoverable'}
                          ${todo.completed ? 'opacity-65' : ''}`}
            >
              {/* Left accent bar */}
              <div className={`w-1 self-stretch shrink-0 rounded-l-2xl ${CARD_ACCENTS[index % CARD_ACCENTS.length]}`} />

              {editingId === todo._id ? (
                /* Edit Mode */
                <div className="flex flex-col gap-2 p-4 flex-1">
                  <div className="flex justify-end gap-1.5">
                    <button onClick={() => handleSaveEdit(todo._id)} title="Save"
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium
                                 bg-emerald-50 dark:bg-emerald-500/15
                                 border border-emerald-200 dark:border-emerald-500/30
                                 text-emerald-700 dark:text-emerald-400
                                 hover:bg-emerald-100 dark:hover:bg-emerald-500/25
                                 transition-all duration-200 cursor-pointer">
                      <MdOutlineCheck /> Save
                    </button>
                    <button onClick={handleCancelEdit} title="Cancel"
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium
                                 bg-red-50 dark:bg-red-500/15
                                 border border-red-200 dark:border-red-500/30
                                 text-red-600 dark:text-red-400
                                 hover:bg-red-100 dark:hover:bg-red-500/25
                                 transition-all duration-200 cursor-pointer">
                      <RxCross2 /> Cancel
                    </button>
                  </div>
                  <input
                    ref={editInputRef}
                    value={editTitle}
                    onChange={e => setEditTitle(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === "Enter") { e.preventDefault(); handleSaveEdit(todo._id); }
                      if (e.key === "Escape") handleCancelEdit();
                    }}
                    className="w-full bg-indigo-50 dark:bg-white/[0.07]
                               border border-indigo-200 dark:border-white/15 rounded-lg
                               px-3 py-2 text-indigo-950 dark:text-slate-100
                               text-sm font-semibold outline-none
                               focus:border-indigo-400 dark:focus:border-indigo-500
                               transition-all duration-200"
                  />
                  <textarea
                    value={editContent}
                    onChange={e => setEditContent(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === "Escape") handleCancelEdit();
                    }}
                    rows={2}
                    className="flex-1 min-h-16 bg-indigo-50 dark:bg-white/[0.07]
                               border border-indigo-200 dark:border-white/15 rounded-lg
                               px-3 py-2 text-indigo-950 dark:text-slate-100
                               text-xs outline-none resize-none
                               focus:border-indigo-400 dark:focus:border-indigo-500
                               transition-all duration-200"
                  />
                  {/* Priority selector in edit mode */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-gray-500 dark:text-slate-400 font-medium">Priority:</span>
                    {['low', 'medium', 'high'].map(p => (
                      <button key={p} type="button"
                        onClick={() => setEditPriority(p)}
                        className={`px-2.5 py-0.5 rounded-md text-xs font-semibold border capitalize transition-all cursor-pointer
                          ${editPriority === p
                            ? PRIORITY_CONFIG[p].cls
                            : 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-500 dark:text-slate-400'
                          }`}
                      >{p}</button>
                    ))}
                  </div>
                </div>
              ) : (
                /* View Mode */
                <div className="flex items-start gap-3 p-4 flex-1 min-w-0">
                  {/* Checkbox */}
                  <button
                    onClick={() => handleToggle(todo._id)}
                    disabled={togglingId === todo._id}
                    title={todo.completed ? 'Mark as active' : 'Mark as complete'}
                    className={`mt-0.5 shrink-0 text-2xl transition-all duration-200 cursor-pointer
                                ${todo.completed
                                  ? 'text-emerald-500 dark:text-emerald-400'
                                  : 'text-gray-300 dark:text-slate-600 hover:text-indigo-400 dark:hover:text-indigo-400'
                                }
                                ${togglingId === todo._id ? 'animate-pulse' : ''}`}
                  >
                    {todo.completed
                      ? <MdOutlineCheckBox />
                      : <MdOutlineCheckBoxOutlineBlank />
                    }
                  </button>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <p className={`text-sm font-bold text-indigo-900 dark:text-slate-100 transition-colors
                                     ${todo.completed ? 'line-through text-gray-400 dark:text-slate-500' : ''}`}>
                        {todo.title}
                      </p>
                      {/* Priority badge */}
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border capitalize ${PRIORITY_CONFIG[todo.priority]?.cls || PRIORITY_CONFIG.medium.cls}`}>
                        {PRIORITY_CONFIG[todo.priority]?.label || 'Medium'}
                      </span>
                    </div>
                    {todo.content && (
                      <p className={`text-xs leading-relaxed
                                     ${todo.completed
                                       ? 'text-gray-300 dark:text-slate-600 line-through'
                                       : 'text-gray-500 dark:text-slate-400'}`}>
                        {todo.content}
                      </p>
                    )}
                    <p className="text-[10px] text-gray-300 dark:text-slate-600 mt-1">
                      {new Date(todo.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => handleStartEdit(todo)} title="Edit"
                      className="p-1.5 rounded-lg text-lg flex items-center
                                 text-gray-300 dark:text-slate-600
                                 hover:text-indigo-500 dark:hover:text-indigo-400
                                 hover:bg-indigo-50 dark:hover:bg-indigo-500/15
                                 transition-all duration-200 cursor-pointer">
                      <RiPencilFill />
                    </button>
                    <button onClick={() => handleDeleteTodo(todo._id)} title="Delete"
                      className="p-1.5 rounded-lg text-xl flex items-center
                                 text-gray-300 dark:text-slate-600
                                 hover:text-red-500 dark:hover:text-red-400
                                 hover:bg-red-50 dark:hover:bg-red-500/10
                                 transition-all duration-200 cursor-pointer">
                      <MdDeleteOutline />
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex gap-3 mt-10 items-center justify-center">
          <button
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="px-5 py-2 rounded-xl text-sm font-semibold
                       bg-white dark:bg-white/6
                       border border-violet-200 dark:border-white/10
                       text-indigo-800 dark:text-slate-300
                       hover:bg-indigo-50 dark:hover:bg-indigo-500/20
                       hover:border-indigo-300 dark:hover:border-indigo-400
                       disabled:opacity-40 disabled:cursor-not-allowed
                       disabled:hover:bg-white dark:disabled:hover:bg-white/6
                       transition-all duration-200 cursor-pointer"
          >← Prev</button>

          <span className="px-4 py-2 text-sm rounded-lg
                           bg-indigo-50 dark:bg-indigo-500/15
                           border border-indigo-100 dark:border-indigo-500/25
                           text-indigo-700 dark:text-slate-300">
            {page} / {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
            className="px-5 py-2 rounded-xl text-sm font-semibold
                       bg-white dark:bg-white/6
                       border border-violet-200 dark:border-white/10
                       text-indigo-800 dark:text-slate-300
                       hover:bg-indigo-50 dark:hover:bg-indigo-500/20
                       hover:border-indigo-300 dark:hover:border-indigo-400
                       disabled:opacity-40 disabled:cursor-not-allowed
                       disabled:hover:bg-white dark:disabled:hover:bg-white/6
                       transition-all duration-200 cursor-pointer"
          >Next →</button>
        </div>
      )}
    </div>
  )
}

export default Todos