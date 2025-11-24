import { useState, useEffect, useCallback } from "react";
import { getExpenses } from "@/api/service";
import { toast } from "react-toastify";

export function useExpenseApi({
  init = [],
  initPageSize = 10,
  initPageIndex = 1,
}) {
  const [expenses, setExpenses] = useState(init);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(initPageIndex);
  const [pageSize, setPageSize] = useState(initPageSize);
  const [totalPages, setTotalPages] = useState({ items: 10, pages: 1 });

  function updatePageIndex(page) {
    if (typeof page == "number") {
      setCurrentPage(page);
    }
  }
  function updatePageSize(size) {
    if (typeof size == "number") {
      setPageSize(size);
    }
  }

  const fetchData = useCallback(
    async (apiProps = {}) => {
      setLoading(true);
      setError(null);
      try {
        // const resp = await getExpenses({
        //   page: currentPage,
        //   limit: pageSize,
        //   ...apiProps,
        // });
        const resp = { data: fakeResponse, success: true };
        if (resp.success) {
          const { pages, total, expenses } = resp.data;
          setExpenses(expenses ?? []);
          setTotalPages({ pages, items: total });
        } else {
          throw new Error(resp?.message || "Something went wrong...");
        }
      } catch (err) {
        toast.error(err.message);
        setError("Failed to load expenses.");
      } finally {
        setLoading(false);
      }
    },
    [currentPage, pageSize]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data: expenses,
    loading,
    error,
    currentPage,
    pageSize,
    updatePageIndex,
    updatePageSize,
    totalPages,
    refetch: fetchData,
  };
}

const fakeResponse = {
  expenses: [
    {
      _id: "6920006a0f15001c8c67f93f",
      title: "Movie",
      category: "Entertainment",
      amount: 377,
      date: "2025-12-04T18:30:00.000Z",
    },
    {
      _id: "691f1e524f745b05effe4a29",
      title: "Doremon",
      category: "Other",
      amount: 228,
      date: "2025-11-30T18:30:00.000Z",
    },
    {
      _id: "6920004c455a08a5a801009a",
      title: "Shopping",
      category: "Groceries",
      amount: 198,
      date: "2025-11-30T18:30:00.000Z",
    },
    {
      _id: "692197df81ec1fd60689c4a1",
      title: "To The City",
      category: "Travel",
      amount: 300,
      date: "2025-11-21T18:30:00.000Z",
    },
    {
      _id: "692026dd626a80fda5998dfa",
      title: "Pizza",
      category: "Food",
      amount: 1222,
      date: "2025-11-20T18:30:00.000Z",
    },
    {
      _id: "691f4a321b339ef5fc4e7bda",
      title: "Laptop",
      category: "Entertainment",
      amount: 3000,
      date: "2025-11-20T18:30:00.000Z",
    },
    {
      _id: "691ed3081a6fb40574ecc8af",
      title: "Office Supplies",
      category: "Other",
      amount: 48.2,
      date: "2025-11-19T18:30:00.000Z",
    },
    {
      _id: "691f24b2e1a5c5911b0804cf",
      title: "chaowmin",
      category: "Groceries",
      amount: 95,
      date: "2025-11-19T18:30:00.000Z",
    },
    {
      _id: "691f25b4e6e1b190eb9fb5fc",
      title: "Office Supplies",
      category: "Office",
      amount: 48.2,
      date: "2025-11-19T18:30:00.000Z",
    },
    {
      _id: "691f25b4e6e1b190eb9fb5fa",
      title: "Team Lunch",
      category: "Food",
      amount: 120.5,
      date: "2025-11-19T18:30:00.000Z",
    },
  ],
  page: 1,
  pages: 3,
  total: 23,
};
