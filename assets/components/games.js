/* =========================================================================
 * games.js  —  同时支持：
 *   A) 首页卡片小组件（容器 #game-guess）
 *   B) 完整猜数字页面（容器 #guess-app）
 * ========================================================================= */

/* ============================ A) 首页卡片小组件 ============================ */
(() => {
  const card = document.getElementById('game-guess');
  if (!card) return; // 没有首页小组件就跳过本段

  const $ = (sel) => card.querySelector(sel);
  const input    = $('#guess-input');
  const info     = $('#guess-info');
  const history  = $('#guess-history');
  const btnGuess = card.querySelector('[data-role="submit"]');
  const btnReset = card.querySelector('[data-role="reset"]');

  // 游戏状态
  let answer, left, over;

  function init() {
    answer = Math.floor(Math.random() * 100) + 1; // 1~100
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
    info.textContent = `${msg}（答案是 ${answer}）`;
    input.disabled = true;
    btnGuess.disabled = true;
  }

  // 事件绑定
  btnGuess?.addEventListener('click', () => {
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
    if (left <= 0)    return end('😢 次数用完了');

    info.textContent = v < answer
      ? `太小了！还剩 ${left} 次`
      : `太大了！还剩 ${left} 次`;

    input.select();
  });

  input?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') btnGuess?.click();
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      let n = input.value === '' ? 1 : Number(input.value);
      if (!Number.isInteger(n)) n = 1;
      n = e.key === 'ArrowUp' ? n + 1 : n - 1;
      if (n < 1) n = 1; if (n > 100) n = 100;
      input.value = String(n);
    }
  });

  btnReset?.addEventListener('click', init);

  // 初始化
  init();
})();



/* ============================ B) 完整猜数字页面（轻量版） =========================== */
(() => {
  const app = document.getElementById('guess-app');
  if (!app) return;

  const $ = (sel) => app.querySelector(sel);
  const el = {
    form:    $('#guess-form'),
    input:   $('#guess-input'),
    action:  $('#action-btn'),
    feedback:$('#feedback'),
    left:    $('#left'),
    chips:   document.getElementById('history-chips'),
    modal:   document.getElementById('guess-modal'),
    modalText: document.getElementById('modal-text'),
    btnAgain: document.getElementById('btn-again'),
    btnClose: document.getElementById('btn-close')
  };

  // 固定规则：1–100，10次
  const MIN=1, MAX=100, TRIES=10;

  // 状态
  let target = null;
  let triesLeft = 0;
  let started = false;
  let history = []; // {v, tip:'偏小|偏大|命中'}

  // 工具
  const randInt = (a,b)=>Math.floor(Math.random()*(b-a+1))+a;
  const setFeedback = (msg, kind='')=>{
    el.feedback.classList.remove('ok','warn','err');
    if (kind) el.feedback.classList.add(kind);
    el.feedback.textContent = msg;
  };
  const renderLeft = ()=> el.left.textContent = `剩余次数：${triesLeft}`;
  const addChip = (v, tip)=>{
    const span = document.createElement('span');
    span.className = 'chip ' + (tip==='命中' ? 'ok' : tip==='偏小' ? 'low' : 'high');
    span.textContent = `${v} → ${tip}`;
    el.chips.appendChild(span);
    el.chips.scrollLeft = el.chips.scrollWidth;
  };
  const clearChips = ()=> el.chips.innerHTML='';

  // 弹窗
  const openModal = (txt)=>{
    el.modalText.textContent = txt;
    el.modal.classList.add('open');
    el.modal.setAttribute('aria-hidden','false');
  };
  const closeModal = ()=>{
    el.modal.classList.remove('open');
    el.modal.setAttribute('aria-hidden','true');
  };

  // 新局 / 提交：一个按钮两种态
  function startGame(){
    target = randInt(MIN, MAX);
    triesLeft = TRIES;
    started = true;
    history = [];
    clearChips();
    setFeedback('新的一局开始了，祝你好运！','ok');
    renderLeft();
    el.action.textContent = '提交';
    el.input.disabled = false;
    el.input.value = '';
    el.input.focus();
  }

  function submitGuess(){
    const n = Number(el.input.value.trim());
    if (!Number.isInteger(n) || n < MIN || n > MAX){
      setFeedback(`请输入 ${MIN}–${MAX} 的整数。`,'warn');
      el.input.focus(); return;
    }

    triesLeft--;
    const tip = n === target ? '命中' : (n < target ? '偏小' : '偏大');
    history.push({v:n, tip});
    addChip(n, tip);

    if (n === target){
      setFeedback(`🎉 命中！答案是 ${target}，共用 ${history.length} 次。`,'ok');
      renderLeft();
      // 弹窗提示
      openModal(`答案是 ${target}，你用了 ${history.length} 次。`);
      // 锁输入，按钮变为“再来一局”
      el.input.disabled = true;
      el.action.textContent = '再来一局';
      started = false;
      return;
    }

    if (triesLeft <= 0){
      setFeedback(`😵 用尽次数啦！正确答案是 ${target}。`,'err');
      openModal(`很可惜，这局没中。正确答案是 ${target}。`);
      el.input.disabled = true;
      el.action.textContent = '再来一局';
      started = false;
      renderLeft();
      return;
    }

    setFeedback(`你的猜测 ${n} ${tip}，继续！`);
    renderLeft();
    el.input.select();
  }

  // 事件
  el.form.addEventListener('submit', (e)=>{
    e.preventDefault();
    if (!started) startGame(); else submitGuess();
  });
  el.input.addEventListener('keydown', (e)=>{
    if (e.key==='ArrowUp' || e.key==='ArrowDown'){
      e.preventDefault();
      let v = el.input.value===''?MIN:Number(el.input.value);
      if (!Number.isInteger(v)) v = MIN;
      v = e.key==='ArrowUp'? v+1 : v-1;
      if (v<MIN) v=MIN; if (v>MAX) v=MAX;
      el.input.value = String(v);
    }
  });

  // 弹窗按钮
  el.btnAgain.addEventListener('click', ()=>{ closeModal(); startGame(); });
  el.btnClose.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closeModal(); });

  // 初始（未开始态）
  el.input.disabled = true;
  setFeedback('点击“开始游戏”生成目标数字。');
  renderLeft();
})();
