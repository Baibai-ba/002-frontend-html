(async function () {
  // 扫描所有 data-include 占位
  const slots = Array.from(document.querySelectorAll('[data-include]'));
  // 辅助函数：自动判断某个资源是否存在
  async function exists(url) {
    try {
      const res = await fetch(url, { method: 'HEAD' });
      return res.ok;
    } catch {
      return false;
    }
  }

  for (const el of slots) {
    const path = el.getAttribute('data-include');   // e.g. 'components/hello.html'
    const baseName = (path.split('/').pop() || '').replace(/\.html?$/i, ''); // 'hello'

    // 1) 注入 HTML
    try {
      const res = await fetch(path);
      if (!res.ok) throw new Error(`Fetch ${path} ${res.status}`);
      el.innerHTML = await res.text();
    } catch (e) {
      el.innerHTML = `<div style="color:#c00;">无法加载：${path}</div>`;
      console.error(e);
      continue; // 该组件失败就跳过 CSS/JS
    }

    // 2) 自动加载 CSS（如果有）
    const cssUrl = `assets/components/${baseName}.css`;
    if (await exists(cssUrl)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = cssUrl;
      document.head.appendChild(link);
    }

    // 3) 自动加载 JS（如果有）
    const jsUrl = `assets/components/${baseName}.js`;
    if (await exists(jsUrl)) {
      const s = document.createElement('script');
      s.src = jsUrl;
      document.body.appendChild(s);
    }
  }
})();
