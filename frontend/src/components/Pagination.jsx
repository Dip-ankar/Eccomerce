import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  // 🧮 Helper function: generate page window
  const getVisiblePages = () => {
    const pages = [];

    if (totalPages <= 5) {
      // show all pages if few total
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        // near start
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        // near end
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        // middle
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }

    return pages;
  };

  const pages = getVisiblePages();

  const handleClick = (page) => {
    if (page !== "..." && page !== currentPage) onPageChange(page);
  };

  return (
    <div className="flex flex-wrap justify-center items-center gap-2 mt-10 mb-6">
      {/* Prev Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 shadow-md ${
          currentPage === 1
            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
            : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:scale-105"
        }`}
      >
        <ChevronLeft size={18} />
        Prev
      </button>

      {/* Page Numbers */}
      <div className="flex flex-wrap justify-center items-center gap-2">
        {pages.map((page, index) => (
          <button
            key={index}
            onClick={() => handleClick(page)}
            disabled={page === "..."}
            className={`w-10 h-10 flex items-center justify-center rounded-full border transition-all duration-300 text-sm font-semibold shadow-sm ${
              currentPage === page
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white scale-110 shadow-lg"
                : page === "..."
                ? "bg-transparent text-gray-500 border-none cursor-default"
                : "bg-white border-gray-300 text-gray-700 hover:bg-blue-100 hover:scale-105"
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 shadow-md ${
          currentPage === totalPages
            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
            : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:scale-105"
        }`}
      >
        Next
        <ChevronRight size={18} />
      </button>
    </div>
  );
};

export default Pagination;
