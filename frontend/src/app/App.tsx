import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../app/services/ProtectedRoute';
import Login from '../app/services/Login';
import Dashboard from './Dashboard'; 

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <main>
        <Routes>
          <Route path="/login" element={<Login />} />
  
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
}