import React, { useState, useEffect, use, createContext, useRef } from "react";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";
import { addCookeyKey, cookiesKey, getCookies, getStoreToken, removeCookeyKey, setStoreToken } from "@/lib/constants";
import { refreshApi } from "@/api/service";
import { toast } from "react-toastify";

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

    const [user, setUser] = useState(null);
    const [isAuthLoading, setIsAuthLoading] = useState(true);
    const isMount = useRef(false);

    useEffect(() => {
        fetchNewAccessToken()
    }, [isAuthLoading]);


    async function fetchNewAccessToken() {
        if (isMount.current == true) return
        isMount.current = true
        try {
            const token = getCookies();
            const ele = token ? jwtDecode(token) : false;
            if (token && ele) {
                const res = await refreshApi(token);
                const accessToken = res?.data?.accessToken
                if (accessToken) {
                    const userData = token ? decodingToken(accessToken) : null;
                    if (userData) {
                        setUser(userData);
                        setStoreToken({ token: accessToken })
                    }
                }
                else {
                    sign_out_handler()
                }
            }
        } catch (error) {
            toast.error(error.message, "Auth revoked, Re-Login.")
            sign_out_handler()
        }
        finally {
            setIsAuthLoading(false)
        }
    }


    const signInHandler = ({ token, refreshToken, }) => {
        const validateToken = refreshToken ? decodingToken(refreshToken) : null;
        const userData = token ? decodingToken(token) : null;

        if (userData || validateToken) {
            setUser(userData);
            addCookeyKey({ refToken: refreshToken, accTkn: token });
        }
    };

    const sign_out_handler = () => {
        setUser(null);
        removeCookeyKey();
    };

    const data = { user, isAuthLoading, signInHandler, sign_out_handler }
    return (
        <UserContext.Provider value={data}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => use(UserContext)