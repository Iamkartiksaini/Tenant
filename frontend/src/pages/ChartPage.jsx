import { ExpenseCard } from '@/pages/Expense-List';
import React, { useMemo, useRef } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import LoadingComponent from '../components/loading';
import { useExpenseApi } from '@/hook/useExpenseApi';
import ExpensesDate from '@/components/expense-date';
import BackButton from '@/components/back-button';

const fakeData = [
  { "_id": "691f4a321b339ef5fc4e7bda", "title": "Laptop", "category": "Electronics", "amount": 3000, "date": "2025-11-20T18:30:00.000Z" },
  { "_id": "691f1e2c4f745b05effe4a26", "title": "Srikant", "category": "Entertainment", "amount": 134, "date": "2025-11-19T18:30:00.000Z" },
  { "_id": "691f1e524f745b05effe4a29", "title": "Movie Tickets", "category": "Entertainment", "amount": 228, "date": "2025-11-19T18:30:00.000Z" },
  { "_id": "691f1aa1be74ee1e8f429a04", "title": "Dinner", "category": "Food", "amount": 48.01, "date": "2025-11-19T18:30:00.000Z" },
  { "_id": "691ed3081a6fb40574ecc8af", "title": "Office Supplies", "category": "Other", "amount": 48.2, "date": "2025-11-19T18:30:00.000Z" },

  // Additional data for better visualization
  { "_id": "a1", "title": "Groceries", "category": "Food", "amount": 150, "date": "2025-11-21T09:00:00.000Z" },
  { "_id": "a2", "title": "New Game", "category": "Entertainment", "amount": 60, "date": "2025-11-21T12:00:00.000Z" },
  { "_id": "a3", "title": "Chair", "category": "Other", "amount": 180, "date": "2025-11-21T15:00:00.000Z" },

  { "_id": "b1", "title": "Coffee", "category": "Food", "amount": 5.5, "date": "2025-11-20T10:00:00.000Z" },
  { "_id": "b2", "title": "Subscription", "category": "Entertainment", "amount": 15, "date": "2025-11-22T00:00:00.000Z" },
  { "_id": "b3", "title": "Tires", "category": "Other", "amount": 400, "date": "2025-11-22T00:00:00.000Z" },
];

const lineChartColors = [
  "#4E79A7", // muted blue
  "#F28E2B", // orange
  "#E15759", // reddish
  "#76B7B2", // teal
  "#59A14F", // green
  "#EDC949", // mustard
  "#AF7AA1", // purple
  "#FF9DA7", // pink
  "#9C755F"  // brown
];


const formatDateKey = (dateString) => new Date(dateString).toISOString().split('T')[0];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 bg-white border border-gray-300 rounded-lg shadow-xl backdrop-blur-sm bg-opacity-90">
        <p className="font-bold text-lg mb-1 text-gray-800">{new Date(label).toDateString()}</p>
        <ul className="list-disc ml-4 space-y-0.5">
          {payload.map((entry, index) => (
            <li key={`item-${index}`} style={{ color: entry.color }} className="text-sm">
              <span className="font-semibold">{entry.name}:</span> ${entry.value.toFixed(2)}
            </li>
          ))}
        </ul>
      </div>
    );
  }
  return null;
};

const LineChartComponennt = () => {


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

  const rawExpenses = data;

  const dateRef = useRef(null)
  const chartData = useMemo(() => {
    const dailyCategoryTotals = rawExpenses.reduce((acc, expense) => {
      const dateKey = formatDateKey(expense.date);
      const category = expense.category;
      const amount = expense.amount;

      if (!acc[dateKey]) {
        acc[dateKey] = {};
      }
      acc[dateKey][category] = (acc[dateKey][category] || 0) + amount;
      return acc;
    }, {});

    const dates = Object.keys(dailyCategoryTotals).sort();
    const allCategories = [...new Set(rawExpenses.map(e => e.category))];

    const finalData = dates.map(dateKey => {
      const dataPoint = { date: dateKey };

      allCategories.forEach(category => {
        dataPoint[category] = dailyCategoryTotals[dateKey][category] || 0;
      });
      return dataPoint;
    });

    return { finalData, allCategories };
  }, [loading]);


  const { finalData, allCategories } = chartData;

  if (loading && data?.length == 0) {
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

  function fetchDataWithDate(props) {
    dateRef.current = props
    refetch(props)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8 flex justify-center items-start">
      <div className="w-full max-w-7xl bg-white shadow-2xl rounded-xl p-4 sm:p-8 ">
        <div className="flex items-center justify-between border-b-2 border-gray-200 pb-3 mb-3">
          <BackButton />
          <ExpensesDate loading={loading} prevDates={dateRef.current} refetch={fetchDataWithDate} />
        </div>
        <div className="">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
            Monthly <span className='text-indigo-600'>Expense</span>  Tracker
          </h1>
          <p className="text-gray-500 mb-8">
            Total spending amount tracked by category over time.
          </p>
        </div>
        {finalData.length > 0 ? (
          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={finalData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

                {/* X-Axis: Dates */}
                <XAxis
                  dataKey="date"
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  // Custom formatter for better date display
                  tickFormatter={(tick) => new Date(tick).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />

                {/* Y-Axis: Amount */}
                <YAxis
                  domain={['auto', 'auto']}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                />

                {/* Tooltip for interactive data details */}
                <Tooltip content={<CustomTooltip />} />

                {/* Legend */}
                <Legend wrapperStyle={{ paddingTop: '20px' }} />

                {/* Generate a Line for each unique category */}
                {allCategories.map((category, index) => (
                  <Line
                    key={category}
                    type="monotone"
                    dataKey={category} // Key maps to the category name in the data array
                    stroke={lineChartColors[index] || '#4b5563'} // Fallback color
                    strokeWidth={3}
                    dot={{ r: 5, strokeWidth: 2 }} // Visible points
                    activeDot={{ r: 8, strokeWidth: 3 }} // Larger, active points on hover
                    name={category} // Name for the legend and tooltip
                  />
                ))}

              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center p-10 text-gray-500 border border-dashed border-gray-300 rounded-lg">
            No expense data available to display the chart.
          </div>
        )}

        <div className="mt-8 pt-4 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">Recent Expenses</h2>

          <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
            {rawExpenses?.slice(0, 3).map((expense) => <ExpenseCard key={expense._id} {...expense} />)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LineChartComponennt;