document.getElementById("year").textContent = new Date().getFullYear();
document.getElementById("helloBtn").addEventListener("click", () => {
  document.getElementById("msg").textContent = "🎯 JS 运行成功！";
});
