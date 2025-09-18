// assets/loader.js
(async function () {
  const slots = Array.from(document.querySelectorAll('[data-include]'));

  async function exists(url) {
    try {
      const res = await fetch(url, { method: 'HEAD' });
      return res.ok;
    } catch {
      return false;
    }
  }

  for (const el of slots) {
    const includePath = el.getAttribute('data-include'); // e.g. "components/header.html" 或 "../components/header.html"
    const baseName = (includePath.split('/').pop() || '').replace(/\.html?$/i, ''); // "header"

    // 读 data-assets（默认同时加载 css+js）
    const assetsAttr = (el.getAttribute('data-assets') || 'css,js').toLowerCase();
    const wantCSS = assetsAttr.includes('css');
    const wantJS  = assetsAttr.includes('js');

    // 1) 注入 HTML（把 includePath 解析成绝对 URL 再请求）
    let htmlURL;
    try {
      htmlURL = new URL(includePath, location.href);     // 兼容子目录
      const res = await fetch(htmlURL.href);
      if (!res.ok) throw new Error(`Fetch ${includePath} ${res.status}`);
      el.innerHTML = await res.text();
    } catch (e) {
      console.warn(`[include] skip ${includePath}: ${e.message}`);
      continue;
    }

    // 2) 计算 CSS/JS 的正确位置：
    //    已知 htmlURL 指向 ".../components/header.html"
    //    我们要从这个位置回到上一级，再去 "../assets/components/header.css|js"
    const cssURL = new URL(`../assets/components/${baseName}.css`, htmlURL);
    const jsURL  = new URL(`../assets/components/${baseName}.js`,  htmlURL);

    // 3) 按需加载
    if (wantCSS && await exists(cssURL.href)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = cssURL.href;
      document.head.appendChild(link);
    }
    if (wantJS && await exists(jsURL.href)) {
      const s = document.createElement('script');
      s.src = jsURL.href;
      document.body.appendChild(s);
    }
  }
})();

// --- 修正导航链接（本地 / GitHub Pages 自适应）+ 高亮当前页 ---
(function setupNavLinks() {
  const REPO = '002-frontend-html';
  const isGh = location.hostname.endsWith('github.io');
  const basePath = isGh ? `/${REPO}/` : '/';
  const baseURL = new URL(basePath, location.origin);

  function apply() {
    const cur = location.pathname; // 当前路径（不含 ?/#）

    document.querySelectorAll('a[data-href]').forEach(a => {
      const to = a.getAttribute('data-href');            // 如 "pages/guess.html"
      const href = new URL(to, baseURL).pathname;        // 生成标准路径
      a.setAttribute('href', href);
      a.removeAttribute('data-href');

      // === 高亮逻辑 ===
      const isHomeTarget = to.endsWith('index.html');
      const isHomeNow = (cur === basePath || cur === basePath + 'index.html');
      if ((isHomeTarget && isHomeNow) || cur === href) {
        a.classList.add('active');
      }
    });
  }

  // 组件是异步注入的：若此时还没插入 header，就监听一次 DOM 变化
  if (document.querySelector('a[data-href]')) {
    apply();
  } else {
    const mo = new MutationObserver((_, obs) => {
      if (document.querySelector('a[data-href]')) {
        apply();
        obs.disconnect();
      }
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });
  }
})();


// --- 导航：链接修正 + 当前高亮 + 汉堡菜单 ---
(function setupHeaderNav() {
  const REPO = '002-frontend-html';
  const isGh = location.hostname.endsWith('github.io');
  const basePath = isGh ? `/${REPO}/` : '/';
  const baseURL = new URL(basePath, location.origin);

  function init() {
    const header = document.querySelector('.site-header');
    const nav = document.getElementById('site-nav');
    const toggle = document.querySelector('.nav-toggle');

    // 1) 修正 data-href → href（带前缀）
    const curPath = location.pathname.replace(/\/+$/, '');
    nav?.querySelectorAll('a[data-href]').forEach(a => {
      const to = a.getAttribute('data-href');      // e.g. "pages/guess.html"
      const href = new URL(to, baseURL).pathname;  // 生成标准路径
      a.setAttribute('href', href);
      a.removeAttribute('data-href');

      // 2) 当前高亮
      const isHomeTarget = to.endsWith('index.html');
      const isHomeNow = (curPath === basePath.replace(/\/$/, '') || curPath === basePath + 'index.html');
      if ((isHomeTarget && isHomeNow) || curPath === href) {
        a.classList.add('active');
      }
    });

    // 3) 汉堡菜单开关（小屏）
    if (header && toggle && nav) {
      const open = () => {
        header.classList.add('nav-open');
        toggle.setAttribute('aria-expanded', 'true');
      };
      const close = () => {
        header.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
      };
      const toggleMenu = () => {
        header.classList.contains('nav-open') ? close() : open();
      };

      toggle.addEventListener('click', toggleMenu);
      // 点导航链接后关闭
      nav.addEventListener('click', e => {
        const t = e.target;
        if (t && t.tagName === 'A') close();
      });
      // 点空白处关闭
      document.addEventListener('click', e => {
        if (!header.classList.contains('nav-open')) return;
        const within = header.contains(e.target);
        if (!within) close();
      });
      // ESC 关闭
      document.addEventListener('keydown', e => {
        if (e.key === 'Escape') close();
      });
    }
  }

  // 组件是异步注入的：等待 header/nav 出现再初始化
  if (document.querySelector('.site-header') && document.getElementById('site-nav')) {
    init();
  } else {
    const mo = new MutationObserver((_, obs) => {
      if (document.querySelector('.site-header') && document.getElementById('site-nav')) {
        init();
        obs.disconnect();
      }
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });
  }
})();
