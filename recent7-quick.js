// recent7-quick.js：對照用。只用一句話請 AI 寫的版本放這裡。
// 函式名稱一樣叫 recent7，輸入、輸出的格式跟 recent7.js 一樣（見 README.md）。

function recent7(records, today) {
  if (!Array.isArray(records) || !today) {
    return { minutes: 0, count: 0 };
  }

  function parseDateUTC(dateStr) {
    const parts = String(dateStr).split('-').map(Number);
    if (parts.length !== 3 || parts.some(Number.isNaN)) {
      return null;
    }
    return Date.UTC(parts[0], parts[1] - 1, parts[2]);
  }

  const todayMs = parseDateUTC(today);
  if (todayMs === null) {
    return { minutes: 0, count: 0 };
  }

  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  let totalMinutes = 0;
  let count = 0;

  for (let i = 0; i < records.length; i++) {
    const rec = records[i];
    if (!rec || !rec.log_date) continue;

    const recMs = parseDateUTC(rec.log_date);
    if (recMs === null) continue;

    const diffDays = (todayMs - recMs) / MS_PER_DAY;
    if (diffDays >= 0 && diffDays < 7) {
      count += 1;
      if (typeof rec.minutes === 'number' && !Number.isNaN(rec.minutes)) {
        totalMinutes += rec.minutes;
      }
    }
  }

  return { minutes: totalMinutes, count: count };
}
