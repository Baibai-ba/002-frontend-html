# 🎮 白霸的小游戏合集 — 项目说明（for Next GPT）

## 📂 项目结构
```
002-frontend-html/
├─ index.html               # 首页：游戏大厅
├─ 404.html                 # 404 页面
│
├─ pages/                   # 各独立小游戏页面
│  ├─ game-guess.html       # 猜数字 (1–100)
│  └─ game-number4.html     # 猜 4 位数 (A/B)
│
├─ components/              # 通用组件 (HTML 模块)
│  ├─ header.html           # 顶部导航
│  ├─ games.html            # 首页游戏列表
│  └─ hello.html            # 签到弹层
│
├─ assets/
│  ├─ base.css              # 全局基础样式 (深色主题 + 变量)
│  ├─ loader.js             # 通用加载器 (data-include 注入组件)
│  └─ components/           # 各游戏 & 组件独立 CSS/JS
│     ├─ game-guess.css
│     ├─ game-guess.js
│     ├─ game-number4.css
│     ├─ game-number4.js
│     └─ hello.css
│
└─ docs/
   └─ toNextGPT.md          # 给下一个窗口的项目说明
```

---

## 🛠️ 开发规范
1. **一个小游戏一对文件**  
   `game-xxx.html` + `game-xxx.css` + `game-xxx.js`
2. **通用组件**放在 `components/`，通过 `loader.js` 自动注入。
3. **样式统一**：全局色彩、排版基于 `assets/base.css` 定义的 CSS 变量。
4. **无依赖**：纯 HTML/CSS/JS，可直接部署到 GitHub Pages。

---

## 🚀 使用方法
1. 克隆仓库：
   ```bash
   git clone https://github.com/Baibai-ba/002-frontend-html.git
   cd 002-frontend-html
   ```
2. 本地直接打开 `index.html` 即可预览（支持现代浏览器）。  
   - 首页会通过 **组件加载器** `loader.js` 自动引入导航、签到弹层。  
   - 每个小游戏页面都有独立的 CSS + JS 文件，互不干扰。  

---

## 💡 使用方法
以后你开新窗口，只要把这份 `toNextGPT.md` 的内容贴给 GPT，它就能立即理解上下文，继续帮你开发。
