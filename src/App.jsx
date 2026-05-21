// App.jsx — Root component
// Manages all state: tasks, filter, search, sort, darkMode, editing, toasts
// Handles localStorage persistence and all task operations.

import { useState, useEffect, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';
import SignIn from './components/signin/signin';
import Dashboard from './components/dashboard/Dashboard';


// ── Helpers ─────────────────────────────────────────────────────────

// ── App ──────────────────────────────────────────────────────────────

export default function App() {
 
return(
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
  
);  

}


























