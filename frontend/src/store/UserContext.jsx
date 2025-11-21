import React, { useState, useEffect, use, createContext } from "react";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";
import { cookiesKey } from "@/lib/constants";

export const UserContext = createContext({
    user: null
});

export function decodingToken(token = "") {
    if (!token) throw new Error("Token missing");

    try {
        const decoded = jwtDecode(token);

        if (!decoded?.user?.email) throw new Error("User details invalid");
        if (typeof decoded.exp !== "number") throw new Error("Token expiration (exp) claim missing");
        if (decoded.exp <= Math.floor(Date.now() / 1000)) throw new Error("Token expired");

        return decoded.user;
    } catch (err) {
        return null
        // console.error("JWT decoding/validation error:", err.message);
        // if (
        //     ["Token missing", "User details invalid", "Token expiration (exp) claim missing", "Token expired"].includes(err.message)
        // ) throw err;
        // throw new Error("Invalid token");

    }
}


export const UserProvider = ({ children }) => {
    const cookies = new Cookies();
    const token = cookies.get(cookiesKey);
    const [user, setUser] = useState(null);
    const [isAuthLoading, setIsAuthLoading] = useState(true);

    useEffect(() => {
        const userData = token ? decodingToken(token) : null;
        if (userData) { setUser(userData); }
        if (isAuthLoading == false && user?.email == undefined) { cookies.remove(cookiesKey, { path: "/" }); }
        if (isAuthLoading == true) { setIsAuthLoading(false) }
    }, [isAuthLoading]);

    const signInHandler = (token) => {
        const userData = token ? decodingToken(token) : null;
        if (userData) {
            setUser(userData);
            cookies.set(cookiesKey, token, { path: "/" });
        }
    };

    const sign_out_handler = () => {
        setUser(null);
        cookies.remove(cookiesKey, { path: "/" });
    };

    const data = { user, isAuthLoading, signInHandler, sign_out_handler }
    return (
        <UserContext.Provider value={data}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => use(UserContext)