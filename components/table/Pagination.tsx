import { MetaData } from '@/types/global';

const Pagination = ({
  paginationData,
  currentPage,
  goToPage,
}: {
  paginationData: MetaData;
  currentPage: number;
  goToPage: (pageNumber: number) => void;
}) => {
  return (
    <div className="flex justify-end items-center space-x-4.75 mx-5 mt-7.5 mb-5">
      <div className="flex items-center justify-center text-gray-500 font-[12px]">
        {paginationData?.from} - {paginationData?.to} of {paginationData?.total}
      </div>
      <div className="flex justify-center items-center space-x-2 mx-3">
        {currentPage > 3 && (
          <>
            <button
              onClick={() => goToPage(1)}
              className="cursor-pointer px-3 py-1 rounded bg-gray-100"
            >
              1
            </button>
            {currentPage > 3 && <span>...</span>}
          </>
        )}

        {Array.from({ length: 5 }, (_, i) => {
          const pageNumber = currentPage - 2 + i;
          if (pageNumber > 0 && pageNumber <= paginationData?.last_page) {
            return (
              <button
                key={pageNumber}
                onClick={() => goToPage(pageNumber)}
                className={`cursor-pointer px-3 py-1 rounded ${
                  currentPage === pageNumber
                    ? 'bg-primary text-white'
                    : 'bg-gray-100'
                }`}
              >
                {pageNumber}
              </button>
            );
          }
          return null;
        })}

        {currentPage < paginationData?.last_page - 2 && (
          <>
            {currentPage < paginationData?.last_page - 3 && <span>...</span>}
            <button
              onClick={() => goToPage(paginationData?.last_page)}
              className="cursor-pointer px-3 py-1 rounded bg-gray-100"
            >
              {paginationData?.last_page}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Pagination;
