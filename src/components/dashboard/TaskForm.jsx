// TaskForm.jsx — Form to add a new task or edit an existing one
// Bonus: Character counter on title, all fields validated

import { useState, useEffect } from 'react';

const TITLE_LIMIT = 60;

const emptyForm = { title: '', course: '', priority: 'Medium', deadline: '' };

function TaskForm({ onAdd, editingTask, onUpdate, onCancelEdit, darkMode }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  // When editingTask changes, prefill the form
  useEffect(() => {
    if (editingTask) {
      setForm({
        title:    editingTask.title,
        course:   editingTask.course,
        priority: editingTask.priority,
        deadline: editingTask.deadline,
      });
      setErrors({});
    } else {
      setForm(emptyForm);
    }
  }, [editingTask]);

  // Controlled input handler
  function handleChange(e) {
    const { name, value } = e.target;
    // Enforce character limit on title
    if (name === 'title' && value.length > TITLE_LIMIT) return;
    setForm(prev => ({ ...prev, [name]: value }));
    // Clear error for this field on change
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  }

  function validate() {
    const newErrors = {};
    if (!form.title.trim())    newErrors.title    = 'Title is required.';
    if (!form.course.trim())   newErrors.course   = 'Course is required.';
    if (!form.deadline)        newErrors.deadline = 'Deadline is required.';
    return newErrors;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    if (editingTask) {
      onUpdate({ ...editingTask, ...form });
    } else {
      onAdd(form);
    }
    setForm(emptyForm);
    setErrors({});
  }

  const base     = `w-full rounded-xl px-3.5 py-2.5 text-sm border outline-none transition-all duration-200
                    focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500`;
  const inputCls = `${base} ${darkMode
    ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400'
    : 'bg-white border-slate-200 text-slate-800 placeholder:text-slate-400'}`;
  const labelCls = `block text-xs font-semibold mb-1.5 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`;
  const errCls   = 'text-red-400 text-xs mt-1';

  return (
    <form
      onSubmit={handleSubmit}
      className={`rounded-2xl p-5 mb-6 shadow-sm border animate-fade-in
        ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}
    >
      <h2 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
        {editingTask ? '✏️ Edit Task' : '➕ New Task'}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Title + character counter */}
        <div className="md:col-span-2">
          <label className={labelCls}>Task Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Complete chapter 4 notes"
            className={`${inputCls} ${errors.title ? 'border-red-400' : ''}`}
          />
          <div className="flex justify-between items-center mt-1">
            {errors.title
              ? <span className={errCls}>{errors.title}</span>
              : <span />}
            <span className={`text-xs ${form.title.length >= TITLE_LIMIT ? 'text-red-400 font-bold' : 'text-slate-400'}`}>
              {form.title.length}/{TITLE_LIMIT}
            </span>
          </div>
        </div>

        {/* Course */}
        <div>
          <label className={labelCls}>Course Name</label>
          <input
            name="course"
            value={form.course}
            onChange={handleChange}
            placeholder="e.g. Data Structures"
            className={`${inputCls} ${errors.course ? 'border-red-400' : ''}`}
          />
          {errors.course && <p className={errCls}>{errors.course}</p>}
        </div>

        {/* Priority */}
        <div>
          <label className={labelCls}>Priority</label>
          <select name="priority" value={form.priority} onChange={handleChange} className={inputCls}>
            <option value="High">🔴 High</option>
            <option value="Medium">🟡 Medium</option>
            <option value="Low">🟢 Low</option>
          </select>
        </div>

        {/* Deadline */}
        <div>
          <label className={labelCls}>Deadline</label>
          <input
            type="date"
            name="deadline"
            value={form.deadline}
            onChange={handleChange}
            className={`${inputCls} ${errors.deadline ? 'border-red-400' : ''}`}
          />
          {errors.deadline && <p className={errCls}>{errors.deadline}</p>}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 mt-5">
        <button
          type="submit"
          className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold
                     transition-colors duration-200 shadow-sm hover:shadow-md"
        >
          {editingTask ? 'Save Changes' : 'Add Task'}
        </button>
        {editingTask && (
          <button
            type="button"
            onClick={onCancelEdit}
            className={`px-4 rounded-xl text-sm font-semibold border transition-colors duration-200
              ${darkMode
                ? 'border-slate-600 text-slate-300 hover:bg-slate-700'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default TaskForm;