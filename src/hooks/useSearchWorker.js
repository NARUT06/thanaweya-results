import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * useSearchWorker
 * ----------------
 * الـ hook ده هو نقطة الاتصال الوحيدة بين الواجهة (Components) وبين
 * الـ Worker اللي بيعمل التحميل والبحث. أي component بيستخدمه مش محتاج
 * يعرف حاجة عن الـ Worker نفسه أو عن طريقة تحميل البيانات.
 */
export function useSearchWorker() {
  const workerRef = useRef(null);
  const debounceRef = useRef(null);

  const [status, setStatus] = useState('loading'); // loading | ready | error
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [totalRecords, setTotalRecords] = useState(0);
  const [columns, setColumns] = useState([]);
  const [nameColumnIndex, setNameColumnIndex] = useState(0);
  const [seatColumnIndex, setSeatColumnIndex] = useState(1);
  const [results, setResults] = useState(null); // null = لسه مبحثش، [] = بحث ومفيش نتائج
  const [totalMatches, setTotalMatches] = useState(0);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const worker = new Worker(new URL('../workers/search.worker.js', import.meta.url), {
      type: 'module',
    });
    workerRef.current = worker;

    worker.onmessage = (event) => {
      const { type, payload } = event.data;

      switch (type) {
        case 'LOAD_PROGRESS':
          setProgress(payload);
          break;
        case 'READY':
          setStatus('ready');
          setTotalRecords(payload.totalRecords);
          setColumns(payload.columns);
          setNameColumnIndex(payload.nameColumnIndex);
          setSeatColumnIndex(payload.seatColumnIndex);
          break;
        case 'SEARCH_RESULTS':
          setResults(payload.results);
          setTotalMatches(payload.totalMatches);
          setIsSearching(false);
          break;
        case 'ERROR':
          setStatus('error');
          setErrorMessage(payload);
          setIsSearching(false);
          break;
        default:
          break;
      }
    };

    worker.postMessage({ type: 'INIT' });

    return () => worker.terminate();
  }, []);

  const runSearch = useCallback((query) => {
    if (!workerRef.current) return;

    clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setResults(null);
      setTotalMatches(0);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    // Debounce بسيط (250ms) عشان مانبعتش رسالة بحث مع كل حرف وهو لسه بيكتب
    debounceRef.current = setTimeout(() => {
      workerRef.current.postMessage({ type: 'SEARCH', payload: { query } });
    }, 250);
  }, []);

  return {
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
  };
}
