import { createContext, useContext, useEffect, useState } from "react";
import { loginUser, createUser } from "../api/api";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false)
    },[]);

    const register = async (userData) => {
        const res = await createUser(userData);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        localStorage.setItem("token", res.data.token);
        setUser(res.data.user);
        return res.data
    }

    const login = async (userData) => {
        const res = await loginUser(userData);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        localStorage.setItem("token", res.data.token);
        setUser(res.data.user);
        return res.data
    }

    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                isAuthenticated: !!user,
                login,
                logout,
                register,
            }}>
                {!loading && children}
        </AuthContext.Provider>
    )
}