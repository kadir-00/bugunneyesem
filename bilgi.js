const rows = foods.map(f => ({ ...f }));
const body = document.getElementById("foodBody");
const headers = document.querySelectorAll("#foodTable th.sortable");

let sortKey = null;
let sortDir = 1; // 1: küçükten büyüğe, -1: büyükten küçüğe

function render() {
  body.innerHTML = rows.map(f => `
    <tr>
      <td>${f.name}</td>
      <td class="num">${f.calories}</td>
      <td class="num">${f.protein}</td>
    </tr>`).join("");
}

function sortBy(key) {
  sortDir = sortKey === key ? -sortDir : 1;
  sortKey = key;

  rows.sort((a, b) => {
    if (key === "name") return a.name.localeCompare(b.name, "tr") * sortDir;
    return (a[key] - b[key]) * sortDir;
  });

  headers.forEach(h => {
    h.classList.remove("sort-asc", "sort-desc");
    if (h.dataset.key === key) h.classList.add(sortDir === 1 ? "sort-asc" : "sort-desc");
  });
  render();
}

headers.forEach(h => h.addEventListener("click", () => sortBy(h.dataset.key)));
render();
