import { useUserContext } from "@/store/UserContext"
import { Button } from "./ui/button";
import { Link, NavLink, useLocation } from "react-router-dom";
import { LogIn, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Header() {
    const { user, isAuthLoading, sign_out_handler } = useUserContext();
    const userData = isAuthLoading == false && user?.email ? user : null;
    const { pathname } = useLocation();

    const loginButtonState = !pathname.includes("auth/login") && userData == null

    function isActiveLink({ isActive }) {
        return cn("hover:text-blue-500 hover:underline px-3 rounded-sm", isActive && "text-blue-500 bg-blue-200/60")
    }


    const FirstChar = userData?.name?.at(0) || userData?.email?.at(0)

    return (
        <header className="max-w-7xl mx-auto p-4 flex justify-between items-center">
            <h2 className="text-2xl font-extrabold text-indigo-500">
                Expense Tracker
            </h2>

            <div className="flex-1 flex justify-end max-w-2xl">
                {loginButtonState && <Link className="px-3 w-fit flex justify-between items-center  py-1 bg-gray-900 active:scale-[.96] hover:opacity-80 active:opacity-80 text-white rounded-md " to="/auth/login">
                    Login
                </Link>}
                {userData &&
                    <div className="flex justify-end sm:justify-between items-center gap-2">
                        <div className="hidden sm:flex gap-3 font-sans text-base">
                            <NavLink to={"/protected/chart"} className={isActiveLink}>Chart View</NavLink>
                            <NavLink to={"/protected/table"} className={isActiveLink}>Data Table View</NavLink>
                        </div>

                        <div className="flex justify-between items-center gap-2">
                            <button title={userData?.name || userData?.email + " account"} className="h-10 w-10 rounded-full bg-orange-600 font-bold text-white flex justify-center items-center ">{FirstChar}</button>
                            <Button title="Logout" className={"w-fit"} onClick={sign_out_handler}>
                                Logout <LogOut />
                            </Button>
                        </div>
                    </div>
                }
            </div>

        </header >
    )
}
