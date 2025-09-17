// 显示年份
document.getElementById("year").textContent = new Date().getFullYear();

// 按钮事件
document.getElementById("sayHiBtn").addEventListener("click", () => {
  document.getElementById("hiMsg").textContent = "你好，很高兴见到你！😃";
});




// ===== 猜数字小游戏 =====
(function () {
  const input = document.getElementById("gg-input");
  const submitBtn = document.getElementById("gg-submit");
  const restartBtn = document.getElementById("gg-restart");
  const hint = document.getElementById("gg-hint");
  const triesLeft = document.getElementById("gg-tries-left");
  const historyList = document.getElementById("gg-history");

  if (!input || !submitBtn) return; // 页面没有该模块时直接跳过

  let secret = rnd();
  let left = 10;
  const guesses = [];

  function rnd() {
    // 1~100
    return Math.floor(Math.random() * 100) + 1;
  }

  function setHint(msg, type = "info") {
    hint.textContent = msg;
    hint.style.color = type === "win" ? "#16a34a"
                      : type === "fail" ? "#dc2626"
                      : type === "warn" ? "#d97706"
                      : "#111";
  }

  function updateHistory() {
    historyList.innerHTML = guesses.map((g, i) => `<li>#${i + 1}：${g}</li>`).join("");
  }

  function lockGame(done) {
    input.disabled = done;
    submitBtn.disabled = done;
    restartBtn.hidden = !done;
  }

  function validate(v) {
    if (!Number.isInteger(v)) return "请输入整数";
    if (v < 1 || v > 100) return "请输入 1~100 的数字";
    return null;
  }

  function onGuess() {
    const v = Number(input.value);
    const err = validate(v);
    if (err) return setHint(err, "warn");

    guesses.push(v);
    updateHistory();

    if (v === secret) {
      setHint(`🎉 猜对了！答案就是 ${secret} ！`, "win");
      lockGame(true);
      return;
    }

    left--;
    triesLeft.textContent = left;

    if (left <= 0) {
      setHint(`😵 游戏结束！正确答案是 ${secret}`, "fail");
      lockGame(true);
      return;
    }

    setHint(v < secret ? "再大一点 ↑" : "再小一点 ↓");
    input.select();
  }

  function restart() {
    secret = rnd();
    left = 10;
    guesses.length = 0;
    triesLeft.textContent = left;
    updateHistory();
    input.value = "";
    setHint("新一局开始啦！你有 10 次机会。");
    lockGame(false);
    input.focus();
  }

  submitBtn.addEventListener("click", onGuess);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") onGuess();
  });
  restartBtn.addEventListener("click", restart);

  // 初始提示
  setHint("我想了一个 1~100 的数字，来猜吧！");
})();
