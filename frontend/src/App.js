import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AddExpense from './pages/AddExpense';
import EditExpense from './pages/EditExpense';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

// Private Route Component to protect routes
const PrivateRoute = ({ children }) => {
    const { user } = useAuth();
    return user ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <Header />
                <main className="container">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route
                            path="/dashboard"
                            element={
                                <PrivateRoute>
                                    <Dashboard />
                                </PrivateRoute>
                            }
                        />
                         <Route
                            path="/add"
                            element={
                                <PrivateRoute>
                                    <AddExpense />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/edit/:id"
                            element={
                                <PrivateRoute>
                                    <EditExpense />
                                </PrivateRoute>
                            }
                        />
                         {/* Fallback for undefined routes */}
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </main>
            </AuthProvider>
        </Router>
    );
}

export default App;