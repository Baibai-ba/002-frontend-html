// assets/loader.js
// === 组件注入（data-include）+ 按需加载对应 CSS/JS（去重/健壮路径） ===
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

  function hasAsset(tag, hrefOrSrc) {
    const selector =
      tag === 'link'
        ? `link[rel="stylesheet"][href="${hrefOrSrc}"]`
        : `script[src="${hrefOrSrc}"]`;
    return !!document.head.querySelector(selector) || !!document.body.querySelector(selector);
  }

  for (const el of slots) {
    const includePath = el.getAttribute('data-include'); // 如 "components/header.html" 或 "../components/header.html"
    if (!includePath) continue;

    // 1) 注入 HTML（使用 URL 解析保证在子目录/不同页面也能正确拼路径）
    let htmlURL;
    try {
      htmlURL = new URL(includePath, location.href); // 解析为绝对 URL
      const res = await fetch(htmlURL.href);
      if (!res.ok) throw new Error(`Fetch ${includePath} ${res.status}`);
      el.innerHTML = await res.text();
    } catch (e) {
      console.warn(`[include] skip ${includePath}: ${e.message}`);
      continue;
    }

    // 2) 读取 data-assets 配置：
    //    - 默认 "css,js"
    //    - 若含 "none" 则两者都不加载
    const assetsAttr = (el.getAttribute('data-assets') || 'css,js').toLowerCase();
    const wantNone = assetsAttr.includes('none');
    const wantCSS = !wantNone && assetsAttr.includes('css');
    const wantJS  = !wantNone && assetsAttr.includes('js');

    // 3) 更稳的 baseName：用解析后的 pathname 提取文件名（避免 query/hash 干扰）
    //      e.g. ".../components/header.html" -> "header"
    const pathname = htmlURL.pathname; 
    const baseName = (pathname.split('/').pop() || '').replace(/\.html?$/i, '');

    // 4) 计算 CSS/JS 的正确位置（与你的仓库结构保持一致）：
    //    组件 HTML 在 components/ 下，对应资源在 ../assets/components/ 下
    const cssURL = new URL(`../assets/components/${baseName}.css`, htmlURL);
    const jsURL  = new URL(`../assets/components/${baseName}.js`,  htmlURL);

    // 5) 按需加载（带去重 + 存在性检测）
    if (wantCSS && !hasAsset('link', cssURL.href) && await exists(cssURL.href)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = cssURL.href;
      document.head.appendChild(link);
    }
    if (wantJS && !hasAsset('script', jsURL.href) && await exists(jsURL.href)) {
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
    const cur = location.pathname.replace(/\/+$/, ''); // 标准化当前路径

    document.querySelectorAll('a[data-href]').forEach(a => {
      const to = a.getAttribute('data-href');            // 如 "pages/guess.html" 或 "index.html"
      const href = new URL(to, baseURL).pathname.replace(/\/+$/, '');
      a.setAttribute('href', href);
      a.removeAttribute('data-href');

      // === 高亮逻辑 ===
      const isHomeTarget = /(?:^|\/)index\.html$/.test(to);
      const isHomeNow = (cur === basePath.replace(/\/$/, '') || cur === (basePath + 'index.html').replace(/\/+$/, ''));
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

    // 1) 修正 data-href → href（带前缀）+ 高亮
    const curPath = location.pathname.replace(/\/+$/, '');
    nav?.querySelectorAll('a[data-href]').forEach(a => {
      const to = a.getAttribute('data-href');
      const href = new URL(to, baseURL).pathname.replace(/\/+$/, '');
      a.setAttribute('href', href);
      a.removeAttribute('data-href');

      const isHomeTarget = /(?:^|\/)index\.html$/.test(to);
      const isHomeNow = (curPath === basePath.replace(/\/$/, '') || curPath === (basePath + 'index.html').replace(/\/+$/, ''));
      if ((isHomeTarget && isHomeNow) || curPath === href) {
        a.classList.add('active');
      }
    });

    // 2) 汉堡菜单开关（小屏）
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
