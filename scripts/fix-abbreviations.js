/**
 * Script thay viết tắt → từ đầy đủ trong data files
 * Phân biệt theo ngữ cảnh từng môn (math, vietnamese, ethics, nature, science...)
 */
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'src', 'data');

// === COMMON REPLACEMENTS (all files) ===
const common = [
  [/\bHS\b/g, 'Học sinh'],
  [/\bGV\b/g, 'Giáo viên'],
  [/\bSGK\b/g, 'Sách giáo khoa'],
  [/\bSBT\b/g, 'Sách bài tập'],
  [/\bBVMT\b/g, 'Bảo vệ môi trường'],
  [/\bTNXH\b/g, 'Tự nhiên và Xã hội'],
  [/\bPP\b/g, 'Phương pháp'],
  [/\bKN\b/g, 'Kỹ năng'],
  [/\bÂN\b/g, 'Âm nhạc'],
];

// === MATH FILES ===
const mathReplace = [
  [/\bSTP\b/g, 'Số thập phân'],
  [/\bHCN\b/g, 'Hình chữ nhật'],
  [/\bHV\b/g, 'Hình vuông'],
  [/\bPS\b/g, 'Phân số'],
  [/\bCV\b/g, 'Chu vi'],
  [/\bDT\b/g, 'Diện tích'],
  [/\bBT\b/g, 'Bài tập'],
  [/\bKT\b/g, 'Kiểm tra'],
  [/\bND\b/g, 'Nội dung'],
];

// === VIETNAMESE FILES ===
const vietnameseReplace = [
  [/\bLTVC\b/g, 'Luyện từ và câu'],
  [/\bTLV\b/g, 'Tập làm văn'],
  [/\bVB\b/g, 'Văn bản'],
  [/\bDT\b/g, 'Danh từ'],
  [/\bĐT\b/g, 'Động từ'],
  [/\bTT\b/g, 'Tính từ'],
  [/\bTĐ\b/g, 'Tập đọc'],
  [/\bKC\b/g, 'Kể chuyện'],
  [/\bCT\b/g, 'Chính tả'],
  [/\bBT\b/g, 'Bài tập'],
  [/\bND\b/g, 'Nội dung'],
  [/\bKT\b/g, 'Kiểm tra'],
];

// === ETHICS FILES ===
const ethicsReplace = [
  [/\bĐĐ\b/g, 'Đạo đức'],
  [/\bXH\b/g, 'Xã hội'],
  [/\bCC\b/g, 'Công cộng'],
  [/\bPL\b/g, 'Pháp luật'],
  [/\bHĐ\b/g, 'Hoạt động'],
  [/\bTD\b/g, 'Thể dục'],
  [/\bSK\b/g, 'Sức khỏe'],
  [/\bGT\b/g, 'Giao thông'],
  [/\bLD\b/g, 'Lao động'],
  [/\bNL\b/g, 'Người lạ'],
  [/\bKL\b/g, 'Kỷ luật'],
  [/\bTT\b/g, 'Trung thực'],
  [/\bBT\b/g, 'Bài tập'],
  [/\bND\b/g, 'Nội dung'],
  [/\bKT\b/g, 'Kiểm tra'],
  [/\bMT\b/g, 'Môi trường'],
  [/\bTN\b/g, 'Trách nhiệm'],
  [/\bCĐ\b/g, 'Cộng đồng'],
  [/\bCS\b/g, 'Chăm sóc'],
  [/\bGĐ\b/g, 'Gia đình'],
  [/\bBN\b/g, 'Bắt nạt'],
];

// === NATURE / TNXH FILES ===
const natureReplace = [
  [/\bTN\b/g, 'Tự nhiên'],
  [/\bMT\b/g, 'Môi trường'],
  [/\bĐV\b/g, 'Động vật'],
  [/\bTV\b/g, 'Thực vật'],
  [/\bBT\b/g, 'Bài tập'],
  [/\bND\b/g, 'Nội dung'],
  [/\bKT\b/g, 'Kiểm tra'],
  [/\bSK\b/g, 'Sức khỏe'],
];

