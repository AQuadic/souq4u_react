import LeftArrow from '@/features/products/icons/LeftArrow';
import RightArrow from '@/features/products/icons/RightArrow';
import i18n from '@/i18n';
import React from 'react';

interface ProductsPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const ProductsPagination: React.FC<ProductsPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const locale = i18n.language;
  const isRTL = locale === 'ar';

  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePageClick = (page: number) => {
    onPageChange(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate page numbers with ellipsis for better UX with many pages
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      // Show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-3 mt-12">
      <button
        onClick={handlePrev}
        disabled={currentPage === 1}
        className="transition-opacity hover:opacity-80 disabled:cursor-not-allowed"
        aria-label="Previous page"
      >
        {isRTL ? (
          <RightArrow className={`w-6 h-6 ${currentPage === 1 ? 'opacity-50' : ''}`} />
        ) : (
          <LeftArrow className={`w-6 h-6 ${currentPage === 1 ? 'opacity-50' : ''}`} />
        )}
      </button>

      {pageNumbers.map((page, index) => {
        if (page === '...') {
          return (
            <span key={`ellipsis-${index}`} className="w-10 h-10 flex items-center justify-center">
              ...
            </span>
          );
        }

        return (
          <button
            key={page}
            onClick={() => handlePageClick(page as number)}
            className={`w-10 h-10 rounded-md flex items-center justify-center transition-colors ${
              currentPage === page
                ? 'bg-main text-white'
                : 'hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
            aria-label={`Page ${page}`}
            aria-current={currentPage === page ? 'page' : undefined}
          >
            {page}
          </button>
        );
      })}

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="transition-opacity hover:opacity-80 disabled:cursor-not-allowed"
        aria-label="Next page"
      >
        {isRTL ? (
          <LeftArrow className={`w-6 h-6 ${currentPage === totalPages ? 'opacity-50' : ''}`} />
        ) : (
          <RightArrow className={`w-6 h-6 ${currentPage === totalPages ? 'opacity-50' : ''}`} />
        )}
      </button>
    </div>
  );
};

export default ProductsPagination;