export default function NoResult({ variant = 'empty' }) {
  if (variant === 'empty') {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <div className="text-5xl">🔍</div>
        <p className="text-slate-500 dark:text-slate-400 font-medium">
          اكتب الاسم أو رقم الجلوس في الأعلى وهيظهر لك النتيجة هنا
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="text-5xl">🚫</div>
      <p className="text-slate-700 dark:text-slate-200 font-semibold text-lg">لم يتم العثور على أي نتيجة</p>
      <p className="text-slate-500 dark:text-slate-400 text-sm">
        تأكد من كتابة الاسم أو رقم الجلوس بشكل صحيح وحاول مرة أخرى
      </p>
    </div>
  );
}
