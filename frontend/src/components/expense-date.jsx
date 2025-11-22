import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { useState } from "react";


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

function und() { }

export default function ExpensesDate({ refetch = und, prevDates = {}, loading = false }) {
  const [startDate, setStartDate] = useState(prevDates?.startDate || initialStartDate);
  const [endDate, setEndDate] = useState(prevDates?.endDate || initialEndDate);
  const isDateRangeInvalid = new Date(startDate) >= new Date(endDate) || initialStartDate == startDate && initialEndDate == endDate;

  function getData() {
    if (isDateRangeInvalid) return;
    refetch({ startDate, endDate });
  }

  return (
    <div className="flex gap-3">
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
      <Button onClick={getData} disabled={isDateRangeInvalid || loading}>Get</Button>
    </div>
  );
}
