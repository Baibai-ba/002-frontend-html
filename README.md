🎮 白霸的小游戏合集
这是一个基于 HTML + CSS + JS 的轻量小游戏合集项目，目前包含以下内容：
🟦 首页：统一入口，展示所有小游戏。
🎲 猜数字 (1–100)：输入数字，系统反馈大小，最多 10 次机会。
🔢 猜 4 位数 (A/B)：系统生成不重复 4 位数，反馈 A/B 直到猜中。
✅ 签到日历：通用组件，可在首页和子页中使用。

🌐 在线试玩
🔗 点击这里体验 GitHub Pages 在线版

📂 项目结构
002-frontend-html/
├─ index.html                  # 首页：游戏大厅
├─ 404.html                    # 404 页面
│
├─ pages/                      # 各独立小游戏页面
│  ├─ game-guess.html          # 猜数字 (1–100)
│  └─ game-number4.html        # 猜 4 位数 (A/B)
│
├─ components/                 # 通用组件 (HTML 模块)
│  ├─ header.html              # 顶部导航
│  ├─ games.html               # 首页游戏列表
│  └─ hello.html               # 签到弹层
│
├─ assets/                     # 全局样式与脚本
│  ├─ base.css                 # 全局深色主题 & 变量
│  ├─ loader.js                # 通用组件加载器
│  ├─ favicon.ico
│  └─ components/              # 各组件/小游戏的独立样式 & JS
│     ├─ header.css
│     ├─ games.css             # 首页游戏列表样式
│     ├─ hello.css             # 签到弹层样式
│     ├─ hello.js              # 签到弹层逻辑
│     ├─ game-guess.css
│     ├─ game-guess.js
│     ├─ game-number4.css
│     └─ game-number4.js
│
└─ docs/
   └─ git-cheatsheet.txt       # Git 使用速查

🚀 使用方法
克隆仓库：
git clone https://github.com/Baibai-ba/002-frontend-html.git
cd 002-frontend-html

本地直接打开 index.html 即可预览（支持现代浏览器）。
首页通过 组件加载器 loader.js 自动引入导航、签到弹层等模块。
每个小游戏页面都有自己的独立 CSS + JS 文件，互不干扰。

🛠 开发规范
一个小游戏一对文件：game-xxx.html + game-xxx.css + game-xxx.js
组件化：通用部分放在 components/，由 loader.js 注入。
样式统一：所有颜色与排版均基于 assets/base.css 中定义的 CSS 变量。
无依赖：纯原生 HTML/CSS/JS，便于部署在 GitHub Pages。

📝 更新日志
v0.3.1
✅ 建立基础项目结构
🎲 添加 猜数字 (1–100) 游戏
🔢 添加 猜 4 位数 (A/B) 游戏
✅ 引入签到日历组件
🎨 统一全局色彩变量与按钮交互样式
🛠 修复 number4 页面签到弹层无法使用的问题

📄 许可证
MIT License