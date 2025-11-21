import { useState, useEffect, useCallback } from "react";
import { getExpenses } from "@/api/service";

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
        const resp = await getExpenses({
          page: currentPage,
          limit: pageSize,
          ...apiProps,
        });
        if (resp.success) {
          const { pages, total, expenses } = resp.data;
          setExpenses(expenses ?? []);
          setTotalPages({ pages, items: total });
        } else {
          throw new Error(resp?.message || "Something went wrong...");
        }
      } catch (err) {
        console.error(err);
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
