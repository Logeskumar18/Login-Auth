import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
    const backendURL = import.meta.env.VITE_BACKEND_URL.replace(/\/$/, '');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(false);

    const getUserData = async () => {
        try {
            const cleanURL = backendURL.replace(/\/+$/, '');
            await axios.get(`${cleanURL}/api/user/data`, { withCredentials: true });


            if (data.success) {
                setUserData(data.userData);
                setIsLoggedIn(true);
            } else {
                toast.error(data.message || "Failed to fetch user data");
            }
        } catch (error) {
            
        }
    };


    // ✅ Call getUserData when app loads
    /////

    const value = {
        backendURL,
        isLoggedIn, setIsLoggedIn,
        userData, setUserData,
        getUserData   // ✅ Add this
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};
