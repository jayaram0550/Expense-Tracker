import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from "../config"; // ✅ import backend URL

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
            const { data } = await axios.post(
                `${API_BASE_URL}/api/auth/login`,   // ✅ updated line
                { email, password },
                config
            );
            localStorage.setItem('userInfo', JSON.stringify(data));
            setUser(data);
        } catch (error) {
            const errorMessage =
                error.response?.data?.message || error.message;
            console.error('Login failed:', errorMessage);
            throw errorMessage;
        }
    };

    const register = async (username, email, password) => {
        try {
            const config = { headers: { 'Content-Type': 'application/json' } };
            const { data } = await axios.post(
                `${API_BASE_URL}/api/auth/register`,  // ✅ updated line
                { username, email, password },
                config
            );
            localStorage.setItem('userInfo', JSON.stringify(data));
            setUser(data);
        } catch (error) {
            const errorMessage =
                error.response?.data?.message || error.message;
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
