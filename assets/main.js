// 显示年份
document.getElementById("year").textContent = new Date().getFullYear();

// 按钮事件
document.getElementById("sayHiBtn").addEventListener("click", () => {
  document.getElementById("hiMsg").textContent = "你好，很高兴见到你！😃";
});
