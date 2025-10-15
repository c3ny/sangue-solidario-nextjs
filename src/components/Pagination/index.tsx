"use client";

import { useMemo } from "react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import styles from "./styles.module.scss";

export interface IPaginationProps {
  /**
   * Current active page (1-indexed)
   */
  currentPage: number;
  /**
   * Total number of pages
   */
  totalPages: number;
  /**
   * Callback function when page changes
   */
  onPageChange: (page: number) => void;
  /**
   * Maximum number of page buttons to show
   * @default 5
   */
  maxPageButtons?: number;
  /**
   * Optional className for custom styling
   */
  className?: string;
}

/**
 * Pagination component for navigating through pages of data
 *
 * @example
 * ```tsx
 * <Pagination
 *   currentPage={1}
 *   totalPages={10}
 *   onPageChange={(page) => console.log('Page changed to:', page)}
 * />
 * ```
 */
export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  maxPageButtons = 5,
  className = "",
}: IPaginationProps) => {
  const pageNumbers = useMemo(() => {
    const pages: (number | string)[] = [];

    if (totalPages <= maxPageButtons) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      const leftOffset = Math.floor((maxPageButtons - 3) / 2);
      const rightOffset = Math.ceil((maxPageButtons - 3) / 2);

      let start = Math.max(2, currentPage - leftOffset);
      let end = Math.min(totalPages - 1, currentPage + rightOffset);

      if (currentPage <= leftOffset + 2) {
        end = Math.min(totalPages - 1, maxPageButtons - 1);
      }

      if (currentPage >= totalPages - rightOffset - 1) {
        start = Math.max(2, totalPages - maxPageButtons + 2);
      }

      if (start > 2) {
        pages.push("...");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push("...");
      }

      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  }, [currentPage, totalPages, maxPageButtons]);

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number | string) => {
    if (typeof page === "number") {
      onPageChange(page);
    }
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className={`${styles.pagination} ${className}`} aria-label="Paginação">
      <button
        className={`${styles.pageButton} ${styles.navButton}`}
        onClick={handlePrevious}
        disabled={currentPage === 1}
        aria-label="Página anterior"
      >
        <BsChevronLeft />
      </button>

      <div className={styles.pageNumbers}>
        {pageNumbers.map((page, index) => {
          if (page === "...") {
            return (
              <span key={`ellipsis-${index}`} className={styles.ellipsis}>
                ...
              </span>
            );
          }

          return (
            <button
              key={page}
              className={`${styles.pageButton} ${
                currentPage === page ? styles.active : ""
              }`}
              onClick={() => handlePageClick(page)}
              aria-label={`Página ${page}`}
              aria-current={currentPage === page ? "page" : undefined}
            >
              {page}
            </button>
          );
        })}
      </div>

      <button
        className={`${styles.pageButton} ${styles.navButton}`}
        onClick={handleNext}
        disabled={currentPage === totalPages}
        aria-label="Próxima página"
      >
        <BsChevronRight />
      </button>
    </nav>
  );
};
