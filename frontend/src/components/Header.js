import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

function Header() {
    const { user, logout } = useAuth();

    return (
        <header className="main-header">
            <nav className="navbar">
                <Link to="/" className="logo">Expense Tracker</Link>
                <ul className="nav-links">
                    {user ? (
                        <>
                            <li><Link to="/dashboard">Dashboard</Link></li>
                            <li><Link to="/add">Add Expense</Link></li>
                            <li><button onClick={logout} className="nav-button">Logout</button></li>
                        </>
                    ) : (
                        <>
                            <li><Link to="/login">Login</Link></li>
                            <li><Link to="/register">Register</Link></li>
                        </>
                    )}
                </ul>
            </nav>
        </header>
    );
}

export default Header;