import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    const login = async (email, password) => {
        try {
            const res = await axios.post('http://localhost:8000/api/users/login', { email, password });
            setUser(res.data);
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.detail || 'Login failed' };
        }
    };

    const register = async (username, email, password) => {
        try {
            const res = await axios.post('http://localhost:8000/api/users/', { username, email, password });
            setUser(res.data); // auto-login after register
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.detail || 'Registration failed' };
        }
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
