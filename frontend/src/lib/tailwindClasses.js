import { cn } from "./utils"

export const tailwindBtnClasses = (cls) => cn("bg-black text-white w-fit font-medium py-2 px-4 text-sm rounded-md flex justify-center items-center gap-2 transition-opacity", " hover:opacity-80",
    "disabled:text-neutral-500 disabled:hover:text-neutral-500", cls)