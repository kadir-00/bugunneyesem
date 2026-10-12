const content = document.getElementById("content");
const side = document.getElementById("side");
const params = new URLSearchParams(location.search);
const recipe = recipes.find(r => r.id === Number(params.get("id")));

if (!recipe) {
  renderList();
} else {
  document.title = `${recipe.name} – Bugün Ne Yesem?`;
  renderRecipe();
}

// Liste görünümü: solda etiket filtreleri, sağda eksik sayısına göre sıralı cam kartlar.
function renderList() {
  let activeTag = params.get("tag") || "";
  side.innerHTML = `
    <h1 class="doodle-title">Tarifler</h1>
    <p class="lead">Kilerine göre sıralandı: eksiği en az olan en üstte. Etiketle daralt.</p>
    <div class="tags" id="tagFilter"></div>`;
  const tagBox = document.getElementById("tagFilter");
  const allTags = [...new Set(recipes.flatMap(r => r.tags))].sort((x, y) => x.localeCompare(y, "tr"));

  function draw() {
    tagBox.innerHTML = "";
    allTags.forEach(tag => {
      const btn = document.createElement("button");
      btn.className = "btn btn-sm" + (tag === activeTag ? "" : " btn-outline");
      btn.textContent = tag;
      btn.addEventListener("click", () => { activeTag = activeTag === tag ? "" : tag; draw(); });
      tagBox.appendChild(btn);
    });
    const list = findMatchingRecipes().filter(r => !activeTag || r.tags.includes(activeTag));
    content.innerHTML = list.length
      ? `<section class="grid">${list.map(recipeCardHTML).join("")}</section>`
      : `<p class="empty">Bu etikette tarif yok.</p>`;
  }
  draw();
}

function renderRecipe() {
  const { have, missing } = comparePantry(recipe);
  side.innerHTML = `
    <a class="side-link" href="tarif.html">← Tüm tarifler</a>
    <h1 class="doodle-title">${recipe.name}</h1>
    <div class="tags">${recipe.tags.map(t => `<span class="tag">${t}</span>`).join("")}</div>
    <p class="match">${have.length} / ${recipe.ingredients.length} malzeme kilerinde.
      <a class="side-link" href="kiler.html">Kilerini düzenle</a></p>`;

  content.innerHTML = `
    ${recipe.image ? `<img class="recipe-detail-img" src="${recipe.image}" alt="${recipe.name}" onerror="this.remove()">` : ""}

    <section class="panel">
      <h2>Malzemeler</h2>
      <div class="portion-control">
        <span class="muted">Kişi Sayısı</span>
        <button class="btn btn-outline round" id="minus" aria-label="Kişi sayısını azalt">−</button>
        <span class="count" id="portion"></span>
        <button class="btn btn-outline round" id="plus" aria-label="Kişi sayısını artır">+</button>
      </div>
      <table>
        <thead><tr><th>Malzeme</th><th class="num">Miktar</th><th>Durum</th></tr></thead>
        <tbody id="rows"></tbody>
      </table>
      ${missing.length
        ? `<p><button class="btn" data-add-missing="${recipe.id}">Tüm Eksikleri Alışveriş Listesine Ekle</button></p>`
        : `<p class="all-set">Tüm malzemeler kilerinde ✓</p>`}
    </section>

    <section class="panel">
      <h2>Yapılışı</h2>
      <div class="step-box" id="stepText"></div>
      <div class="step-nav">
        <button class="btn btn-outline" id="prev">← Geri</button>
        <span class="step-counter" id="stepCount"></span>
        <button class="btn" id="next">İleri →</button>
      </div>
    </section>`;

  setupPortions(new Set(missing));
  setupSteps();
}

function formatAmount([qty, unit], ratio) {
  const n = Math.round(qty * ratio * 10) / 10;
  return `${n.toLocaleString("tr-TR", { maximumFractionDigits: 1 })} ${unit}`;
}

function setupPortions(missingSet) {
  let portion = recipe.basePortion;
  const MAX = 20;

  function update() {
    const ratio = portion / recipe.basePortion;
    document.getElementById("portion").textContent = `${portion} Kişilik`;
    document.getElementById("rows").innerHTML = recipe.ingredients.map((name, i) => {
      const miss = missingSet.has(name);
      const status = miss
        ? `<span class="chip missing-ingredient">✗ Eksik</span> <button class="btn btn-sm" data-add-missing="${recipe.id}" data-ing="${name}">Alışveriş Listesine Ekle</button>`
        : `<span class="chip has-ingredient">✓ Kilerde</span>`;
      return `<tr class="${miss ? "row-miss" : "row-have"}"><td>${name}</td><td class="num">${formatAmount(recipe.amounts[i], ratio)}</td><td>${status}</td></tr>`;
    }).join("");
    document.getElementById("minus").disabled = portion <= 1;
    document.getElementById("plus").disabled = portion >= MAX;
  }

  document.getElementById("minus").addEventListener("click", () => { portion--; update(); });
  document.getElementById("plus").addEventListener("click", () => { portion++; update(); });
  update();
}

function setupSteps() {
  let step = 0;
  const text = document.getElementById("stepText");
  const count = document.getElementById("stepCount");
  const prev = document.getElementById("prev");
  const next = document.getElementById("next");

  // Kapanış mesajı tüm tariflere otomatik eklenir; data.js'e yazılmaz.
  const steps = [...recipe.steps, "Yemek hazır, afiyet olsun! 🍽️"];
  const last = steps.length - 1;

  function show() {
    text.textContent = step === last ? steps[step] : `${step + 1}. ${steps[step]}`;
    count.textContent = step === last ? "Afiyet olsun!" : `Adım ${step + 1} / ${last}`;
    prev.disabled = step === 0;
    next.disabled = step === last;
  }

  prev.addEventListener("click", () => { step--; show(); });
  next.addEventListener("click", () => { step++; show(); });
  show();
}
