export default function Loading({ progress }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 rounded-full border-4 border-slate-200 dark:border-slate-700" />
        <div className="absolute inset-0 rounded-full border-4 border-emerald-600 border-t-transparent animate-spin" />
      </div>
      <p className="text-slate-600 dark:text-slate-300 font-medium">
        {progress > 0 ? `جاري تحميل بيانات النتيجة... ${progress}%` : 'جاري تحميل بيانات النتيجة...'}
      </p>
      {progress > 0 && (
        <div className="w-64 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-600 transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
