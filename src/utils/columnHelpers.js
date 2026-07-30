/**
 * columnHelpers.js
 * -----------------
 * دوال صغيرة مشتركة بين StudentCard و ResultTable، عشان نلاقي أعمدة معينة
 * (المجموع، النسبة) بالاسم من غير ما نحفظ index ثابت (لأن ترتيب الأعمدة
 * ممكن يختلف من ملف لملف).
 */

export function findColumnByKeywords(columns, keywords) {
  return columns.findIndex((col) => keywords.some((kw) => col.includes(kw)));
}

export function getSpecialColumnIndices(columns) {
  const totalDegreeIndex = findColumnByKeywords(columns, [
    'total_degree', 'degree', 'total', 'المجموع', 'الدرجة الكلية', 'الدرجة',
  ]);
  const percentageIndex = findColumnByKeywords(columns, ['نسبة', 'percentage']);

  return { totalDegreeIndex, percentageIndex };
}
