import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";

import Stats from "./Stats";
import TaskForm from "./TaskForm";
import SearchBar from "./SearchBar";
import FilterButtons from "./FilterButtons";
import TaskList from "./TaskList";
import Toast from "./Toast";
import ProfileMenu from "../../profile/profileDropdown";

// ─────────────────────────────────────────────
// Load tasks from localStorage
// ─────────────────────────────────────────────
function loadTasks() {
  try {
    const saved = localStorage.getItem("studydash_tasks");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

const PRIORITY_ORDER = {
  High: 0,
  Medium: 1,
  Low: 2,
};

// ─────────────────────────────────────────────
// Filter + Sort Logic
// ─────────────────────────────────────────────
function applyFilterAndSort(tasks, filter, search, sort) {
  let result = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    if (filter === "high") return task.priority === "High";

    return true;
  });

  // Search
  if (search.trim()) {
    const q = search.toLowerCase();

    result = result.filter(
      (task) =>
        task.title.toLowerCase().includes(q) ||
        task.course.toLowerCase().includes(q)
    );
  }

  // Sorting
  if (sort === "priority") {
    result = [...result].sort(
      (a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
    );
  }

  if (sort === "deadline") {
    result = [...result].sort(
      (a, b) => new Date(a.deadline) - new Date(b.deadline)
    );
  }

  if (sort === "alpha") {
    result = [...result].sort((a, b) =>
      a.title.localeCompare(b.title)
    );
  }

  return result;
}

export default function Dashboard() {
  const navigate = useNavigate();

  // Current authenticated user
  const user = auth.currentUser;

  // ─────────────────────────────────────────────
  // States
  // ─────────────────────────────────────────────
  const [tasks, setTasks] = useState(loadTasks);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("none");
  const [editingTask, setEditingTask] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [toasts, setToasts] = useState([]);

  // ─────────────────────────────────────────────
  // Save tasks to localStorage
  // ─────────────────────────────────────────────
  useEffect(() => {
    localStorage.setItem(
      "studydash_tasks",
      JSON.stringify(tasks)
    );
  }, [tasks]);

  // ─────────────────────────────────────────────
  // Toast Helpers
  // ─────────────────────────────────────────────
  const addToast = useCallback((message, type = "success") => {
    const id = Date.now();

    setToasts((prev) => [
      ...prev,
      { id, message, type },
    ]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) =>
      prev.filter((toast) => toast.id !== id)
    );
  }, []);

  // ─────────────────────────────────────────────
  // Add Task
  // ─────────────────────────────────────────────
  function handleAdd({
    title,
    course,
    priority,
    deadline,
  }) {
    const newTask = {
      id: Date.now(),
      title: title.trim(),
      course: course.trim(),
      priority,
      deadline,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setTasks((prev) => [newTask, ...prev]);

    addToast("Task added!", "success");
  }

  // ─────────────────────────────────────────────
  // Toggle Completion
  // ─────────────────────────────────────────────
  function handleToggle(id) {
    const task = tasks.find((t) => t.id === id);

    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );

    addToast(
      task?.completed
        ? "Marked as pending."
        : "Task completed! 🎉",
      "info"
    );
  }

  // ─────────────────────────────────────────────
  // Delete Task
  // ─────────────────────────────────────────────
  function handleDelete(id) {
    setTasks((prev) =>
      prev.filter((task) => task.id !== id)
    );

    addToast("Task deleted.", "error");
  }

  // ─────────────────────────────────────────────
  // Edit Task
  // ─────────────────────────────────────────────
  function handleEdit(task) {
    setEditingTask(task);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // ─────────────────────────────────────────────
  // Update Task
  // ─────────────────────────────────────────────
  function handleUpdate(updatedTask) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === updatedTask.id
          ? updatedTask
          : task
      )
    );

    setEditingTask(null);

    addToast("Task updated!", "info");
  }

  // Filtered Tasks
  const visibleTasks = applyFilterAndSort(
    tasks,
    filter,
    search,
    sort
  );

  // Theme Classes
  const bg = darkMode
    ? "bg-slate-900 text-white"
    : "bg-slate-50 text-slate-900";

  const header = darkMode
    ? "bg-slate-900 border-slate-800"
    : "bg-white border-slate-100";

  // Prevent blank screen while auth loads
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${bg}`}
    >
      {/* Header */}
      <header
        className={`sticky top-0 z-30 border-b px-4 py-3 flex items-center justify-between shadow-sm ${header}`}
      >
        <div>
          <h1 className="text-xl font-bold tracking-tight">
            📖 StudyDashboard
          </h1>

          <p
            className={`text-xs ${
              darkMode
                ? "text-slate-400"
                : "text-slate-500"
            }`}
          >
            Student Productivity Dashboard
          </p>
        </div>

        <ProfileMenu
          user={user}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          navigate={navigate}
        />
      </header>

      {/* Main */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        <Stats
          tasks={tasks}
          darkMode={darkMode}
        />

        <TaskForm
          onAdd={handleAdd}
          editingTask={editingTask}
          onUpdate={handleUpdate}
          onCancelEdit={() =>
            setEditingTask(null)
          }
          darkMode={darkMode}
        />

        <SearchBar
          search={search}
          onSearch={setSearch}
          darkMode={darkMode}
        />

        <FilterButtons
          filter={filter}
          onFilter={setFilter}
          sort={sort}
          onSort={setSort}
          darkMode={darkMode}
        />

        <p
          className={`text-xs mb-3 ${
            darkMode
              ? "text-slate-500"
              : "text-slate-400"
          }`}
        >
          Showing{" "}
          <span className="font-bold">
            {visibleTasks.length}
          </span>{" "}
          of {tasks.length} task
          {tasks.length !== 1 ? "s" : ""}
        </p>

        <TaskList
          tasks={visibleTasks}
          onToggle={handleToggle}
          onDelete={handleDelete}
          onEdit={handleEdit}
          darkMode={darkMode}
        />
      </main>

      {/* Toasts */}
      <Toast
        toasts={toasts}
        onRemove={removeToast}
      />
    </div>
  );
}