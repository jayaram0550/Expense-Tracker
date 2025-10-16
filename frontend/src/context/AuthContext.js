import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
axios.defaults.baseURL = 'https://expense-tracker-backend-0c5j.onrender.com';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            setUser(JSON.parse(userInfo));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const config = { headers: { 'Content-Type': 'application/json' } };
            const { data } = await axios.post('/api/auth/login', { email, password }, config);
            localStorage.setItem('userInfo', JSON.stringify(data));
            setUser(data);
        } catch (error) {
            // Check if error.response exists before accessing data
            const errorMessage = error.response && error.response.data && error.response.data.message
                                 ? error.response.data.message
                                 : error.message;
            console.error('Login failed:', errorMessage);
            throw errorMessage; // Re-throw to be caught by component
        }
    };

    const register = async (username, email, password) => {
        try {
            const config = { headers: { 'Content-Type': 'application/json' } };
            const { data } = await axios.post('/api/auth/register', { username, email, password }, config);
            localStorage.setItem('userInfo', JSON.stringify(data));
            setUser(data);
        } catch (error) {
            const errorMessage = error.response && error.response.data && error.response.data.message
                                 ? error.response.data.message
                                 : error.message;
            console.error('Registration failed:', errorMessage);
            throw errorMessage;
        }
    };

    const logout = () => {
        localStorage.removeItem('userInfo');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);