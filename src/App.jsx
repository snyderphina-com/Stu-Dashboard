
import { useState, useEffect, useCallback } from 'react';
import { Routes, Route,Navigate } from 'react-router-dom';
import SignUp from './components/signup/signup';
import SignIn from './components/signin/signin';
import Dashboard from './components/dashboard/Dashboard';
import LandingPage from './components/landing/landingPage';
import ProtectedRoute from './protectedRoute';




export default function App() {
 
return(
      <Routes>
   <Route path="/" element={<LandingPage />} />
   <Route path="/signin" element={<SignIn />} />
   <Route path="/signup" element={<SignUp />} />
   <Route path="/dashboard" element={
    <ProtectedRoute><Dashboard /></ProtectedRoute>} />

 <Route path="*" element={<LandingPage />} /> 
      </Routes>
  
);  

}


























