import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Home() {
    const { user } = useAuth();

    return (
        <div className="home-container">
            <h1>Welcome to Expense Tracker</h1>
            <p>Your simple solution for managing personal finances.</p>
            <div className="home-links">
                {user ? (
                    <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
                ) : (
                    <>
                        <Link to="/login" className="btn btn-primary">Login</Link>
                        <Link to="/register" className="btn btn-secondary">Register</Link>
                    </>
                )}
            </div>
        </div>
    );
}

export default Home;