import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../components/Home';
import Articles from '../components/Articles';
import FamousArticles from '../components/FamousArticles';
import Login from '../components/Login';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" replace />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/articles" element={<Articles />} />
      <Route path="/famous-articles" element={<FamousArticles />} />
      <Route path="/login" element={<Login />} />
      
      {/* Example of a protected route */}
      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <div>Admin Dashboard</div>
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;