import { useEffect, useState } from "react";

function dummy() {
  return undefined;
}

export default function usePagination(changePageAction = dummy) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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

  useEffect(() => {
    changePageAction();
  }, [currentPage, pageSize]);

  return { currentPage, pageSize, updatePageIndex, updatePageSize };
}
