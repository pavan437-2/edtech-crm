import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import InquiryForm from './pages/InquiryForm';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import './App.css';

function Protected({ children }) {
  return localStorage.getItem('token') ? children : <Navigate to="/admin/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InquiryForm />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<Protected><Dashboard /></Protected>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

