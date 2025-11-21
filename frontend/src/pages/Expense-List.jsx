import { RefreshCcw } from "lucide-react";
import LoadingComponent from "@/components/loading";
import { Button } from "@/components/ui/button";
import { useExpenseApi } from "@/hook/useExpenseApi";
import { Link } from "react-router-dom";

export default function ExpenseList() {

    const {
        data,
        loading,
        error,
        currentPage,
        pageSize,
        totalPages,
        updatePageIndex,
        updatePageSize,
        refetch,
    } = useExpenseApi({ init: [] });

    const expenses = data;

    if (loading) {
        return (
            <LoadingComponent label="Loading expenses..." className="rounded-xl shadow-lg border border-gray-100 " />);
    }

    if (error) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    function fetchData (){
        refetch()
    }

    return (
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex flex-row justify-between items-center mb-4">
                <h2 className="text-2xl font-sans font-bold text-gray-800">
                    Recent <span className="text-indigo-600"> Expenses</span>
                </h2>
                <div className="flex justify-between items-center gap-3">
                    <div className="flex gap-3 font-sans text-base">
                        <Link to={"/protected/chart"} className={"hover:text-blue-500 hover:underline bg-blue-400/40 px-3 py-1  rounded-md"}>Chart View</Link>
                        <Link to={"/protected/table"} className={"hover:text-blue-500 hover:underline bg-blue-400/40 px-3 py-1  rounded-md"}>Data Table View</Link>
                    </div>
                    <Button onClick={fetchData} className={"bg-indigo-600"} title="Refresh Expense Data">
                        <RefreshCcw />
                    </Button>
                </div>

            </div>

            {expenses?.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                    No expenses match the current filter criteria.
                </p>
            ) : (
                <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
                    {expenses?.map((expense) => <ExpenseCard key={expense._id} {...expense} />)}
                </div>
            )}
        </div>
    );
}


export function ExpenseCard({ _id, date, title, category, amount }) {
    return <div
        key={_id}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition duration-150"
    >
        <div className="flex-1 min-w-0">
            <p
                className="font-semibold text-gray-800 truncate"
                title={title}
            >
                {title}
            </p>
            <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500">
                <span className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full font-medium">
                    {category}
                </span>
                <span>{new Date(date).toLocaleDateString()}</span>
            </div>
        </div>
        <span className="font-bold text-lg text-red-600 mt-2 sm:mt-0 sm:ml-4 flex-shrink-0">
            -${amount.toFixed(2)}
        </span>
    </div>
}