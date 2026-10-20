const pantryInput = document.getElementById("pantryInput");
const pantryChips = document.getElementById("pantryChips");
const searchInput = document.getElementById("search");
const resultsBox = document.getElementById("results");
const infoBox = document.getElementById("info");
const tagBox = document.getElementById("tagFilter");

let activeTag = new URLSearchParams(location.search).get("tag") || "";

// ---- Kişisel kiler ----
const SHELF_SIZE = 3;
const MIN_SHELVES = 3;

// Malzemeleri raflara (satırlara) dizer; boş raflar da gösterilir.
function renderPantry() {
  const shelves = [];
  for (let i = 0; i < myPantry.length; i += SHELF_SIZE) shelves.push(myPantry.slice(i, i + SHELF_SIZE));
  while (shelves.length < MIN_SHELVES) shelves.push([]);
  const html = shelves.map(items => `
    <div class="shelf">${items.map(it => `
      <span class="shelf-item">${it}
        <button class="chip-x" data-remove="${it}" aria-label="${it} malzemesini sil">×</button>
      </span>`).join("")}</div>`).join("");
  pantryChips.innerHTML = html +
    (myPantry.length ? "" : `<p class="muted fridge-empty">Kilerin boş. Malzeme ekleyince raflara dizilir.</p>`);
  updateSidebar();
}

// Sol kolon: özet metni ve hızlı ekle butonlarının durumu.
function updateSidebar() {
  const inPantry = new Set(myPantry.map(norm));
  document.getElementById("pantryCount").textContent = myPantry.length
    ? `Dolabında şu an ${myPantry.length} malzeme var`
    : "Dolabın şu an boş";
  document.getElementById("clearPantry").disabled = myPantry.length === 0;
  document.querySelectorAll("#quickAddList [data-add]").forEach(btn => {
    const has = inPantry.has(norm(btn.dataset.add));
    btn.disabled = has;
    btn.querySelector(".plus").textContent = has ? "✓" : "+";
  });
}

document.getElementById("quickAddList").addEventListener("click", e => {
  const btn = e.target.closest("[data-add]");
  if (!btn || btn.disabled) return;
  addToPantry(btn.dataset.add);
  renderPantry();
  render();
});

document.getElementById("clearPantry").addEventListener("click", () => {
  if (!myPantry.length || !confirm("Tüm kileri silmek istediğine emin misin?")) return;
  myPantry.length = 0;
  savePantry();
  renderPantry();
  render();
});

pantryChips.addEventListener("click", e => {
  const btn = e.target.closest("[data-remove]");
  if (!btn) return;
  removeFromPantry(btn.dataset.remove);
  renderPantry();
  render();
});

document.getElementById("pantryForm").addEventListener("submit", e => {
  e.preventDefault();
  pantryInput.value.split(",").forEach(addToPantry);
  pantryInput.value = "";
  clearSuggestions();
  renderPantry();
  render();
});

// ---- Otomatik tamamlama ----
const autocompleteList = document.getElementById("autocomplete-list");
const allIngredients = [...new Set(recipes.flatMap(r => r.ingredients))]
  .sort((a, b) => a.localeCompare(b, "tr"));

function clearSuggestions() {
  autocompleteList.innerHTML = "";
}

pantryInput.addEventListener("input", e => {
  // Virgülle ayrılmış girdide yalnızca son parça aranır.
  const query = norm(e.target.value.split(",").pop());
  clearSuggestions();
  if (!query) return;
  const inPantry = new Set(myPantry.map(norm));
  allIngredients
    .filter(ing => norm(ing).includes(query) && !inPantry.has(norm(ing)))
    .forEach(ing => {
      const li = document.createElement("li");
      li.textContent = ing;
      autocompleteList.appendChild(li);
    });
});

autocompleteList.addEventListener("click", e => {
  const li = e.target.closest("li");
  if (!li) return;
  pantryInput.value = li.textContent;
  clearSuggestions();
  addToPantry(li.textContent);
  pantryInput.value = "";
  renderPantry();
  render();
});

// Dışarı tıklanınca öneriler kapanır.
document.addEventListener("click", e => {
  if (!e.target.closest(".autocomplete-wrap")) clearSuggestions();
});

// ---- Tarif listesi ----
function renderTags() {
  const allTags = [...new Set(recipes.flatMap(r => r.tags))].sort((a, b) => a.localeCompare(b, "tr"));
  tagBox.innerHTML = "";
  allTags.forEach(tag => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn-sm" + (tag === activeTag ? "" : " btn-outline");
    btn.setAttribute("aria-pressed", String(tag === activeTag));
    btn.textContent = tag;
    btn.addEventListener("click", () => {
      activeTag = activeTag === tag ? "" : tag;
      renderTags();
      render();
    });
    tagBox.appendChild(btn);
  });
}

function render() {
  const terms = searchInput.value.split(",").map(norm).filter(Boolean);

  // Tüm tarifler listelenir; arama ve etiket yalnızca kullanıcı seçerse daraltır.
  // findMatchingRecipes() eksik sayısına göre sıralı gelir; burada yalnızca filtrelenir.
  const list = findMatchingRecipes()
    .filter(r => !activeTag || r.tags.includes(activeTag))
    .filter(r => {
      const hay = [r.name, ...r.ingredients].map(norm);
      return terms.every(t => hay.some(h => h.includes(t)));
    });

  if (!list.length) {
    resultsBox.innerHTML = `<p class="empty">Aramana uyan tarif bulunamadı.</p>`;
    infoBox.textContent = "";
    return;
  }
  infoBox.textContent = `${list.length} tarif · en az eksiği olanlar üstte.`;
  resultsBox.innerHTML = list.map(recipeCardHTML).join("");
}

// Ana sayfadaki hızlı filtrelerden gelen ?q= değeri arama kutusuna yazılır.
const initialQuery = new URLSearchParams(location.search).get("q");
if (initialQuery) searchInput.value = initialQuery;

searchInput.addEventListener("input", render);
renderTags();
renderPantry();
render();

// Kategori veya hızlı filtreden gelindiyse sayfa doğrudan tarif kartlarına kaydırılır.
if (activeTag || initialQuery) {
  document.getElementById("recipesTitle").scrollIntoView({ behavior: "smooth", block: "start" });
}
