/**
 * searchEngine.js
 * ----------------
 * كل منطق البحث موجود هنا لوحده، عشان لو حبيت تغيّر الخوارزمية أو تحسّن
 * الأداء تعدل في الملف ده بس من غير ما تلمس أي component.
 *
 * الاستراتيجية:
 *  1) لو النص المدخول كله أرقام -> نعتبره "رقم جلوس" ونبحث بـ exact/prefix match
 *     باستخدام Map (بحث فوري O(1)) بدل ما نمشي على كل الصفوف.
 *  2) لو مش أرقام -> نعتبره اسم، ونبحث بالـ substring match على النسخة
 *     المُطبَّعة (normalized) من كل اسم. البحث ده O(n) على عدد الصفوف،
 *     لكن بما إنه بيشتغل جوه Web Worker (search.worker.js) فمش بيجمّد الواجهة.
 *
 * ملحوظة أداء: مع ~919 ألف صف، البحث بالاسم بياخد عادة أقل من نص ثانية
 * على أي جهاز حديث. لو حبيت أسرع من كده في المستقبل، الحل الطبيعي هو
 * نقل البحث لسيرفر خلفي (زي ما اتقال في dataProvider.js) بدل البحث في المتصفح.
 */

import { normalizeArabic, normalizeDigits } from './normalizeArabic';

const MAX_RESULTS = 200; // سقف أقصى لعدد النتائج المعروضة، عشان الواجهة تفضل خفيفة

/**
 * بيبني فهرس (index) مرة واحدة بعد تحميل البيانات:
 *  - normalizedNames: نسخة مطبّعة من كل اسم (لسرعة البحث بالاسم)
 *  - seatIndex: Map من رقم الجلوس (نص أرقام بس) -> index الصف في rows
 */
export function buildIndex(dataset) {
  const { rows, nameColumnIndex, seatColumnIndex } = dataset;

  const normalizedNames = new Array(rows.length);
  const seatIndex = new Map();

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    normalizedNames[i] = normalizeArabic(row[nameColumnIndex]);

    const seatDigits = normalizeDigits(row[seatColumnIndex]);
    if (seatDigits) seatIndex.set(seatDigits, i);
  }

  return { normalizedNames, seatIndex };
}

/**
 * بيرجع كل النص المدخل هل هو أرقام بالكامل (رقم جلوس) ولا فيه حروف (اسم).
 */
function isNumericQuery(query) {
  const trimmed = query.trim();
  return trimmed.length > 0 && /^[0-9٠-٩\s]+$/.test(trimmed);
}

/**
 * دالة البحث الرئيسية.
 * بترجع { indices, totalMatches } — indices هي أول MAX_RESULTS نتيجة بس (للعرض)،
 * لكن totalMatches هو العدد الحقيقي لكل المطابقات (حتى لو أكتر من الحد الأقصى).
 */
export function search(dataset, index, rawQuery) {
  const query = (rawQuery || '').trim();
  if (!query) return { indices: [], totalMatches: 0 };

  const { rows } = dataset;
  const { normalizedNames, seatIndex } = index;

  // --- بحث رقم الجلوس ---
  if (isNumericQuery(query)) {
    const seatDigits = normalizeDigits(query);

    // تطابق كامل أولًا (أسرع حالة ولو المستخدم كتب الرقم بالظبط)
    if (seatIndex.has(seatDigits)) {
      return { indices: [seatIndex.get(seatDigits)], totalMatches: 1 };
    }

    // لو مفيش تطابق كامل، نبحث بأي رقم جلوس "يحتوي على" النص المدخل
    const indices = [];
    let totalMatches = 0;
    for (const [seat, rowIdx] of seatIndex) {
      if (seat.includes(seatDigits)) {
        totalMatches++;
        if (indices.length < MAX_RESULTS) indices.push(rowIdx);
      }
    }
    return { indices, totalMatches };
  }

  // --- بحث بالاسم ---
  const normalizedQuery = normalizeArabic(query);
  const indices = [];
  let totalMatches = 0;

  for (let i = 0; i < normalizedNames.length; i++) {
    if (normalizedNames[i].includes(normalizedQuery)) {
      totalMatches++;
      if (indices.length < MAX_RESULTS) indices.push(i);
    }
  }

  return { indices, totalMatches };
}

export { MAX_RESULTS };
