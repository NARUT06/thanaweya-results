import { getSpecialColumnIndices } from '../utils/columnHelpers';

export default function StudentCard({ row, columns, nameColumnIndex, seatColumnIndex }) {
  const name = row[nameColumnIndex];
  const { totalDegreeIndex, percentageIndex } = getSpecialColumnIndices(columns);

  // الأعمدة اللي هتتعرض في الصناديق التلاتة فوق (مش هتتكرر تاني تحت)
  const highlightedIndices = new Set([seatColumnIndex, totalDegreeIndex, percentageIndex]);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 max-w-2xl mx-auto animate-in fade-in">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-11 w-11 rounded-full bg-violet-500 dark:bg-violet-500 text-violet-50 flex items-center justify-center text-base font-bold shrink-0">
          {name?.trim()?.[0] || '👤'}
        </div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{name}</h2>
      </div>

      <div className="flex gap-2 mb-4">
        {/* رقم الجلوس - رمادي محايد */}
        <div className="flex-1 bg-slate-100 dark:bg-slate-700/60 rounded-xl px-3 py-2 text-center">
          <p className="text-[11px] text-slate-500 dark:text-slate-400">رقم الجلوس</p>
          <p className="text-base font-semibold text-slate-800 dark:text-slate-100 mt-0.5">
            {row[seatColumnIndex] || '—'}
          </p>
        </div>

        {/* المجموع - رمادي فاتح شوية */}
        {totalDegreeIndex !== -1 && (
          <div className="flex-1 bg-slate-50 dark:bg-slate-700/30 rounded-xl px-3 py-2 text-center">
            <p className="text-[11px] text-slate-500 dark:text-slate-400">{columns[totalDegreeIndex]}</p>
            <p className="text-base font-semibold text-slate-800 dark:text-slate-100 mt-0.5">
              {row[totalDegreeIndex] || '—'}
            </p>
          </div>
        )}

        {/* النسبة - بنفسجي بارز */}
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
        {columns.map((col, i) => {
          if (i === nameColumnIndex || highlightedIndices.has(i)) return null;
          return (
            <div key={col} className="flex flex-col">
              <dt className="text-xs font-medium text-slate-400 dark:text-slate-500">{col}</dt>
              <dd className="text-slate-800 dark:text-slate-100 font-semibold">{row[i] || '—'}</dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}
