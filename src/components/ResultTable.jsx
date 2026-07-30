import { getSpecialColumnIndices } from '../utils/columnHelpers';

export default function ResultTable({ results, totalMatches, columns, nameColumnIndex, seatColumnIndex, onSelect, selectedIndex }) {
  const safeTotalMatches = typeof totalMatches === 'number' ? totalMatches : results.length;
  const isTruncated = safeTotalMatches > results.length;
  const { totalDegreeIndex, percentageIndex } = getSpecialColumnIndices(columns);
  const highlightedIndices = new Set([seatColumnIndex, totalDegreeIndex, percentageIndex]);

  function handleClick(i) {
    onSelect(selectedIndex === i ? -1 : i);
  }

  return (
    <div className="max-w-2xl mx-auto">
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-2 px-1">
        {safeTotalMatches.toLocaleString('en')} نتيجة مطابقة
        {isTruncated && ` (معروض أول ${results.length})`}
        {' '}— اضغط على أي اسم لعرض التفاصيل كاملة
      </p>
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-700 overflow-hidden">
        {results.map((row, i) => {
          const isOpen = selectedIndex === i;
          return (
            <div key={i}>
              <button
                onClick={() => handleClick(i)}
                className={`w-full text-right px-5 py-3.5 flex items-center justify-between gap-3 transition-colors hover:bg-violet-50 dark:hover:bg-slate-700/50 ${
                  isOpen ? 'bg-violet-50 dark:bg-slate-700/50' : ''
                }`}
              >
                <span className="font-medium text-slate-800 dark:text-slate-100">{row[nameColumnIndex]}</span>
                <span className="text-sm text-slate-400 dark:text-slate-500 shrink-0">
                  رقم الجلوس: {row[seatColumnIndex]}
                </span>
              </button>

              {isOpen && (
                <div className="px-5 py-4 bg-slate-50/70 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700">
                  <div className="flex gap-2 mb-4">
                    <div className="flex-1 bg-slate-100 dark:bg-slate-700/60 rounded-xl px-3 py-2 text-center">
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">رقم الجلوس</p>
                      <p className="text-base font-semibold text-slate-800 dark:text-slate-100 mt-0.5">
                        {row[seatColumnIndex] || '—'}
                      </p>
                    </div>

                    {totalDegreeIndex !== -1 && (
                      <div className="flex-1 bg-white dark:bg-slate-700/30 rounded-xl px-3 py-2 text-center">
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">{columns[totalDegreeIndex]}</p>
                        <p className="text-base font-semibold text-slate-800 dark:text-slate-100 mt-0.5">
                          {row[totalDegreeIndex] || '—'}
                        </p>
                      </div>
                    )}

                    {percentageIndex !== -1 && (
                      <div className="flex-1 bg-violet-100 dark:bg-violet-900/40 rounded-xl px-3 py-2 text-center">
                        <p className="text-[11px] text-violet-600 dark:text-violet-300">النسبة</p>
                        <p className="text-base font-semibold text-violet-800 dark:text-violet-200 mt-0.5">
                          {row[percentageIndex] || '—'}
                        </p>
                      </div>
                    )}
                  </div>

                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                    {columns.map((col, colIdx) => {
                      if (colIdx === nameColumnIndex || highlightedIndices.has(colIdx)) return null;
                      return (
                        <div key={col} className="flex flex-col">
                          <dt className="text-xs font-medium text-slate-400 dark:text-slate-500">{col}</dt>
                          <dd className="text-slate-800 dark:text-slate-100 font-semibold">{row[colIdx] || '—'}</dd>
                        </div>
                      );
                    })}
                  </dl>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
