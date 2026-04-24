const fs = require('fs');

function makeSvg(size) {
  const r = Math.round(size * 0.15);
  const f1 = Math.round(size * 0.5);
  const f2 = Math.round(size * 0.1);
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + ' ' + size + '">',
    '  <rect width="' + size + '" height="' + size + '" rx="' + r + '" fill="#F97316"/>',
    '  <text x="50%" y="50%" font-size="' + f1 + '" text-anchor="middle" dominant-baseline="central">&#x1F4DA;</text>',
    '  <text x="50%" y="80%" font-size="' + f2 + '" font-family="Arial,sans-serif" font-weight="bold" fill="white" text-anchor="middle">HHK</text>',
    '</svg>'
  ].join('\n');
}

fs.writeFileSync('public/icon-192.svg', makeSvg(192));
fs.writeFileSync('public/icon-512.svg', makeSvg(512));
console.log('SVG icons created');
