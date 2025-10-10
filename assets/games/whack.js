(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const root = $('#whack');
  if (!root) return;

  const elTime = $('#wh-time');
  const elScore = $('#wh-score');
  const elBest = $('#wh-best');
  const btnStart = $('#wh-start');
  const btnStop = $('#wh-stop');
  const holes = $$('.hole', root);
  const storeKey = 'whack_best_score_v1';

  let state = { playing: false, timeLeft: 30, score: 0, timerId: null, moleTimerId: null, activeIndex: -1 };

  elBest.textContent = localStorage.getItem(storeKey) || '0';

  function setActive(index) {
    holes.forEach(h => h.classList.remove('active'));
    state.activeIndex = index;
    if (index >= 0) holes[index].classList.add('active');
  }

  function randomPop() {
    if (!state.playing) return;
    const idx = Math.floor(Math.random() * holes.length);
    setActive(idx);
    const nextIn = 800 + Math.random() * 400;
    state.moleTimerId = setTimeout(() => {
      setActive(-1);
      setTimeout(randomPop, 120 + Math.random() * 140);
    }, nextIn);
  }

  function updateHud() {
    elTime.textContent = state.timeLeft;
    elScore.textContent = state.score;
  }

  function startGame() {
    if (state.playing) return;
    state.playing = true;
    state.timeLeft = 30;
    state.score = 0;
    updateHud();
    btnStart.disabled = true;
    btnStop.disabled = false;
    randomPop();
    state.timerId = setInterval(() => {
      state.timeLeft--;
      updateHud();
      if (state.timeLeft <= 0) endGame();
    }, 1000);
  }

  function endGame() {
    if (!state.playing) return;
    state.playing = false;
    clearInterval(state.timerId);
    clearTimeout(state.moleTimerId);
    setActive(-1);
    btnStart.disabled = false;
    btnStop.disabled = true;
    const best = Number(localStorage.getItem(storeKey) || '0');
    if (state.score > best) {
      localStorage.setItem(storeKey, String(state.score));
      elBest.textContent = String(state.score);
      alert(`时间到！本局：${state.score}（新纪录！）`);
    } else {
   (() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const root = $('#whack');
  if (!root) return;

  const elTime = $('#wh-time');
  const elScore = $('#wh-score');
  const elBest = $('#wh-best');
  const btnStart = $('#wh-start');
  const btnStop = $('#wh-stop');
  const holes = $$('.hole', root);
  const storeKey = 'whack_best_score_v1';

  let state = { playing: false, timeLeft: 30, score: 0, timerId: null, moleTimerId: null, activeIndex: -1 };

  elBest.textContent = localStorage.getItem(storeKey) || '0';

  function setActive(index) {
    holes.forEach(h => h.classList.remove('active'));
    state.activeIndex = index;
    if (index >= 0) holes[index].classList.add('active');
  }

  function randomPop() {
    if (!state.playing) return;
    const idx = Math.floor(Math.random() * holes.length);
    setActive(idx);
    const nextIn = 800 + Math.random() * 400;
    state.moleTimerId = setTimeout(() => {
      setActive(-1);
      setTimeout(randomPop, 120 + Math.random() * 140);
    }, nextIn);
  }

  function updateHud() {
    elTime.textContent = state.timeLeft;
    elScore.textContent = state.score;
  }

  function startGame() {
    if (state.playing) return;
    state.playing = true;
    state.timeLeft = 30;
    state.score = 0;
    updateHud();
    btnStart.disabled = true;
    btnStop.disabled = false;
    randomPop();
    state.timerId = setInterval(() => {
      state.timeLeft--;
      updateHud();
      if (state.timeLeft <= 0) endGame();
    }, 1000);
  }

  function endGame() {
    if (!state.playing) return;
    state.playing = false;
    clearInterval(state.timerId);
    clearTimeout(state.moleTimerId);
    setActive(-1);
    btnStart.disabled = false;
    btnStop.disabled = true;
    const best = Number(localStorage.getItem(storeKey) || '0');
    if (state.score > best) {
      localStorage.setItem(storeKey, String(state.score));
      elBest.textContent = String(state.score);
      alert(`时间到！本局：${state.score}（新纪录！）`);
    } else {
      alert(`时间到！本局：${state.score}，最高：${best}`);
    }
  }

  holes.forEach((hole, i) => {
    hole.addEventListener('click', () => {
      if (!state.playing) return;
      if (state.activeIndex === i) {
        state.score++;
        updateHud();
        setActive(-1);
      }
    });
  });

  window.addEventListener('keydown', (e) => {
    if (!state.playing) return;
    const key = e.key;
    if (key >= '1' && key <= '9') {
      const idx = Number(key) - 1;
      if (state.activeIndex === idx) {
        state.score++;
        updateHud();
        setActive(-1);
      }
    }
  });

  btnStart.addEventListener('click', startGame);
  btnStop.addEventListener('click', endGame);
})();
   alert(`时间到！本局：${state.score}，最高：${best}`);
    }
  }

  holes.forEach((hole, i) => {
    hole.addEventListener('click', () => {
      if (!state.playing) return;
      if (state.activeIndex === i) {
        state.score++;
        updateHud();
        setActive(-1);
      }
    });
  });

  window.addEventListener('keydown', (e) => {
    if (!state.playing) return;
    const key = e.key;
    if (key >= '1' && key <= '9') {
      const idx = Number(key) - 1;
      if (state.activeIndex === idx) {
        state.score++;
        updateHud();
        setActive(-1);
      }
    }
  });

  btnStart.addEventListener('click', startGame);
  btnStop.addEventListener('click', endGame);
})();
