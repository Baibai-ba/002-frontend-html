/* ========= 猜数字 1–100（独立脚本） ========= */
(() => {
  const app = document.getElementById('guess-app');
  if (!app) return;

  const $ = (s) => app.querySelector(s);
  const el = {
    form: $('#guess-form'),
    input: $('#guess-input'),
    action: $('#action-btn'),
    feedback: $('#feedback'),
    left: $('#left'),
    chips: document.getElementById('history-chips'),
    modal: document.getElementById('guess-modal'),
    modalText: document.getElementById('modal-text'),
    again: document.getElementById('btn-again'),
    close: document.getElementById('btn-close'),
  };

  const MIN = 1, MAX = 100, TRIES = 10;

  let target = null;
  let triesLeft = 0;
  let started = false;

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
  const clearChips = ()=> el.chips.innerHTML = '';

  const openModal = (txt)=>{
    el.modalText.textContent = txt;
    el.modal.classList.add('open');
    el.modal.setAttribute('aria-hidden','false');
  };
  const closeModal = ()=>{
    el.modal.classList.remove('open');
    el.modal.setAttribute('aria-hidden','true');
  };

  function startGame(){
    target = Math.floor(Math.random() * (MAX - MIN + 1)) + MIN;
    triesLeft = TRIES;
    started = true;
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
    addChip(n, tip);

    if (n === target){
      setFeedback(`🎉 命中！答案是 ${target}，共用 ${TRIES - triesLeft} 次。`,'ok');
      openModal(`答案是 ${target}，你用了 ${TRIES - triesLeft} 次。`);
      el.input.disabled = true;
      el.action.textContent = '再来一局';
      started = false;
      renderLeft();
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

  el.again.addEventListener('click', ()=>{ closeModal(); startGame(); });
  el.close.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e)=>{ if (e.key==='Escape') closeModal(); });

  // 初始
  el.input.disabled = true;
  setFeedback('点击“开始游戏”生成目标数字。');
  renderLeft();
})();
