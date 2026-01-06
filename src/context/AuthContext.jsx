import { useRouter } from "next/router";
import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userType, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const checkAuthStatus = async () => {
        const token = localStorage.getItem("token");
        const userType = localStorage.getItem("userType");
        const isLoggedIn = localStorage.getItem("isLoggedIn");

        if (userType && token && parseInt(isLoggedIn)) {
            setUser(userType)
            setIsLoggedIn(true)
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
        router.push("/dashboard")
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, userType, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
