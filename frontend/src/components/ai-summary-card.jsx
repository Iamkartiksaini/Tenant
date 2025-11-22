import { getSummary } from "@/api/service";
import { BotMessageSquare, Calendar, Loader2, RefreshCw } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
};

const today = new Date();
const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

const initialStartDate = formatDate(firstDay);
const initialEndDate = formatDate(lastDay);

export default function AISummaryCard() {
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(null);
    const [summary, setSummary] = useState(null);
    const [startDate, setStartDate] = useState(initialStartDate);
    const [endDate, setEndDate] = useState(initialEndDate);

    const fetchAISummary = useCallback(async () => {
        if (!startDate || !endDate || new Date(startDate) >= new Date(endDate)) {
            setIsError("Invalid date range selected: Start date must be before end date.");
            setSummary(null);
            return;
        }

        setIsError(null);
        setSummary(null);

        try {
            setIsLoading(true);
            const { success, data, message } = await getSummary({ startDate, endDate });
            if (success) {
                setSummary(data?.aiInsight);
            } else {
                throw new Error(message || "Failed to fetch summary.");
            }
        } catch (error) {
            console.error("Fetch Error:", error);
            setIsError(error.message || "An unknown error occurred during analysis.");
        } finally {
            setIsLoading(false);
        }
    }, [startDate, endDate]);

    const isDateRangeInvalid = new Date(startDate) >= new Date(endDate);
    const buttonDisabled = isLoading || isDateRangeInvalid;

    return (
        <div className="bg-indigo-500 p-6 rounded-xl shadow-2xl border-2 border-indigo-700 text-white  mx-auto space-y-4">
            <div className="flex items-center gap-3">
                <BotMessageSquare className="w-6 h-6 text-indigo-100" />
                <h2 className="text-2xl font-sans font-bold tracking-tight">
                    AI Expense Analysis
                </h2>
            </div>

            {/* Date Picker Controls */}
            <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-indigo-900 pointer-events-none" />
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full bg-indigo-100 text-indigo-900 py-2 pl-10 pr-3 rounded-lg font-medium focus:ring-2 focus:ring-white focus:outline-none transition duration-150 shadow-inner"
                        aria-label="Start Date"
                    />
                </div>
                <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-indigo-900 pointer-events-none" />
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full bg-indigo-100 text-indigo-900 py-2 pl-10 pr-3 rounded-lg font-medium focus:ring-2 focus:ring-white focus:outline-none transition duration-150 shadow-inner"
                        aria-label="End Date"
                    />
                </div>
            </div>

            {/* Status and Summary Display */}
            <div className="min-h-24 bg-indigo-600 p-4 rounded-lg shadow-inner">
                {isLoading && (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="animate-spin w-6 h-6 mr-2 text-indigo-100" />
                        <p className="text-indigo-100">Analyzing data...</p>
                    </div>
                )}

                {isError && (
                    <p className="text-sm text-yellow-300 italic">
                        Error: {isError}
                    </p>
                )}

                {!isLoading && !isError && summary && (
                    <p className="text-sm leading-relaxed text-indigo-100">
                        {summary}
                    </p>
                )}
                {!isLoading && !isError && !summary && (
                    <p className="text-sm leading-relaxed text-indigo-100 italic">
                        Select a date range and click 'Generate' to get your financial insight.
                    </p>
                )}
            </div>

            {/* Action Button */}
            {isDateRangeInvalid && !isLoading && (
                <p className="text-center text-sm text-red-300 font-semibold">
                    The start date must be before the end date.
                </p>
            )}

            <button
                onClick={fetchAISummary}
                className="w-full bg-white text-indigo-700 py-2 px-4 rounded-xl font-bold hover:bg-indigo-100 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center group"
                disabled={buttonDisabled}
            >
                {isLoading ? (
                    <>
                        <Loader2 className="animate-spin h-5 w-5 mr-3" />
                        Generating Insight...
                    </>
                ) : (
                    <>
                        <RefreshCw className="h-5 w-5 mr-3 group-hover:rotate-180 transition duration-300" />
                        Run Analysis
                    </>
                )}
            </button>
        </div>
    );
};