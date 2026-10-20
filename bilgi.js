const grid = document.getElementById("nutrition-grid");
const searchBox = document.getElementById("nutritionSearch");

// Çubuk oranları tariflerdeki en yüksek değere göre hesaplanır.
const maxCalories = Math.max(...recipes.map(r => r.calories));
const maxProtein = Math.max(...recipes.map(r => r.protein));

function nutritionCardHTML(r) {
  const calPct = Math.round((r.calories / maxCalories) * 100);
  const proPct = Math.round((r.protein / maxProtein) * 100);
  return `
    <article class="nutrition-card">
      <div class="nutrition-food">
        ${r.image ? `<img class="nutrition-thumb" src="${r.image}" alt="" loading="lazy" onerror="this.remove()">` : ""}
        <h3>${r.name}</h3>
      </div>
      <div class="nutrition-stats">
        <div class="stat stat-cal">
          <span class="stat-value">🔥 ${r.calories} kcal</span>
          <span class="mini-bar"><span style="width:${calPct}%"></span></span>
        </div>
        <div class="stat stat-pro">
          <span class="stat-value">💪 ${r.protein}g Protein</span>
          <span class="mini-bar"><span style="width:${proPct}%"></span></span>
        </div>
      </div>
    </article>`;
}

const sortHeaders = document.querySelectorAll(".sort-th");
let sortKey = null;
let sortDir = 1; // 1: artan, -1: azalan

function render() {
  const q = norm(searchBox.value);
  const list = recipes.filter(r => norm(r.name).includes(q));
  if (sortKey) list.sort((a, b) => (a[sortKey] - b[sortKey]) * sortDir);
  grid.innerHTML = list.length
    ? list.map(nutritionCardHTML).join("")
    : `<p class="empty">Aramana uyan yemek bulunamadı.</p>`;
}

searchBox.addEventListener("keyup", render);

sortHeaders.forEach(h => h.addEventListener("click", () => {
  const key = h.dataset.key;
  sortDir = sortKey === key ? -sortDir : 1;
  sortKey = key;
  sortHeaders.forEach(x => {
    x.classList.remove("sort-asc", "sort-desc");
    if (x.dataset.key === key) x.classList.add(sortDir === 1 ? "sort-asc" : "sort-desc");
  });
  render();
}));
render();
