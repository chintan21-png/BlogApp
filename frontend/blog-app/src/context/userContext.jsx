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

        if (!accessToken) {
            setLoading(false);
            return;
        }

        const fetchUser = async () => {
            try {
                const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
                setUser(response.data);
            } catch (error) {
                console.error(error);
                clearUser();
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const updateUser = (userData) => {
        if (!userData) {
            clearUser();
            return;
        }

        setUser(userData);

        if (userData?.token) {
            localStorage.setItem("token", userData.token);
        }
    };

    const clearUser = () => {
        setUser(null);
        localStorage.removeItem("token");
    };

    return (
        <UserContext.Provider value={{
            user,
            updateUser,
            clearUser,
            loading,
            openAuthForm,
            setOpenAuthForm
        }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;