// === SCIENCE FILES ===
const scienceReplace = [
  [/\bTN\b/g, 'Thí nghiệm'],
  [/\bMT\b/g, 'Môi trường'],
  [/\bKH\b/g, 'Khoa học'],
  [/\bNL\b/g, 'Năng lượng'],
  [/\bBT\b/g, 'Bài tập'],
  [/\bND\b/g, 'Nội dung'],
  [/\bKT\b/g, 'Kiểm tra'],
  [/\bĐV\b/g, 'Động vật'],
  [/\bTV\b/g, 'Thực vật'],
];

// === HISTORY/GEO FILES ===
const histgeoReplace = [
  [/\bTN\b/g, 'Tài nguyên'],
  [/\bMT\b/g, 'Môi trường'],
  [/\bKT\b/g, 'Kinh tế'],
  [/\bXH\b/g, 'Xã hội'],
  [/\bND\b/g, 'Nội dung'],
  [/\bBT\b/g, 'Bài tập'],
  [/\bGT\b/g, 'Giao thông'],
];

// === INFORMATICS FILES ===
const informaticsReplace = [
  [/\bPM\b/g, 'Phần mềm'],
  [/\bMT\b/g, 'Máy tính'],
  [/\bBT\b/g, 'Bài tập'],
  [/\bND\b/g, 'Nội dung'],
  [/\bKT\b/g, 'Kiểm tra'],
];

// === MY THUAT FILES ===
const myThuatReplace = [
  [/\bMT\b/g, 'Mỹ thuật'],
  [/\bBT\b/g, 'Bài tập'],
  [/\bND\b/g, 'Nội dung'],
];

// === EXPAND LESSONS (mixed subjects) ===
const expandReplace = [
  [/\bHCN\b/g, 'Hình chữ nhật'],
  [/\bHV\b/g, 'Hình vuông'],
  [/\bPS\b/g, 'Phân số'],
  [/\bSTP\b/g, 'Số thập phân'],
  [/\bCV\b/g, 'Chu vi'],
  [/\bDT\b/g, 'Diện tích'],
  [/\bVB\b/g, 'Văn bản'],
  [/\bTT\b/g, 'Tính từ'],
  [/\bĐT\b/g, 'Động từ'],
  [/\bMT\b/g, 'Môi trường'],
  [/\bTN\b/g, 'Tự nhiên'],
  [/\bBT\b/g, 'Bài tập'],
  [/\bND\b/g, 'Nội dung'],
  [/\bKT\b/g, 'Kiểm tra'],
];

function getReplacements(filename) {
  const fn = filename.toLowerCase();
  if (fn.startsWith('math')) return mathReplace;
  if (fn.startsWith('vietnam')) return vietnameseReplace;
  if (fn.startsWith('ethics')) return ethicsReplace;
  if (fn.startsWith('nature')) return natureReplace;
  if (fn.startsWith('science')) return scienceReplace;
  if (fn.startsWith('histgeo')) return histgeoReplace;
  if (fn.startsWith('informatics')) return informaticsReplace;
  if (fn.startsWith('mythuat') || fn.startsWith('my_thuat') || fn.startsWith('myThuat')) return myThuatReplace;
  if (fn.startsWith('expand')) return expandReplace;
  if (fn.startsWith('lesson')) return expandReplace; // lessonCards etc.
  return [];
}

// Process
const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.ts'));
let totalReplacements = 0;

for (const file of files) {
  const filePath = path.join(dataDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  const original = content;

  // Apply common replacements first
  for (const [regex, replacement] of common) {
    content = content.replace(regex, replacement);
  }

  // Apply subject-specific replacements
  const specific = getReplacements(file);
  for (const [regex, replacement] of specific) {
    content = content.replace(regex, replacement);
  }

  if (content !== original) {
    // Count changes
    const changes = original.length - content.length; // approximate
    const linesBefore = original.split('\n').length;
    const linesAfter = content.split('\n').length;

    // Count actual regex matches from original
    let matchCount = 0;
    const allRegexes = [...common, ...specific];
    for (const [regex] of allRegexes) {
      const matches = original.match(regex);
      if (matches) matchCount += matches.length;
    }

    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✅ ${file}: ${matchCount} thay thế`);
    totalReplacements += matchCount;
  }
}

console.log(`\n🎯 Tổng: ${totalReplacements} viết tắt đã được thay bằng từ đầy đủ`);
