const Pagination = ({ page, pages, onPageChange }) => (
  <div className="flex items-center gap-2.5 text-xs font-bold text-slate-600">
    <button
      className="px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white active:scale-95 transition-all shadow-sm cursor-pointer disabled:cursor-not-allowed select-none"
      onClick={() => onPageChange(Math.max(page - 1, 1))}
      disabled={page <= 1}
    >
      ◀ Prev
    </button>
    <span className="bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg font-bold select-none">
      Page {page} of {pages}
    </span>
    <button
      className="px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white active:scale-95 transition-all shadow-sm cursor-pointer disabled:cursor-not-allowed select-none"
      onClick={() => onPageChange(Math.min(page + 1, pages))}
      disabled={page >= pages}
    >
      Next ▶
    </button>
  </div>
);

export default Pagination;
