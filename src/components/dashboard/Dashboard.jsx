import { useState, useEffect,useCallback } from "react";
import {motion} from "framer-motion";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";


import Stats from "./Stats";
import TaskForm from "./TaskForm";
import SearchBar from "./SearchBar";
import FilterButtons from "./FilterButtons";
import TaskList from "./TaskList";
import Toast from "./Toast";
import ProfileMenu from "../../profile/profileDropdown";


function loadTasks() {
  try {
    const saved = localStorage.getItem('studydash_tasks');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

const PRIORITY_ORDER = { High: 0, Medium: 1, Low: 2 };

function applyFilterAndSort(tasks, filter, search, sort) {
  // 1. Filter by status/priority
  let result = tasks.filter(t => {
    if (filter === 'completed') return t.completed;
    if (filter === 'pending')   return !t.completed;
    if (filter === 'high')      return t.priority === 'High';
    return true; // 'all'
  });

  // 2. Search by title or course (case-insensitive)
  if (search.trim()) {
    const q = search.toLowerCase();
    result = result.filter(
      t => t.title.toLowerCase().includes(q) || t.course.toLowerCase().includes(q)
    );
  }

  // 3. Sort — Bonus 2
  if (sort === 'priority') {
    result = [...result].sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
  } else if (sort === 'deadline') {
    result = [...result].sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
  } else if (sort === 'alpha') {
    result = [...result].sort((a, b) => a.title.localeCompare(b.title));
  }

  return result;
}


export default function Dashboard() {

const navigate = useNavigate();
const handleSignOut = async () => {
  try {
    await signOut(auth);
    navigate('/signin');
  } catch{
    navigate('/signin');
  }
};


const user = auth.currentUser;

if (!user) {
  return <div className="text-white">Loading...</div>;
}

const [profile, setProfile] = useState({photoURL: "",});
  const [tasks,       setTasks]       = useState(loadTasks);
  const [filter,      setFilter]      = useState('all');
  const [search,      setSearch]      = useState('');
  const [sort,        setSort]        = useState('none');
  const [editingTask, setEditingTask] = useState(null);
  const [darkMode,    setDarkMode]    = useState(false);
  const [toasts,      setToasts]      = useState([]);

  // Persist tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('studydash_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // ── Toast helpers ──────────────────────────────────────────────
  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // ── Task operations ────────────────────────────────────────────

  // A. Add task
  function handleAdd({ title, course, priority, deadline }) {
    const newTask = {
      id: Date.now(),
      title: title.trim(),
      course: course.trim(),
      priority,
      deadline,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [newTask, ...prev]);
    addToast('Task added!', 'success');
  }

  // C. Toggle completion
  function handleToggle(id) {
    setTasks(prev =>
      prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    );
    const task = tasks.find(t => t.id === id);
    addToast(task?.completed ? 'Marked as pending.' : 'Task completed! 🎉', 'info');
  }

  // D. Delete task
  function handleDelete(id) {
    setTasks(prev => prev.filter(t => t.id !== id));
    addToast('Task deleted.', 'error');
  }

  // E. Edit task — open form with task data
  function handleEdit(task) {
    setEditingTask(task);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // E. Save updated task
  function handleUpdate(updated) {
    setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
    setEditingTask(null);
    addToast('Task updated!', 'info');
  }

  // Derived: apply filter + search + sort to full task list
  const visibleTasks = applyFilterAndSort(tasks, filter, search, sort);

  const bg     = darkMode ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900';
  const header = darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100';







  return (
    <div className={`min-h-screen ${bg} transition-colors duration-300`}>
      {/* ── Top bar ── */}
      <header className={`sticky top-0 z-30 border-b px-4 py-3 flex items-center justify-between ${header} shadow-sm`}>
        <div>
          <h1 className="text-xl font-bold leading-tight tracking-tight">
            📖 StudyDash
          </h1>
          <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Student Productivity Dashboard
          </p>
        </div>

<ProfileMenu user={user}
 darkMode={darkMode} 
 setDarkMode={setDarkMode}
  navigate={navigate} 
  setProfile={setProfile}
navigate={navigate}


/>

      </header>

      {/* ── Main content ── */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Productivity stats */}
        <Stats tasks={tasks} darkMode={darkMode} />

        {/* Add / Edit form */}
        <TaskForm
          onAdd={handleAdd}
          editingTask={editingTask}
          onUpdate={handleUpdate}
          onCancelEdit={() => setEditingTask(null)}
          darkMode={darkMode}
        />

        {/* Search */}
        <SearchBar search={search} onSearch={setSearch} darkMode={darkMode} />

        {/* Filter + Sort */}
        <FilterButtons
          filter={filter}
          onFilter={setFilter}
          sort={sort}
          onSort={setSort}
          darkMode={darkMode}
        />

        {/* Task count line */}
        <p className={`text-xs mb-3 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
          Showing <span className="font-bold">{visibleTasks.length}</span> of {tasks.length} task{tasks.length !== 1 ? 's' : ''}
        </p>

        {/* Task list */}
        <TaskList
          tasks={visibleTasks}
          onToggle={handleToggle}
          onDelete={handleDelete}
          onEdit={handleEdit}
          darkMode={darkMode}
        />
      </main>

      {/* Toast notifications — Bonus 5 */}
      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  );

};
