/**
 * scripts/convert-xlsx-to-json.mjs
 * ---------------------------------
 * ده السكريبت اللي هتشغله كل سنة (مرة واحدة بس) بعد ما تحط ملف الإكسل الجديد.
 * وظيفته: يقرأ ملف الإكسل ويحوله لملف JSON مضغوط وسريع التحميل في المتصفح.
 *
 * ليه JSON مش إكسل مباشرة في المتصفح؟
 *   لأن عندك حوالي 919,397 طالب. قراءة وتحليل ملف إكسل بالحجم ده جوه
 *   المتصفح (Client-Side) هتاخد وقت طويل وهتستهلك رامات كتير جدًا.
 *   لكن ملف JSON مضغوط ومُجهّز مسبقًا هيتحمل ويتقرأ في المتصفح في ثواني معدودة.
 *
 * طريقة الاستخدام:
 *   node scripts/convert-xlsx-to-json.mjs ./public/data.xlsx
 *
 * (لو مسميتش اسم الملف، هيدور تلقائيًا على public/data.xlsx)
 */

import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

const inputPath = process.argv[2] || path.join(process.cwd(), 'public', 'data.xlsx');
const outputPath = path.join(process.cwd(), 'public', 'data.json');

// الدرجة الكاملة اللي بيتحسب منها "النسبة%". غيّرها هنا لو اختلفت من سنة لسنة
// (أو مرّرها كـ argument تالت: node scripts/convert-xlsx-to-json.mjs data.xlsx 410)
const MAX_DEGREE = Number(process.argv[3]) || 320;

if (!fs.existsSync(inputPath)) {
  console.error(`❌ مش لاقي الملف: ${inputPath}`);
  console.error('   ضيف ملف الإكسل بتاع السنة الحالية في public/data.xlsx وشغل السكريبت تاني.');
  process.exit(1);
}

console.log(`📖 بيقرأ الملف: ${inputPath} ...`);
const workbook = XLSX.readFile(inputPath);
const firstSheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[firstSheetName];

// header:1 معناه إننا ناخد الصفوف كأرايز مش أوبجكتس (أخف وأسرع في التخزين)
const rawRows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '', raw: false });

if (rawRows.length < 2) {
  console.error('❌ الملف فاضي أو مفيهوش بيانات كفاية.');
  process.exit(1);
}

const columns = rawRows[0].map((c) => String(c).trim());
const rows = rawRows.slice(1).filter((r) => r.some((cell) => String(cell).trim() !== ''));

// محاولة اكتشاف عمود "الاسم" وعمود "رقم الجلوس" تلقائيًا من أسماء الأعمدة
function findColumnIndex(keywords) {
  return columns.findIndex((col) =>
    keywords.some((kw) => col.includes(kw))
  );
}

let nameColumnIndex = findColumnIndex(['arabic_name', 'name', 'اسم']);
let seatColumnIndex = findColumnIndex(['seating', 'seat_no', 'seat', 'جلوس', 'كود الجلوس', 'رقم الجلوس']);

if (nameColumnIndex === -1) nameColumnIndex = 0;
if (seatColumnIndex === -1) seatColumnIndex = 1;

// عمود المجموع/الدرجة الكلية، عشان نحسب منه النسبة%
const totalDegreeColumnIndex = findColumnIndex(['total_degree', 'degree', 'total', 'المجموع', 'الدرجة الكلية', 'الدرجة']);

const alreadyHasPercentageColumn = columns.some((c) => c.includes('نسبة') || c.toLowerCase().includes('percentage'));

if (totalDegreeColumnIndex !== -1 && !alreadyHasPercentageColumn) {
  columns.push('النسبة');
  for (const row of rows) {
    const totalDegree = parseFloat(row[totalDegreeColumnIndex]);
    if (!isNaN(totalDegree) && MAX_DEGREE > 0) {
      const percentage = ((totalDegree / MAX_DEGREE) * 100).toFixed(2);
      row.push(`${percentage}%`);
    } else {
      row.push(''); // لو الدرجة فاضية أو مش رقم (مثلاً حالة "دور ثان")
    }
  }
  console.log(`📊 هيتحسب النسبة% تلقائيًا من عمود "${columns[totalDegreeColumnIndex]}" على أساس درجة كلية = ${MAX_DEGREE}`);
} else if (alreadyHasPercentageColumn) {
  console.log('ℹ️  الملف عنده عمود نسبة جاهز بالفعل، مش هنضيف واحد تاني.');
} else {
  console.log('⚠️  مالقتش عمود للدرجة الكلية، مش هيتحسب عمود "النسبة" — ممكن تحسبه يدويًا لو حابب.');
}

const output = {
  generatedAt: new Date().toISOString(),
  totalRecords: rows.length,
  columns,
  nameColumnIndex,
  seatColumnIndex,
  rows,
};

fs.writeFileSync(outputPath, JSON.stringify(output));

const sizeMB = (fs.statSync(outputPath).size / (1024 * 1024)).toFixed(2);

console.log(`✅ تم التحويل بنجاح!`);
console.log(`   عدد السجلات: ${rows.length.toLocaleString('en')}`);
console.log(`   الأعمدة: ${columns.join(' | ')}`);
console.log(`   عمود الاسم المكتشف: "${columns[nameColumnIndex]}" (index ${nameColumnIndex})`);
console.log(`   عمود رقم الجلوس المكتشف: "${columns[seatColumnIndex]}" (index ${seatColumnIndex})`);
console.log(`   حجم الملف الناتج: ${sizeMB} MB`);
console.log(`   الملف اتحفظ في: ${outputPath}`);
console.log('');
console.log('⚠️  لو الاكتشاف التلقائي غلط (عمود مش صح)، افتح public/data.json');
console.log('   وعدّل nameColumnIndex / seatColumnIndex يدويًا لرقم العمود الصح (يبدأ من 0).');
