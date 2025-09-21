import { useState, useMemo, useEffect } from 'react';

export const usePagination = (data, itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1);

  const safeItemsPerPage = Math.max(1, itemsPerPage); 

  const totalPages = Math.max(1, Math.ceil((data?.length || 0) / safeItemsPerPage));

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * safeItemsPerPage;
    const endIndex = startIndex + safeItemsPerPage;
    return data?.slice(startIndex, endIndex) || [];
  }, [data, currentPage, safeItemsPerPage]);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const nextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

 
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [data, totalPages, currentPage]);

  return {
    currentPage,
    totalPages,
    paginatedData,
    goToPage,
    nextPage,
    prevPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1
  };
};
