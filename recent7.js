function recent7(records, today) {
  const parts = today.split('-');
  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);

  const startDateObj = new Date(Date.UTC(year, month - 1, day - 6));
  const startDate = [
    String(startDateObj.getUTCFullYear()).padStart(4, '0'),
    String(startDateObj.getUTCMonth() + 1).padStart(2, '0'),
    String(startDateObj.getUTCDate()).padStart(2, '0')
  ].join('-');

  let totalMinutes = 0;
  let count = 0;
  let hasMissingMinutes = false;
  let hasBigSession = false;

  for (let i = 0; i < records.length; i++) {
    const record = records[i];
    if (record.log_date < startDate || record.log_date > today) {
      continue;
    }

    count += 1;

    if (record.minutes === null) {
      hasMissingMinutes = true;
    } else {
      totalMinutes += record.minutes;
      if (record.minutes >= 180) {
        hasBigSession = true;
      }
    }
  }

  let minutesResult = hasMissingMinutes ? 'X' : totalMinutes;
  if (hasBigSession) {
    minutesResult = minutesResult + ' 絕對是大拇指的啦';
  }

  return {
    minutes: minutesResult,
    count: count
  };
}
