// tests.js：照 rules.md 和 README.md 的 addCase 格式撰寫的測試

// ===== 規則 1：日期範圍含今天往前算 7 天，超過 7 天以前不算 =====

addCase({
  name: '規則 1：含今天往前 7 天內（11/17～11/23）的紀錄都要算，含頭尾邊界',
  today: '2026-11-23',
  records: [
    { log_date: '2026-11-17', minutes: 20, topic: 'HTML' },
    { log_date: '2026-11-20', minutes: 30 },
    { log_date: '2026-11-23', minutes: 40 }
  ],
  expect: { minutes: 90, count: 3 }
});

addCase({
  name: '規則 1：超過 7 天以前（11/16）的紀錄不算',
  today: '2026-11-23',
  records: [
    { log_date: '2026-11-16', minutes: 50 },
    { log_date: '2026-11-17', minutes: 25 }
  ],
  expect: { minutes: 25, count: 1 }
});

addCase({
  name: '規則 1：跨月往前算 7 天（3/2 往前含 2/24，不含 2/23）',
  today: '2026-03-02',
  records: [
    { log_date: '2026-02-23', minutes: 60 },
    { log_date: '2026-02-24', minutes: 15 },
    { log_date: '2026-03-02', minutes: 45 }
  ],
  expect: { minutes: 60, count: 2 }
});

// ===== 規則 2：未來日期晚於今天的不算 =====

addCase({
  name: '規則 2：未來日期（晚於今天如 11/24）不算',
  today: '2026-11-23',
  records: [
    { log_date: '2026-11-23', minutes: 30 },
    { log_date: '2026-11-24', minutes: 90 }
  ],
  expect: { minutes: 30, count: 1 }
});

addCase({
  name: '規則 2：只有未來日期時，回傳 0 分鐘 0 筆',
  today: '2026-11-23',
  records: [
    { log_date: '2026-11-24', minutes: 45 },
    { log_date: '2026-12-01', minutes: 60 }
  ],
  expect: { minutes: 0, count: 0 }
});

// ===== 規則 3：沒填分鐘（null）算 1 筆，7 天內有任何一筆為 null 總分鐘回傳 'X' =====

addCase({
  name: '規則 3：7 天內有一筆 minutes 為 null，算 1 筆且總分鐘回傳 X',
  today: '2026-11-23',
  records: [
    { log_date: '2026-11-22', minutes: 30 },
    { log_date: '2026-11-23', minutes: null }
  ],
  expect: { minutes: 'X', count: 2 }
});

addCase({
  name: '規則 3：7 天內全部都是 null，仍照筆數計算且總分鐘回傳 X',
  today: '2026-11-23',
  records: [
    { log_date: '2026-11-20', minutes: null },
    { log_date: '2026-11-23', minutes: null }
  ],
  expect: { minutes: 'X', count: 2 }
});

addCase({
  name: '規則 3：7 天以前或未來的 null 不影響這 7 天的總分鐘',
  today: '2026-11-23',
  records: [
    { log_date: '2026-11-16', minutes: null },
    { log_date: '2026-11-20', minutes: 40 },
    { log_date: '2026-11-24', minutes: null }
  ],
  expect: { minutes: 40, count: 1 }
});

// ===== 規則 4：完全沒有符合的紀錄（或一筆都沒有）回傳 minutes: 0, count: 0 =====

addCase({
  name: '規則 4：完全沒有任何紀錄（空陣列）回傳 minutes 0、count 0',
  today: '2026-11-23',
  records: [],
  expect: { minutes: 0, count: 0 }
});

addCase({
  name: '規則 4：有紀錄但全都不在 7 天內（太舊與未來）回傳 minutes 0、count 0',
  today: '2026-11-23',
  records: [
    { log_date: '2026-11-10', minutes: 60 },
    { log_date: '2026-11-16', minutes: 30 },
    { log_date: '2026-11-25', minutes: 20 }
  ],
  expect: { minutes: 0, count: 0 }
});

// ===== 規則 5：7 天內單筆 minutes >= 180 顯示 '絕對是大拇指的啦' =====

addCase({
  name: '規則 5：單筆剛好 180 分鐘（含 180）也要顯示絕對是大拇指的啦',
  today: '2026-11-23',
  records: [
    { log_date: '2026-11-23', minutes: 180 }
  ],
  expect: { minutes: '180 絕對是大拇指的啦', count: 1 }
});

addCase({
  name: '規則 5：單筆 179 分鐘未達 180，不顯示絕對是大拇指的啦',
  today: '2026-11-23',
  records: [
    { log_date: '2026-11-23', minutes: 179 }
  ],
  expect: { minutes: 179, count: 1 }
});

addCase({
  name: '規則 5：7 天內有多筆 >= 180 分鐘，字樣只顯示一次',
  today: '2026-11-23',
  records: [
    { log_date: '2026-11-21', minutes: 180 },
    { log_date: '2026-11-23', minutes: 200 }
  ],
  expect: { minutes: '380 絕對是大拇指的啦', count: 2 }
});

addCase({
  name: '規則 5：7 天以前或未來的紀錄 >= 180，不觸發字樣',
  today: '2026-11-23',
  records: [
    { log_date: '2026-11-16', minutes: 240 },
    { log_date: '2026-11-22', minutes: 60 },
    { log_date: '2026-11-24', minutes: 300 }
  ],
  expect: { minutes: 60, count: 1 }
});

addCase({
  name: '規則 5：與規則 3（有 null 變 X）同時發生時，仍要顯示絕對是大拇指的啦',
  today: '2026-11-23',
  records: [
    { log_date: '2026-11-22', minutes: 200 },
    { log_date: '2026-11-23', minutes: null }
  ],
  expect: { minutes: 'X 絕對是大拇指的啦', count: 2 }
});

// ===== 規則 6：同一天多筆時 count 算筆數，單筆是否達 180 分開看 =====

addCase({
  name: '規則 6：同一天有多筆紀錄，count 算紀錄筆數且分鐘加總',
  today: '2026-11-23',
  records: [
    { log_date: '2026-11-23', minutes: 30 },
    { log_date: '2026-11-23', minutes: 45 },
    { log_date: '2026-11-23', minutes: 25 }
  ],
  expect: { minutes: 100, count: 3 }
});

addCase({
  name: '規則 6：同一天兩筆各 100 分鐘（合計 200 但單筆未達 180），不觸發字樣',
  today: '2026-11-23',
  records: [
    { log_date: '2026-11-23', minutes: 100 },
    { log_date: '2026-11-23', minutes: 100 }
  ],
  expect: { minutes: 200, count: 2 }
});

// ===== 規則 7：minutes 為 0 算正常有填（算 1 筆、總分鐘加 0，不會變 'X'） =====

addCase({
  name: '規則 7：minutes 為 0 算 1 筆、總分鐘加 0，不會變成 X',
  today: '2026-11-23',
  records: [
    { log_date: '2026-11-23', minutes: 0 }
  ],
  expect: { minutes: 0, count: 1 }
});

addCase({
  name: '規則 7：minutes 為 0 與其他紀錄混合時正常累加',
  today: '2026-11-23',
  records: [
    { log_date: '2026-11-21', minutes: 0 },
    { log_date: '2026-11-23', minutes: 50 }
  ],
  expect: { minutes: 50, count: 2 }
});
