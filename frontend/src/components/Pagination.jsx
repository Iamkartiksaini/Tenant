import { cn } from '@/lib/utils';
import React, { memo } from 'react';

const Pagination = ({
    dataLength,
    itemsPerPage,
    currentPage,
    totalPages,
    setCurrentPage, isLoading = false
}) => {

    const pagesAccordingToDataArrLength = Math.ceil(dataLength / itemsPerPage);
    if (!totalPages || pagesAccordingToDataArrLength > totalPages) { totalPages = pagesAccordingToDataArrLength }

    if (totalPages <= 1) {
        return null;
    }

    const pageNumbers = Array.from({ length: pagesAccordingToDataArrLength }, (_, i) => i + 1);
    const disabledClass = "bg-gray-200 text-gray-400 cursor-not-allowed"
    return (
        <nav className="p-4  flex justify-center " aria-label="Pagination">
            <ul className="flex items-center space-x-2">
                {/* Previous Button */}
                <li>
                    <button
                        onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                        aria-label="Previous Page"
                        disabled={currentPage === 1 || isLoading}
                        className={cn(`px-3 py-1 rounded border text-sm`,
                            currentPage === 1
                                ? disabledClass
                                : "bg-white hover:bg-gray-100 border-gray-300 text-gray-700"
                        )}
                    >
                        Previous
                    </button>
                </li>

                {/* Page Numbers */}
                {pageNumbers.map((pageNumber) => (
                    <li key={pageNumber}>
                        <button
                            onClick={() => setCurrentPage(pageNumber)}
                            aria-label={`Go to page ${pageNumber}`}
                            disabled={isLoading}
                            className={cn("px-3 py-1 rounded text-sm border",
                                currentPage === pageNumber
                                    ? "bg-blue-600 text-white border-blue-600"
                                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                            )}
                        >
                            {pageNumber}
                        </button>
                    </li>
                ))}

                {/* Next Button */}
                <li>
                    <button
                        onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                        aria-label="Next Page"
                        disabled={currentPage === totalPages || isLoading}
                        className={cn("px-3 py-1 rounded border text-sm",
                            currentPage === totalPages
                                ? disabledClass
                                : "bg-white hover:bg-gray-100 border-gray-300 text-gray-700"
                        )}
                    >
                        Next
                    </button>
                </li>
            </ul>
        </nav >

    );
};

export default memo(Pagination);
