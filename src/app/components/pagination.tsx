"use client";

type PaginationProps = {
  page: number;
  pageItems: any[];
  pageSize: number;
  onChangePage: (page: number) => void;
};

export default function Pagination({
  page,
  pageItems = [],
  pageSize,
  onChangePage,
}: PaginationProps) {
  return (
    <div className="flex justify-between items-center w-full my-4">
      <button
        onClick={() => onChangePage(page - 1)}
        disabled={page === 1}
        className="px-4 py-2 bg-[var(--primary)] text-white rounded-md shadow-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
      >
        Previous
      </button>

      <button
        onClick={() => onChangePage(page + 1)}
        disabled={pageItems.length < pageSize}
        className="px-4 py-2 bg-[var(--primary)] text-white rounded-md shadow-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
      >
        Next
      </button>
    </div>
  );
}
