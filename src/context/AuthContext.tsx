'use client'

import { useRouter } from "next/navigation";
import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userType, setUserType] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSuperadmin, setIsSuperadmin] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)
    const [isUser, setIsUser] = useState(false)
    const [role, setRole] = useState('')
    const router = useRouter();

    const checkAuthStatus = async () => {
        const token = localStorage.getItem("token");
        const userType = localStorage.getItem("userType");
        const isLoggedIn = localStorage.getItem("isLoggedIn");

        if (userType && token && parseInt(isLoggedIn)) {
            setUserType(userType)
            setIsLoggedIn(true)
            setUserValues(userType)
        }
        else {
            logout()
        }
        setLoading(false);
    };

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userType");
        localStorage.setItem("isLoggedIn", "0")
        router.push("/login")
    };

    const setUserValues = (userType) => {
        setIsSuperadmin(userType === 'superAdmin')
        setIsAdmin(userType === 'admin')
        setIsUser(userType === 'user')
    }

    useEffect(()=>{
        setRole(isSuperadmin ? 'superAdmin' : isAdmin ? 'admin' : 'user')
    }, [isSuperadmin, isAdmin, isUser])

    return (
        <AuthContext.Provider value={{ isLoggedIn, setUserValues, userType, logout, loading, isSuperadmin, isAdmin, isUser, role }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};