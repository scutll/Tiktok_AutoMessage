(() => {
  // 1. 抓取
  const rows = [...document.querySelectorAll('a[href^="/@"]')]
    .map(a => {
      const card = a.closest('[data-e2e="search-user-list"]') || a.closest('div');
      // 用户名：去掉 @
      const user = a.href.split('/').pop().replace(/^@/, '');
      // 数字 + 单位(可选) + “粉丝/followers”
      const txt = card?.textContent || '';
      const m = txt.match(/(\d[\d,.]*[KkMm]?)\s*(?:粉丝|followers?)/i);
      return m ? { user, fans: m[1] } : null;
    })
    .filter(Boolean);

  // 2. 去重
  const unique = [...new Map(rows.map(r => [r.user, r])).values()];

  // 3. 导出 CSV
  const csv = ['username,fans', ...unique.map(r => `${r.user},${r.fans}`)].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'tiktok_jojo_users.csv';
  a.click();

  console.log(`✅ 已导出 ${unique.length} 条记录`);
})();