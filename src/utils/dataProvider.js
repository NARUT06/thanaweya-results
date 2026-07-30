/**
 * dataProvider.js
 * ----------------
 * "طبقة البيانات" (Data Layer).
 *
 * الفكرة: أي component في الموقع (زي Home.jsx) مبيعرفش ولا يهمه من فين البيانات
 * جايه. هو بس بيستدعي loadDataset() ويستنى النتيجة.
 *
 * دلوقتي: البيانات بتيجي من ملف public/data.json (ثابت، بيتحمل مرة واحدة).
 *
 * لو في يوم من الأيام عدد الطلاب زاد أوي وعايز تتحول لـ Backend حقيقي
 * (API / قاعدة بيانات / Elasticsearch..) كل اللي هتعمله هو تغيّر جوه الدالة دي
 * بس (تستبدل fetch('./data.json') بـ fetch('https://your-api.com/search?q=...'))
 * من غير ما تلمس أي component ولا أي حاجة في الواجهة أو في محرك البحث.
 */

const DATA_URL = `${import.meta.env.BASE_URL}data.json`;

let cachedDataset = null;
let inFlightPromise = null;

/**
 * بيرجع الداتاسيت كامل: { columns, rows, nameColumnIndex, seatColumnIndex, totalRecords }
 * بيتعمل له cache عشان ميتحملش أكتر من مرة في نفس الجلسة.
 */
export async function loadDataset(onProgress) {
  if (cachedDataset) return cachedDataset;
  if (inFlightPromise) return inFlightPromise;

  inFlightPromise = (async () => {
    const response = await fetch(DATA_URL);

    if (!response.ok) {
      throw new Error(
        `مش لاقي ملف البيانات (data.json). اتأكد إنك حطيت الملف في مجلد public وحولته بالسكريبت.`
      );
    }

    // لو المتصفح بيدعم قراءة الاستريم بنعرض تقدم التحميل (مفيد مع ملفات كبيرة)
    const contentLength = response.headers.get('content-length');
    if (contentLength && response.body && onProgress) {
      const total = parseInt(contentLength, 10);
      let loaded = 0;
      const reader = response.body.getReader();
      const chunks = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        loaded += value.length;
        onProgress(Math.min(99, Math.round((loaded / total) * 100)));
      }

      const fullBuffer = new Uint8Array(loaded);
      let position = 0;
      for (const chunk of chunks) {
        fullBuffer.set(chunk, position);
        position += chunk.length;
      }

      const text = new TextDecoder('utf-8').decode(fullBuffer);
      cachedDataset = JSON.parse(text);
    } else {
      cachedDataset = await response.json();
    }

    onProgress?.(100);
    return cachedDataset;
  })();

  return inFlightPromise;
}
