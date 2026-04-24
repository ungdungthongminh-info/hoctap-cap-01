const fs = require('fs');
const path = require('path');

const dataDir = 'src/data';
const files = fs.readdirSync(dataDir).filter((f) => /questions/i.test(f) && f.endsWith('.ts'));
const risky = [];

function evalExpr(s) {
  if (typeof s !== 'string') return null;
  let t = s.trim();
  if (!t) return null;
  if (!/^[0-9.,\s+\-*/xX×÷()]+$/.test(t)) return null;
  t = t.replace(/,/g, '.').replace(/×|x|X/g, '*').replace(/÷/g, '/').replace(/\s+/g, '');
  if (!/^[0-9.+\-*/()]+$/.test(t)) return null;
  try {
    const v = Function('return (' + t + ')')();
    return Number.isFinite(v) ? v : null;
  } catch {
    return null;
  }
}

for (const f of files) {
  const p = path.join(dataDir, f);
  const lines = fs.readFileSync(p, 'utf8').split(/\r?\n/);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.includes("'single_choice'") && !line.includes('"single_choice"')) continue;

    const arrMatch = line.match(/\[(.*?)\]/);
    if (!arrMatch) continue;

    const options = arrMatch[1]
      .split(',')
      .map((x) => x.trim())
      .map((x) => x.replace(/^['\"]|['\"]$/g, ''));

    if (options.length < 2) continue;

    const ansMatch = line.match(/\],\s*['\"]([^'\"]+)['\"]/);
    const answer = ansMatch ? ansMatch[1].trim() : null;

    const norm = (s) => s.toLowerCase().replace(/\s+/g, ' ').trim();
    const normalized = options.map(norm);

    const dupNorm = [...new Set(normalized.filter((v, idx, a) => a.indexOf(v) !== idx))];
    if (dupNorm.length) {
      risky.push({ file: f, line: i + 1, type: 'duplicate_option_text', detail: dupNorm.join(' | '), q: line.trim() });
    }

    if (answer) {
      const answerCount = normalized.filter((v) => v === norm(answer)).length;
      if (answerCount > 1) {
        risky.push({ file: f, line: i + 1, type: 'answer_appears_multiple_times', detail: answer, q: line.trim() });
      }
    }

    const qTextMatch = line.match(/single_choice'\s*,\s*'([^']+)'|single_choice"\s*,\s*"([^"]+)"/);
    const qText = (qTextMatch?.[1] || qTextMatch?.[2] || '').toLowerCase();
    const keyword = /(lớn nhất|lon nhat|bé nhất|be nhat|nhỏ nhất|nho nhat|nhiều nhất|ít nhất|chu vi lớn nhất|diện tích lớn nhất)/.test(qText);

    if (!keyword) continue;

    const vals = options.map(evalExpr);
    if (!vals.every((v) => v !== null)) continue;

    const max = Math.max(...vals);
    const min = Math.min(...vals);

    if (/(lớn nhất|lon nhat|nhiều nhất|chu vi lớn nhất|diện tích lớn nhất)/.test(qText)) {
      const c = vals.filter((v) => v === max).length;
      if (c > 1) {
        risky.push({ file: f, line: i + 1, type: 'tie_for_max', detail: 'max=' + max + ', count=' + c, q: line.trim() });
      }
    }

    if (/(bé nhất|be nhat|nhỏ nhất|nho nhat|ít nhất)/.test(qText)) {
      const c = vals.filter((v) => v === min).length;
      if (c > 1) {
        risky.push({ file: f, line: i + 1, type: 'tie_for_min', detail: 'min=' + min + ', count=' + c, q: line.trim() });
      }
    }
  }
}

const summary = {
  filesScanned: files.length,
  risks: risky.length,
  items: risky.slice(0, 500),
};

fs.writeFileSync('backups/question_scan_risks.json', JSON.stringify(summary, null, 2), 'utf8');
console.log('filesScanned=' + summary.filesScanned);
console.log('risks=' + summary.risks);
console.log('report=backups/question_scan_risks.json');
