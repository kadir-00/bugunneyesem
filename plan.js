const listBox = document.getElementById("planList");
const summaryBox = document.getElementById("summary");

function render() {
  const plan = getPlan();

  if (!plan.length) {
    summaryBox.innerHTML = "";
    listBox.innerHTML = `<p class="empty">Listen boş. <a href="kiler.html">Kilerim</a> sayfasından tarif seçip eksik malzemeleri ekleyebilirsin.</p>`;
    return;
  }

  const totalItems = plan.reduce((sum, p) => sum + p.ingredients.length, 0);
  summaryBox.innerHTML = `
    <span>${plan.length} tarif · Alınacak <strong>${totalItems}</strong> malzeme</span>
    <button class="btn btn-danger" id="clearAll">Listeyi Temizle</button>`;

  // Eksikler yemeğe göre gruplanır: { recipeId, recipeName, missingIngredients, checked }
  const groups = plan.map(p => ({
    recipeId: p.id,
    recipeName: p.name,
    missingIngredients: p.ingredients,
    checked: p.checked
  }));

  listBox.innerHTML = groups.map(g => {
    const done = g.checked.length;
    const pct = Math.round((done / g.missingIngredients.length) * 100);
    const items = g.missingIngredients.map((ing, i) => {
      const got = g.checked.includes(ing);
      return `
      <li>
        <label class="shop-item${got ? " got" : ""}">
          <input type="checkbox" data-recipe="${g.recipeId}" data-ing="${i}" ${got ? "checked" : ""}>
          <span class="shop-name">${ing}</span>
        </label>
      </li>`;
    }).join("");
    return `
      <article class="card plan-card group-card">
        <h3 class="group-title">${g.recipeName} İçin Eksikler</h3>
        <p class="muted">${done} / ${g.missingIngredients.length} malzeme alındı</p>
        <div class="progress"><div style="width:${pct}%"></div></div>
        <ul class="todo shop-list">${items}</ul>
        <div class="card-actions">
          <a class="btn btn-outline" href="tarif.html?id=${g.recipeId}">Tarife Git</a>
          <button class="btn btn-danger" data-remove="${g.recipeId}">Kaldır</button>
        </div>
      </article>`;
  }).join("");
}

listBox.addEventListener("change", e => {
  const box = e.target.closest("input[type=checkbox]");
  if (!box) return;
  const plan = getPlan();
  const item = plan.find(p => p.id === Number(box.dataset.recipe));
  if (!item) return;
  const ing = item.ingredients[Number(box.dataset.ing)];
  item.checked = box.checked
    ? [...new Set([...item.checked, ing])]
    : item.checked.filter(x => x !== ing);
  savePlan(plan);
  render();
});

document.addEventListener("click", e => {
  const rm = e.target.closest("[data-remove]");
  if (rm) {
    savePlan(getPlan().filter(p => p.id !== Number(rm.dataset.remove)));
    render();
  }
  if (e.target.id === "clearAll" && confirm("Tüm liste silinsin mi?")) {
    savePlan([]);
    render();
  }
});

render();
