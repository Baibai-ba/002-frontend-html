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
