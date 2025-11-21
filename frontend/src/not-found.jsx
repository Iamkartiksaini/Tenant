import { Link } from "react-router-dom";

export default function NotFound({ title, message, rootClass = "h-[40vh]", children }) {
    return (
        <div className={`flex flex-col gap-7 justify-center items-center p-5 ${rootClass}`}>
            <div className="flex justify-center items-center gap-4.5">
                <div className="h-[80px] flex justify-center items-center w-[80px] rounded-full  bg-blue-400">
                    <div className="w-[30px] h-[30px] bg-gray-700 rounded-full animate-[movePupil_2s_infinite_ease-in-out] transform origin-center"></div>
                </div>
                <div className="h-[80px] flex justify-center items-center w-[80px]  rounded-full  bg-blue-400">
                    <div className="w-[30px] h-[30px] bg-gray-700 rounded-full animate-[movePupil_2s_infinite_ease-in-out] transform origin-center">
                    </div>
                </div>
            </div>
            <div className="text-center">
                <h1 className="font-bold text-4xl mb-2">
                    {title || "Looks like you're lost"}</h1>
                <p className="text-xl font-semibold mt-2.5 mb-4 text-red-500">{message || "404 error"}</p>
            </div>
            {children || <Link to={"/"} className="text-center font-medium  no-underline rounded-4xl transition-colors w-[200px] px-5 py-2.5 bg-black text-white  hover:bg-blue-300 hover:text-black">
                Go to Home<span className="ml-2"> →</span>
            </Link>}
        </div>
    );
}