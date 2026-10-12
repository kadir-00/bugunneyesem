// Tema: varsayılan koyu (Neo-Cyber). Gündüz modu seçilirse localStorage'da saklanır.
(function () {
  const KEY = "bugunneyesem_theme_v2";
  function stored() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  document.body.classList.toggle("light-mode", stored() === "light");

  document.addEventListener("DOMContentLoaded", () => {
    const btns = document.querySelectorAll("#themeToggle, [data-theme-toggle]");
    if (!btns.length) return;
    const sync = () => btns.forEach(b => b.setAttribute("aria-pressed", String(!document.body.classList.contains("light-mode"))));
    sync();
    btns.forEach(btn => btn.addEventListener("click", () => {
      const light = document.body.classList.toggle("light-mode");
      try { localStorage.setItem(KEY, light ? "light" : "dark"); } catch (e) {}
      sync();
    }));
  });
})();
