import { useState } from 'react';

export default function SearchBox({ onSearch, disabled }) {
  const [value, setValue] = useState('');

  function handleChange(e) {
    setValue(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSearch(value);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-2xl shadow-lg shadow-slate-200/60 dark:shadow-black/20 border border-slate-200 dark:border-slate-700 p-2 focus-within:ring-2 focus-within:ring-emerald-500 transition-shadow">
        <span className="text-slate-400 dark:text-slate-500 text-xl pr-2 select-none">🔍</span>
        <input
          type="text"
          value={value}
          onChange={handleChange}
          disabled={disabled}
          placeholder="اكتب الاسم أو رقم الجلوس واضغط Enter أو بحث..."
          className="flex-1 bg-transparent outline-none text-lg py-3 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 disabled:opacity-50"
          autoFocus
        />
        <button
          type="submit"
          disabled={disabled}
          className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          بحث
        </button>
      </div>
    </form>
  );
}
