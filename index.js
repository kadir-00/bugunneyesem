// "Günün Tarifi" slider: en az malzemeyle yapılan tarifler, otomatik döner.
const featured = [...recipes]
  .sort((a, b) => a.ingredients.length - b.ingredients.length)
  .slice(0, 5);

const photos = {
  1: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=900&q=70"
};

const slider = document.getElementById("slider");
const slideImg = document.getElementById("slideImg");
const slideTitle = document.getElementById("slideTitle");
const slideLink = document.getElementById("slideLink");
const progress = document.getElementById("progress");
let current = 0;
let timer = null;

function showSlide(index) {
  current = (index + featured.length) % featured.length;
  const r = featured[current];
  slideTitle.textContent = `${r.name} - Sadece ${r.ingredients.length} Malzeme!`;
  slideLink.href = `tarif.html?id=${r.id}`;
  const photo = r.image || photos[r.id];
  slideImg.style.backgroundImage = photo ? `url("${photo}")` : "";
  slideImg.textContent = photo ? "" : "🍽️";
  progress.style.width = `${((current + 1) / featured.length) * 100}%`;
}

function restartTimer() {
  clearInterval(timer);
  timer = setInterval(() => showSlide(current + 1), 5000);
}

document.getElementById("prev").addEventListener("click", () => { showSlide(current - 1); restartTimer(); });
document.getElementById("next").addEventListener("click", () => { showSlide(current + 1); restartTimer(); });
slider.addEventListener("mouseenter", () => clearInterval(timer));
slider.addEventListener("mouseleave", restartTimer);

showSlide(0);
restartTimer();

// ---- Hızlı filtreler: seçilen malzeme kiler sayfasında arama kutusuna yazılır ----
document.getElementById("quickFilters").addEventListener("click", e => {
  const chip = e.target.closest("[data-q]");
  if (chip) location.href = `kiler.html?q=${encodeURIComponent(chip.dataset.q)}`;
});

// ---- Rastgele tarif: yalnızca malzemeleri kilerde tam olan tarifler arasından seçer ----
document.getElementById("randomRecipe").addEventListener("click", () => {
  const ready = findMatchingRecipes().filter(r => r.missingIngredients.length === 0);
  if (!ready.length) {
    toast("Şu an dolaptaki malzemelerle tam uyan bir tarif bulamadım. Kiler sayfasına gidip biraz malzeme eklemeye ne dersin?", 5000);
    return;
  }
  const pick = ready[Math.floor(Math.random() * ready.length)];
  location.href = `tarif.html?id=${pick.id}`;
});

// ---- Haftanın kurtarıcısı (sabit vitrin: Menemen) ----
const savior = recipes.find(r => r.id === 2) || recipes[0];
document.getElementById("savior").href = `tarif.html?id=${savior.id}`;
document.getElementById("saviorName").textContent =
  `${savior.name}: ${savior.ingredients.length} malzeme, tek tavada, dakikalar içinde.`;
if (savior.image) document.getElementById("saviorImg").style.backgroundImage = `url("${savior.image}")`;
