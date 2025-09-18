(function () {
  // —— DOM 引用 ——
  const card = document.getElementById('game-guess');
  if (!card) return; // 防御性：组件没加载时直接返回

  const input = card.querySelector('#guess-input');
  const info = card.querySelector('#guess-info');
  const history = card.querySelector('#guess-history');
  const btnGuess = card.querySelector('[data-role="submit"]');
  const btnReset = card.querySelector('[data-role="reset"]');

  // —— 游戏状态 ——
  let answer, left, over;

  function init() {
    answer = Math.floor(Math.random() * 100) + 1;
    left = 10;
    over = false;
    info.textContent = '开始吧！';
    history.textContent = '';
    input.value = '';
    input.disabled = false;
    btnGuess.disabled = false;
    input.focus();
  }

  function end(msg) {
    over = true;
    info.textContent = msg + `（答案是 ${answer}）`;
    input.disabled = true;
    btnGuess.disabled = true;
  }

  // —— 事件 ——  
  btnGuess.addEventListener('click', () => {
    if (over) return;
    const v = Number(input.value);

    if (!Number.isInteger(v) || v < 1 || v > 100) {
      info.textContent = '请输入 1~100 的整数。';
      input.focus();
      return;
    }

    left--;
    history.textContent += (history.textContent ? '，' : '已猜：') + v;

    if (v === answer) return end('🎉 恭喜你猜对了！');
    if (left <= 0) return end('😢 次数用完了');

    info.textContent = v < answer
      ? `太小了！还剩 ${left} 次`
      : `太大了！还剩 ${left} 次`;

    input.select();
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') btnGuess.click();
  });

  btnReset.addEventListener('click', init);

  // 初始化
  init();
})();
