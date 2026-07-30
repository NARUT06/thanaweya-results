import { useState } from 'react';
import { useSearchWorker } from '../hooks/useSearchWorker';
import { useDarkMode } from '../hooks/useDarkMode';
import SearchBox from '../components/SearchBox';
import StudentCard from '../components/StudentCard';
import ResultTable from '../components/ResultTable';
import Loading from '../components/Loading';
import NoResult from '../components/NoResult';
import ThemeToggle from '../components/ThemeToggle';

// عدّل الرقمين دول لو عمود الاسم أو عمود رقم الجلوس مختلفين في الملف بتاعك
// (السكريبت convert-xlsx-to-json.mjs بيحاول يكتشفهم تلقائيًا بس تقدر تتأكد هنا)
export default function Home() {
  const {
    status,
    progress,
    errorMessage,
    totalRecords,
    columns,
    nameColumnIndex,
    seatColumnIndex,
    results,
    totalMatches,
    isSearching,
    runSearch,
  } = useSearchWorker();

  const { theme, toggleTheme } = useDarkMode();

  const [selectedIndex, setSelectedIndex] = useState(-1);

  function handleSearch(query) {
    setSelectedIndex(-1);
    runSearch(query);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/50 to-white dark:from-slate-900 dark:to-slate-950 transition-colors">
      <ThemeToggle theme={theme} onToggle={toggleTheme} />

      <header className="pt-14 pb-8 px-4 text-center">
        <div className="text-4xl mb-3">🎓</div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">نتيجة الثانوية العامة</h1>
        <p className="text-slate-500 dark:text-slate-400">
          {status === 'ready' && totalRecords > 0
            ? `ابحث برقم الجلوس أو الاسم بين ${totalRecords.toLocaleString('en')} طالب`
            : 'ابحث برقم الجلوس أو الاسم'}
        </p>
      </header>

      <main className="px-4 pb-20">
        {status === 'loading' && <Loading progress={progress} />}

        {status === 'error' && (
          <div className="max-w-lg mx-auto text-center py-16">
            <div className="text-5xl mb-3">⚠️</div>
            <p className="text-red-600 dark:text-red-400 font-semibold mb-1">حصلت مشكلة في تحميل البيانات</p>
            <p className="text-slate-500 dark:text-slate-400 text-sm">{errorMessage}</p>
          </div>
        )}

        {status === 'ready' && (
          <>
            <SearchBox onSearch={handleSearch} disabled={isSearching} />

            <div className="mt-8">
              {results === null && <NoResult variant="empty" />}

              {results !== null && results.length === 0 && <NoResult variant="notfound" />}

              {results !== null && results.length === 1 && (
                <StudentCard row={results[0]} columns={columns} nameColumnIndex={nameColumnIndex} seatColumnIndex={seatColumnIndex} />
              )}

              {results !== null && results.length > 1 && (
                <ResultTable
                  results={results}
                  totalMatches={totalMatches}
                  columns={columns}
                  nameColumnIndex={nameColumnIndex}
                  seatColumnIndex={seatColumnIndex}
                  onSelect={setSelectedIndex}
                  selectedIndex={selectedIndex}
                />
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
