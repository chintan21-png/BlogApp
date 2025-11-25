import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosinstance';
import { API_PATHS } from '../utils/apiPaths';

export const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [openAuthForm, setOpenAuthForm] = useState(false);

    useEffect(() => {
        const accessToken = localStorage.getItem("token");
        
        // If no token exists, skip fetching user
        if (!accessToken) {
            setLoading(false);
            return;
        }

        // If user already exists, skip fetching
        if (user) {
            setLoading(false);
            return;
        }

        const fetchUser = async () => {
            try {
                const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
                setUser(response.data);
            } catch (error) {
                console.error("User not authenticated", error);
                clearUser();
            } finally {
                setLoading(false);
            }
        };
        
        fetchUser();
    }, []);

    const updateUser = (userData) => {
        setUser(userData);
        localStorage.setItem("token", userData.token);
    };

    const clearUser = () => {
        setUser(null);
        localStorage.removeItem("token");
    };

    return (
        <UserContext.Provider value={{ 
            user, 
            setUser,
            loading, 
            updateUser, 
            clearUser, 
            openAuthForm, 
            setOpenAuthForm 
        }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;