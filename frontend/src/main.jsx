import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';

const TempDashboard = () => (
    <div className="p-10 text-center">
        <h1 className="text-2xl font-bold text-blue-900">Dashboard Clínico</h1>
        <p className="text-slate-600">Login realizado com sucesso! O token JWT está salvo.</p>
    </div>
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<TempDashboard />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);