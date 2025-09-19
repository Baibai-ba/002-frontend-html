(() => {
  const input = document.getElementById('guess-input');
  const btnSubmit = document.getElementById('btn-submit');
  const btnReset = document.getElementById('btn-reset');
  const tip = document.getElementById('tip');
  const list = document.getElementById('history-list');

  let answer = genAnswer();
  let finished = false;

  function genAnswer(){
    // 生成不重复 4 位数，第一位可为 0（更难）；如需首位不为 0，可从 1-9 开始再补 0-9
    const digits = Array.from({length:10}, (_,i)=>String(i));
    let res = '';
    while(res.length < 4){
      const idx = Math.floor(Math.random() * digits.length);
      const d = digits.splice(idx,1)[0];
      if(!res.includes(d)) res += d;
    }
    // 防止首位为 0 的版本（如需要开启，取消注释即可）
    // if(res[0] === '0'){ return genAnswer(); }
    return res;
  }

  function validateGuess(s){
    if(!/^\d{4}$/.test(s)) return '请输入 4 位数字';
    // 不允许重复
    const set = new Set(s.split(''));
    if(set.size !== 4) return '4 位数字不得重复';
    return '';
  }

  function judge(guess, ans){
    let A = 0, B = 0;
    for(let i=0;i<4;i++){
      if(guess[i] === ans[i]) A++;
      else if(ans.includes(guess[i])) B++;
    }
    return {A, B};
  }

  function addHistoryRow(guess, A, B){
    const li = document.createElement('li');
    const left = document.createElement('span');
    const right = document.createElement('strong');
    left.textContent = guess;
    right.textContent = `${A}A${B}B`;
    li.appendChild(left);
    li.appendChild(right);
    list.prepend(li);
  }

  function submit(){
    if(finished) return;
    const val = input.value.trim();
    const err = validateGuess(val);
    if(err){
      tip.textContent = err;
      tip.classList.remove('good'); tip.classList.add('bad');
      return;
    }
    const {A, B} = judge(val, answer);
    addHistoryRow(val, A, B);

    if(A === 4){
      tip.textContent = `恭喜！猜中答案 ${answer} 🎉`;
      tip.classList.remove('bad'); tip.classList.add('good');
      finished = true;
    }else{
      tip.textContent = `结果：${A}A${B}B`;
      tip.classList.remove('bad','good');
    }
    input.focus(); input.select();
  }

  function reset(){
    answer = genAnswer();
    finished = false;
    tip.textContent = '已重置，开新局！';
    tip.classList.remove('bad','good');
    list.innerHTML = '';
    input.value = '';
    input.focus();
  }

  btnSubmit.addEventListener('click', submit);
  btnReset.addEventListener('click', reset);
  input.addEventListener('keydown', (e) => {
    if(e.key === 'Enter') submit();
  });

  // 便于调试可在控制台查看答案（发布线上请注释）
  // console.log('ANS=', answer);
})();
