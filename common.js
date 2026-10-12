// Tüm sayfalarda kullanılan ortak yardımcılar: kiler, alışveriş listesi, bildirim, kart üretimi.
const PLAN_KEY = "bugunneyesem_plan";
const PANTRY_KEY = "userPantry";
const LEGACY_PANTRY_KEY = "myPantry";

const norm = s => s.toLocaleLowerCase("tr").trim();

function readList(key) {
  try {
    const v = JSON.parse(localStorage.getItem(key));
    return Array.isArray(v) ? v : [];
  } catch (e) {
    return [];
  }
}

const getPlan = () => readList(PLAN_KEY);
const savePlan = plan => localStorage.setItem(PLAN_KEY, JSON.stringify(plan));

// ---- Kiler (localStorage: userPantry) ----
// Sayfa yüklenince kayıtlı veri varsa myPantry'ye aktarılır, yoksa boş dizi olarak başlar.
// Eski sürümde "myPantry" anahtarı kullanıldığı için bir kereliğine oradan taşınır.
const myPantry = (() => {
  if (localStorage.getItem(PANTRY_KEY) !== null) return readList(PANTRY_KEY);
  const legacy = readList(LEGACY_PANTRY_KEY);
  if (legacy.length) localStorage.setItem(PANTRY_KEY, JSON.stringify(legacy));
  return legacy;
})();

const getPantry = () => myPantry;
const savePantry = () => localStorage.setItem(PANTRY_KEY, JSON.stringify(myPantry));

// Malzeme ekler (büyük/küçük harf duyarsız tekrar kontrolü). Eklendiyse true döner.
function addToPantry(ingredient) {
  const raw = String(ingredient || "").trim();
  if (!raw) return false;
  const name = raw.charAt(0).toLocaleUpperCase("tr") + raw.slice(1);
  if (myPantry.some(i => norm(i) === norm(name))) return false;
  myPantry.push(name);
  savePantry();
  return true;
}

// Malzemeyi kilerden çıkarır. Çıkarıldıysa true döner.
function removeFromPantry(ingredient) {
  const idx = myPantry.findIndex(i => norm(i) === norm(String(ingredient || "")));
  if (idx === -1) return false;
  myPantry.splice(idx, 1);
  savePantry();
  return true;
}

// Kilerdeki malzemelerle tarifin malzemelerini kıyaslar: { have: [...], missing: [...] }
function comparePantry(recipe) {
  const pantry = getPantry().map(norm).filter(p => p.length >= 3);
  const have = [];
  const missing = [];
  recipe.ingredients.forEach(ing => {
    const n = norm(ing);
    const found = pantry.some(p => n.includes(p) || p.includes(n));
    (found ? have : missing).push(ing);
  });
  return { have, missing };
}

// Her tarife matchCount, missingIngredients, haveIngredients ekler ve
// eksik sayısı en az olandan en çok olana sıralanmış yeni bir dizi döndürür.
function findMatchingRecipes() {
  return recipes
    .map(recipe => {
      const { have, missing } = comparePantry(recipe);
      return { ...recipe, matchCount: have.length, haveIngredients: have, missingIngredients: missing };
    })
    .sort((a, b) =>
      a.missingIngredients.length - b.missingIngredients.length ||
      a.ingredients.length - b.ingredients.length);
}

// Alışveriş listesine yalnızca verilen (varsayılan: eksik) malzemeleri ekler.
function addMissingToPlan(id, names) {
  const recipe = recipes.find(r => r.id === id);
  if (!recipe) return;
  const toAdd = names && names.length ? names : comparePantry(recipe).missing;
  if (!toAdd.length) {
    toast("Bu tarifin tüm malzemeleri kilerinde var.");
    return;
  }
  const plan = getPlan();
  let entry = plan.find(p => p.id === id);
  if (!entry) {
    entry = { id: recipe.id, name: recipe.name, ingredients: [], checked: [] };
    plan.push(entry);
  }
  const fresh = toAdd.filter(n => !entry.ingredients.includes(n));
  entry.ingredients.push(...fresh);
  savePlan(plan);
  toast(fresh.length ? `${fresh.length} eksik malzeme listeye eklendi.` : "Bu malzemeler zaten listende.");
}

function toast(message, duration = 2200) {
  let el = document.getElementById("toast");
  if (!el) {
    el = document.createElement("div");
    el.id = "toast";
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.classList.remove("show"), duration);
}

function recipeCardHTML(r) {
  const { have, missing } = comparePantry(r);
  const tags = r.tags.map(t => `<span class="tag">${t}</span>`).join("");
  const chips = have.map(i => `<li class="chip has-ingredient">✓ ${i}</li>`).join("") +
                missing.map(i => `<li class="chip missing-ingredient">${i} eksik 😔</li>`).join("");
  const ready = missing.length === 0;
  const info = ready
    ? `<p class="match all-set">Tüm malzemelerimiz tam, hadi pişirelim! 🎉</p>`
    : `<p class="match">${have.length} / ${r.ingredients.length} malzeme kilerde · ${missing.length} eksik</p>`;
  const actions = ready
    ? `<a class="btn btn-ready-to-cook" href="tarif.html?id=${r.id}">Hadi Pişirelim!</a>`
    : `<a class="btn btn-outline" href="tarif.html?id=${r.id}">Tarife Git</a>
        <button class="btn" data-add-missing="${r.id}">Eksikleri Listeye Ekle</button>`;
  return `
    <article class="card">
      ${r.image ? `<img class="recipe-card-img" src="${r.image}" alt="${r.name}" loading="lazy" onerror="this.remove()">` : ""}
      <h3>${r.name}</h3>
      <div class="tags">${tags}</div>
      <ul class="chips">${chips}</ul>
      ${info}
      <div class="card-actions">
        ${actions}
      </div>
    </article>`;
}

// Dinamik üretilen butonlar için olay delegasyonu.
document.addEventListener("click", e => {
  const btn = e.target.closest("[data-add-missing]");
  if (!btn) return;
  const id = Number(btn.dataset.addMissing);
  const names = btn.dataset.ing ? [btn.dataset.ing] : undefined;
  addMissingToPlan(id, names);
});
