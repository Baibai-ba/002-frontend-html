(function(){
  const modal = document.getElementById('helloModal');
  const grid  = document.getElementById('helloCalGrid');
  const label = document.getElementById('helloCalLabel');
  const btnPrev = document.getElementById('helloCalPrev');
  const btnNext = document.getElementById('helloCalNext');

  // 记录：使用 ISO 日期集合（e.g. "2025-09-19"）
  const KEY = 'checkin.days.v1';

  // —— 工具 —— //
  const pad = n => String(n).padStart(2, '0');
  const fmt = (y,m,d) => `${y}-${pad(m)}-${pad(d)}`;
  const today = new Date();
  const todayStr = fmt(today.getFullYear(), today.getMonth()+1, today.getDate());

  function loadDays(){
    try {
      const raw = localStorage.getItem(KEY);
      const arr = raw ? JSON.parse(raw) : [];
      return new Set(arr);
    } catch { return new Set(); }
  }
  function saveDays(set){
    localStorage.setItem(KEY, JSON.stringify(Array.from(set)));
  }

  let checked = loadDays();

  // 渲染月份
  let curYear = today.getFullYear();
  let curMonth = today.getMonth(); // 0-11

  function render(y, m){
    // 月份标题
    label.textContent = `${y} 年 ${m+1} 月`;

    grid.innerHTML = '';

    // 当月信息
    const first = new Date(y, m, 1);
    const startWeekday = first.getDay(); // 0-6
    const daysInMonth = new Date(y, m+1, 0).getDate();

    // 上月补位
    const prevDays = new Date(y, m, 0).getDate();
    for(let i = startWeekday-1; i >= 0; i--){
      const d = prevDays - i;
      grid.appendChild(cell(y, m-1, d, true));
    }

    // 当月天
    for(let d=1; d<=daysInMonth; d++){
      grid.appendChild(cell(y, m, d, false));
    }

    // 下月补位，直到凑满 7 的倍数
    const total = startWeekday + daysInMonth;
    const tail = (7 - (total % 7)) % 7;
    for(let d=1; d<=tail; d++){
      grid.appendChild(cell(y, m+1, d, true));
    }
  }

  function cell(y, m0Based, d, dim){
    // 修正溢出的月份
    const date = new Date(y, m0Based, d);
    const Y = date.getFullYear();
    const M = date.getMonth() + 1;
    const D = date.getDate();
    const iso = fmt(Y, M, D);

    const div = document.createElement('div');
    div.className = 'hello-cal__cell';
    if (dim) div.classList.add('hello-cal__cell--dim');
    if (iso === todayStr) div.classList.add('hello-cal__cell--today');
    if (checked.has(iso)) div.classList.add('hello-cal__cell--checked');

    const num = document.createElement('strong');
    num.textContent = D;
    num.setAttribute('aria-label', iso);
    div.appendChild(num);

    // 允许补签：点击切换已签到状态（可按需禁用，只允许今天）
    div.addEventListener('click', () => {
      // 如果不允许补签，把下面两行换成： if(iso !== todayStr) return;
      if (checked.has(iso)) {
        checked.delete(iso);
        div.classList.remove('hello-cal__cell--checked');
      } else {
        checked.add(iso);
        div.classList.add('hello-cal__cell--checked');
      }
      saveDays(checked);
    });

    return div;
  }

  // —— 打开/关闭 —— //
  function openModal(){
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    // 自动签到今天（如需手动，把下面两行注释掉）
    if (!checked.has(todayStr)) {
      checked.add(todayStr);
      saveDays(checked);
      // 重新渲染当月（今天可能在不同月）
      curYear = today.getFullYear();
      curMonth = today.getMonth();
      render(curYear, curMonth);
    }
  }
  function closeModal(){
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  modal.addEventListener('click', (e) => {
    const t = e.target;
    if (t && t.dataset && t.dataset.close) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
      closeModal();
    }
  });

  // 绑定右上角“签到”按钮（header 注入后才存在）
  function bindCheckinBtn(){
    const btn = document.querySelector('.checkin-btn');
    if (!btn) return;
    btn.addEventListener('click', openModal, { once:false });
  }

  // 月份切换
  btnPrev?.addEventListener('click', () => {
    curMonth--;
    if (curMonth < 0) { curMonth = 11; curYear--; }
    render(curYear, curMonth);
  });
  btnNext?.addEventListener('click', () => {
    curMonth++;
    if (curMonth > 11) { curMonth = 0; curYear++; }
    render(curYear, curMonth);
  });

  // 初始渲染为“今天所在的月份”
  render(curYear, curMonth);

  // 由于 header/hello 都是异步注入，这里用微小延时与观察器确保绑定
  bindCheckinBtn();
  const mo = new MutationObserver(() => bindCheckinBtn());
  mo.observe(document.documentElement, { childList:true, subtree:true });
})();
