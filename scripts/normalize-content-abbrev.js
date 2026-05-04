const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'src', 'data');

const replacements = [
  [/\bVD\b/g, 'Ví dụ'],
  [/\bKQ\b/g, 'Kết quả'],
  [/\bSĐT\b/g, 'Số điện thoại'],
  [/\bPCCC\b/g, 'phòng cháy chữa cháy'],
  [/\bVQG\b/g, 'Vườn quốc gia'],
  [/\bBYT\b/g, 'Bộ Y tế'],
  [/\bWHO\b/g, 'Tổ chức Y tế Thế giới'],
  [/\bBV\s+TE\b/g, 'bảo vệ trẻ em'],
  [/\bCTNC\b/g, 'công thức nâng cao'],
  [/di sản TG/gi, 'di sản thế giới'],
  [/nhất TG/gi, 'nhất thế giới'],
  [/Hòa bình TG/gi, 'Hòa bình thế giới'],
  [/ở TG/gi, 'ở thế giới'],
  [/\bTG\b/g, 'thời gian'],
  [/\bATGT\b/g, 'an toàn giao thông'],
  [/\bAT\b/g, 'an toàn'],
  [/\bMXH\b/g, 'mạng xã hội'],
  [/\bTQ\b/g, 'Tổ quốc'],
  [/\bHP\b/g, 'hòa bình'],
  [/\bBC\b/g, 'báo cáo'],
  [/Đ\.vị/g, 'đơn vị'],
  [/đ\.vị/g, 'đơn vị'],
  [/\bSắC\b/g, 'Sắc'],
];

function processFile(filePath) {
  const original = fs.readFileSync(filePath, 'utf8');
  let content = original;
  let count = 0;

  for (const [regex, replacement] of replacements) {
    const matches = content.match(regex);
    if (matches) {
      count += matches.length;
      content = content.replace(regex, replacement);
    }
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
  }

  return count;
}

function main() {
  const files = fs.readdirSync(dataDir).filter((name) => name.endsWith('.ts'));
  let total = 0;
  let changedFiles = 0;

  for (const file of files) {
    const fullPath = path.join(dataDir, file);
    const count = processFile(fullPath);
    if (count > 0) {
      changedFiles += 1;
      total += count;
      console.log(`Updated ${file}: ${count}`);
    }
  }

  console.log(`Done. changedFiles=${changedFiles}, totalReplacements=${total}`);
}

main();
