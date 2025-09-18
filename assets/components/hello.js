(function () {
  // —— 配置 ——
  const STORAGE_KEY = 'checkin_dates_v1';           // 存 yyyy-mm-dd 数组
  const helloSelector = '.hello-btn, .checkin-btn'; // 支持右上角按钮

  // —— DOM 引用 ——
  const modal = document.getElementById('helloModal');
  const grid  = document.getElementById('helloCalGrid');
  const label = document.getElementById('helloCalLabel');
  const prevBtn = document.getElementById('helloCalPrev');
  const nextBtn = document.getElementById('helloCalNext');

  // 若本页未引入 hello.html（如 about/guess/404），直接退出
  if (!modal || !grid || !label || !prevBtn || !nextBtn) return;

  // —— 日期工具 ——
  const pad2 = (n) => (n < 10 ? '0' + n : '' + n);
  const toKey = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
  const fromYMD = (y, m, d) => new Date(y, m, d);

  // 本地存储
  function loadSet() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      return new Set(arr);
    } catch { return new Set(); }
  }
  function saveSet(set) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(set)));
  }

  // 渲染
  let viewYear, viewMonth; // month: 0~11
  function render(y, m, checkedSet) {
    viewYear = y; viewMonth = m;
    label.textContent = `${y} 年 ${m + 1} 月`;
    grid.innerHTML = '';

    const first = new Date(y, m, 1);
    const startWeekday = first.getDay(); // 0(日)~6(六)
    const daysInMonth = new Date(y, m + 1, 0).getDate();

    // 上月残格
    const prevMonthDays = new Date(y, m, 0).getDate();
    for (let i = 0; i < startWeekday; i++) {
      const dayNum = prevMonthDays - startWeekday + i + 1;
      grid.appendChild(buildCell(y, m - 1, dayNum, checkedSet, true));
    }
    // 当月
    for (let d = 1; d <= daysInMonth; d++) {
      grid.appendChild(buildCell(y, m, d, checkedSet, false));
    }
    // 下月补齐
    const total = grid.children.length;
    const need = total % 7 === 0 ? 0 : 7 - (total % 7);
    for (let k = 1; k <= need; k++) {
      grid.appendChild(buildCell(y, m + 1, k, checkedSet, true));
    }
  }

  function buildCell(y, m, d, checkedSet, dim) {
    const date = fromYMD(y, m, d);
    const cell = document.createElement('div');
    cell.className = 'hello-cal__cell' + (dim ? ' hello-cal__cell--dim' : '');
    const key = toKey(date);

    const todayKey = toKey(new Date());
    if (key === todayKey) cell.classList.add('hello-cal__cell--today');
    if (checkedSet.has(key)) cell.classList.add('hello-cal__cell--checked');

    const num = document.createElement('strong');
    num.textContent = date.getDate();
    cell.appendChild(num);

    // 点击切换（允许补签/取消）
    cell.title = checkedSet.has(key) ? '已签到，点击取消' : '未签到，点击签到';
    cell.addEventListener('click', () => {
      if (checkedSet.has(key)) {
        checkedSet.delete(key);
        cell.classList.remove('hello-cal__cell--checked');
        cell.title = '未签到，点击签到';
      } else {
        checkedSet.add(key);
        cell.classList.add('hello-cal__cell--checked');
        cell.title = '已签到，点击取消';
      }
      saveSet(checkedSet);
    });

    return cell;
  }

  // 打开/关闭
  const openModal = () => modal.setAttribute('aria-hidden', 'false');
  const closeModal = () => modal.setAttribute('aria-hidden', 'true');

  modal.addEventListener('click', (e) => {
    if (e.target.dataset.close) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // 上/下月
  prevBtn.addEventListener('click', () => {
    const set = loadSet();
    const d = new Date(viewYear, viewMonth - 1, 1);
    render(d.getFullYear(), d.getMonth(), set);
  });
  nextBtn.addEventListener('click', () => {
    const set = loadSet();
    const d = new Date(viewYear, viewMonth + 1, 1);
    render(d.getFullYear(), d.getMonth(), set);
  });

  // 绑定“签到”触发（右上角按钮/其他按钮）
  document.addEventListener('click', (e) => {
    const btn = e.target.closest(helloSelector);
    if (!btn) return;

    alert('Hi～今天来打个卡！已为你签到 👋');

    const set = loadSet();
    const today = toKey(new Date());
    set.add(today);
    saveSet(set);

    const now = new Date();
    render(now.getFullYear(), now.getMonth(), set);
    openModal();
  });

  // 初始化当月视图（不弹层）
  (function initFirstView() {
    const set = loadSet();
    const now = new Date();
    render(now.getFullYear(), now.getMonth(), set);
  })();
})();
