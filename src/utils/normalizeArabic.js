/**
 * normalizeArabic.js
 * -------------------
 * الهدف: تحويل أي نص عربي (اسم، كلمة بحث..) إلى صورة "قياسية" واحدة
 * بحيث نقدر نقارن كلمتين مكتوبين بطرق مختلفة ونعتبرهم متطابقين.
 *
 * أمثلة على اللي بيتعالج هنا:
 *   "عبد الله"  ==  "عبدالله"  ==  "عبد-الله"  ==  "عبد_الله"
 *   "مُحَمَّد"   ==  "محمد"        (شيل التشكيل)
 *   "أحمد" / "إحمد" / "آحمد" == "احمد"   (توحيد الألف)
 *   "يحيى" == "يحيي"                      (الألف المقصورة -> ياء)
 *   "مؤمن" == "مومن"                      (الهمزة على واو -> واو)
 *   "دائي" == "دايي"                      (الهمزة على ياء -> ياء)
 *
 * ملاحظة: التطبيع ده بيتطبق فقط على نسخة "المقارنة الداخلية"،
 * إحنا لسه بنعرض للمستخدم الاسم الأصلي زي ما هو مكتوب في ملف البيانات.
 */

// أشكال الألف المختلفة -> ا
const ALEF_VARIANTS = /[أإآٱ]/g;
// الألف المقصورة -> ي
const ALEF_MAKSURA = /ى/g;
// الهمزة على واو -> و
const WAW_HAMZA = /ؤ/g;
// الهمزة على ياء (وتحت السن) -> ي
const YEH_HAMZA = /[ئ]/g;
// التاء المربوطة -> ه (اختياري لكنه بيوسّع نطاق التطابق: "فاطمة" == "فاطمه")
const TEH_MARBUTA = /ة/g;
// كل علامات التشكيل العربي (فتحة، ضمة، كسرة، سكون، شدة، تنوين..)
const ARABIC_DIACRITICS = /[\u064B-\u0652\u0670\u0653-\u0655\u0640]/g;
// أي حاجة مش حرف عربي أو إنجليزي أو رقم (مسافات، شرطات، أندرسكور، رموز..)
const NON_ALPHANUMERIC = /[^\u0621-\u063A\u0641-\u064Aa-zA-Z0-9]/g;
// أرقام عربية (هندية) -> أرقام إنجليزية، عشان رقم الجلوس يتقارن صح
const ARABIC_INDIC_DIGITS = /[٠-٩]/g;
const ARABIC_INDIC_MAP = { '٠':'0','١':'1','٢':'2','٣':'3','٤':'4','٥':'5','٦':'6','٧':'7','٨':'8','٩':'9' };

/**
 * الدالة الرئيسية: تاخد أي نص وترجع نسخة موحدة منه للمقارنة.
 * بتشيل المسافات تمامًا عشان "عبد الله" تتساوى مع "عبدالله".
 */
export function normalizeArabic(text) {
  if (text === null || text === undefined) return '';

  let result = String(text).trim();

  result = result.replace(ARABIC_INDIC_DIGITS, (d) => ARABIC_INDIC_MAP[d]);
  result = result.replace(ARABIC_DIACRITICS, '');
  result = result.replace(ALEF_VARIANTS, 'ا');
  result = result.replace(ALEF_MAKSURA, 'ي');
  result = result.replace(WAW_HAMZA, 'و');
  result = result.replace(YEH_HAMZA, 'ي');
  result = result.replace(TEH_MARBUTA, 'ه');
  result = result.toLowerCase(); // عشان أي حروف إنجليزية تتقارن من غير حساسية لحالة الأحرف
  result = result.replace(NON_ALPHANUMERIC, ''); // شيل المسافات/الشرطات/الأندرسكور كلها

  return result;
}

/**
 * نسخة "خفيفة" للأرقام بس (رقم الجلوس): بتشيل أي حاجة مش رقم.
 * مفيدة عشان لو المستخدم كتب رقم الجلوس بمسافات أو بأرقام عربية.
 */
export function normalizeDigits(text) {
  if (text === null || text === undefined) return '';
  let result = String(text).trim();
  result = result.replace(ARABIC_INDIC_DIGITS, (d) => ARABIC_INDIC_MAP[d]);
  result = result.replace(/[^0-9]/g, '');
  return result;
}

/**
 * هل النص المدخل يبدو إنه رقم جلوس (كله أرقام) ولا اسم؟
 * بنستخدمها عشان نقرر نبحث في عمود رقم الجلوس ولا عمود الاسم.
 */
export function looksLikeSeatNumber(query) {
  const digitsOnly = normalizeDigits(query);
  return digitsOnly.length > 0 && digitsOnly.length === normalizeArabic(query).replace(/[a-z]/g, '').length;
}
