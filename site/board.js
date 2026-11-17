// Stage/category board. Reads one file: data.json, written by `python3 scripts/sb.py build`.
// No framework, no build step. Open ?data=example/data.json for the example instance.

const VERDICTS = ["adopt", "adapt", "merge", "reject", "split", "pending"];
const CHIPS_PER_CATEGORY = 24;
const $ = (id) => document.getElementById(id);

let DATA = null;
const state = { q: "", who: "team", verdicts: new Set(VERDICTS), open: "", expanded: new Set() };

main();

async function main() {
  const src = new URLSearchParams(location.search).get("data") || "data.json";
  const res = await fetch(src);
  if (!res.ok) {
    $("board").textContent = `No ${src}. Run: python3 scripts/sb.py build`;
    return;
  }
  DATA = await res.json();

  readHash();
  setupControls();
  render();
  window.addEventListener("hashchange", () => { readHash(); render(); });
}


// ------------------------------------------------------------ render

function render() {
  document.title = DATA.meta.title + " board";
  $("title").textContent = DATA.meta.title;
  renderFunnel();
  renderBoard();
  renderOrder();
  $("foot").innerHTML = `Generated ${DATA.meta.generated}. ` +
    (DATA.meta.repo_url ? `<a href="${DATA.meta.repo_url}">Source and markdown tables</a>.` : "");
  if (state.open) openDetail(state.open);
}

function renderFunnel() {
  const c = DATA.meta.counts;
  const n = (k) => c[k] || 0;
  const parts = [
    ["inventory", DATA.meta.total], ["unscreened", n("unscreened")], ["out", n("out")], ["dup", n("dup")],
    ["variant", n("variant")], ["scoped", n("scoped") + n("screened")],
    ["in review", n("in-review") + n("postponed")], ["reviewed", n("reviewed")],
  ];
  $("funnel").innerHTML = parts.map(([k, v]) => `<b>${v}</b> ${k}`).join(" → ");
}

function renderBoard() {
  const visible = DATA.skills.filter(matches);
  $("board").innerHTML = DATA.stages.map((stage) => {
    const inStage = visible.filter((s) => s.stage === stage.stage);
    const cats = DATA.categories.filter((c) => c.stage === stage.stage).map((cat) => {
      const chips = inStage.filter((s) => s.category === cat.category);
      if (!chips.length) return "";
      const key = stage.stage + "/" + cat.category;
      const shown = state.expanded.has(key) ? chips : chips.slice(0, CHIPS_PER_CATEGORY);
      const more = chips.length - shown.length;
      return `<details class="cat" open>
        <summary>${esc(cat.name)} <small>${chips.length}</small></summary>
        <p>${esc(cat.blurb)}</p>
        <div class="chips">${shown.map(chip).join("")}
          ${more > 0 ? `<button class="more" data-expand="${key}">+${more} more</button>` : ""}</div>
      </details>`;
    }).join("");
    const gap = stage.not_covered ? `<p class="gap"><b>Not covered:</b> ${esc(stage.not_covered)}</p>` : "";
    return `<section class="stage"><h2>${esc(stage.name)} <small>${inStage.length}</small></h2>${gap}${cats}</section>`;
  }).join("");
}

function chip(s) {
  const v = verdictFor(s);
  const [alias, ...rest] = s.id.split(".");
  const label = `${esc(rest.join("."))} <small>${esc(alias)}</small>`;
  const extra = s.variants.length ? `<sup>+${s.variants.length}</sup>` : "";
  const postponed = s.status === "postponed" ? " postponed" : "";
  const title = `${s.id} · ${v}${s.use_case ? " · " + s.use_case : ""}`;
  return `<button class="chip ${v}${postponed}" data-id="${esc(s.id)}" title="${esc(title)}">${label}${extra}</button>`;
}

function renderOrder() {
  $("order").innerHTML = DATA.order.map((o) => {
    const target = DATA.skills.find((s) => s.id === o.ref || s.cluster === o.ref);
    const ref = target ? `<a href="#" data-id="${esc(target.id)}">${esc(o.ref)}</a>` : esc(o.ref);
    return `<li>${ref}: ${esc(o.why)}</li>`;
  }).join("") || "<li>Empty. Fill catalog/order.csv when the shortlist settles.</li>";
}

function openDetail(id) {
  const s = DATA.skills.find((x) => x.id === id);
  if (!s) return;
  const rows = Object.entries(s.reviews).map(([by, r]) => `<tr>
      <td>${esc(by)}</td><td>${esc(r.verdict || "pending")}${r.merge_into ? " → " + esc(r.merge_into) : ""}</td>
      <td>S${esc(r.setup || "?")}</td><td>T${esc(r.tokens || "?")} ${r.tokens_load ? "(" + esc(r.tokens_load) + ")" : ""}${r.tokens_run ? " run " + esc(r.tokens_run) : ""}${r.tokens_without ? " base " + esc(r.tokens_without) : ""}</td>
      <td>${esc(r.depth)}</td><td>${r.file ? `<a href="${r.file}">record</a>` : ""}</td></tr>`).join("");
  const summaries = Object.entries(s.reviews).filter(([, r]) => r.summary)
    .map(([by, r]) => `<p><b>${esc(by)}:</b> ${esc(r.summary)}</p>`).join("");
  const uses = Object.values(s.reviews).flatMap((r) => r.use_cases);
  const passes = s.passes.map((p) => `${p[0]} ${p[1]} ${p[2]} ${p[3]}`).join("<br>");
  $("detail-body").innerHTML = `<div class="detail">
    <h3>${esc(s.id)}</h3>
    <p class="meta">${esc(s.stage)} / ${esc(s.category)} · P${esc(s.priority || "-")} · ${esc(s.target || "-")}
      ${s.cluster ? " · cluster " + esc(s.cluster) : ""} · <a href="${s.source}">source</a></p>
    <p>${esc(s.description)}</p>
    <p><b>Scope use case:</b> ${esc(s.use_case || "-")}</p>
    <p><b>Team verdict:</b> ${esc(s.verdict || "pending")}</p>
    ${rows ? `<table><tr><th>reviewer</th><th>verdict</th><th>setup</th><th>tokens</th><th>depth</th><th></th></tr>${rows}</table>` : ""}
    ${summaries}
    ${uses.length ? `<p><b>Use cases</b></p><ul>${uses.map((u) => `<li>${esc(u)}</li>`).join("")}</ul>` : ""}
    ${s.variants.length ? `<p><b>Variants:</b> ${s.variants.map(esc).join(", ")}</p>` : ""}
    ${passes ? `<p><b>Passes</b><br>${passes}</p>` : ""}
  </div>`;
  if (!$("detail").open) $("detail").showModal();
}


// ------------------------------------------------------------ filters and state

function setupControls() {
  $("who").innerHTML = ["team", ...DATA.meta.reviewers].map((w) => `<option>${w}</option>`).join("");
  $("verdicts").innerHTML = VERDICTS.map((v) =>
    `<label><input type="checkbox" value="${v}"> ${v}</label>`).join("");
  syncControls();

  $("q").addEventListener("input", (e) => { state.q = e.target.value; writeHash(); });
  $("who").addEventListener("change", (e) => { state.who = e.target.value; writeHash(); });
  $("verdicts").addEventListener("change", (e) => {
    e.target.checked ? state.verdicts.add(e.target.value) : state.verdicts.delete(e.target.value);
    writeHash();
  });
  document.addEventListener("click", (e) => {
    const id = e.target.closest("[data-id]")?.dataset.id;
    const expand = e.target.closest("[data-expand]")?.dataset.expand;
    if (id) { e.preventDefault(); state.open = id; writeHash(); }
    if (expand) { state.expanded.add(expand); renderBoard(); }
  });
  $("detail").addEventListener("close", () => { state.open = ""; writeHash(); });
}

function matches(s) {
  if (!state.verdicts.has(verdictFor(s))) return false;
  if (!state.q) return true;
  const hay = [s.id, s.cluster, s.use_case, s.description, ...s.variants].join(" ").toLowerCase();
  return hay.includes(state.q.toLowerCase());
}

function verdictFor(s) {
  if (state.who === "team") return s.verdict || "pending";
  return s.reviews[state.who]?.verdict || "pending";
}

function readHash() {
  const h = new URLSearchParams(location.hash.slice(1));
  state.q = h.get("q") || "";
  state.who = h.get("who") || "team";
  state.verdicts = new Set((h.get("v") || VERDICTS.join(",")).split(",").filter(Boolean));
  state.open = h.get("open") || "";
  if (DATA) syncControls();
}

function writeHash() {
  const h = new URLSearchParams();
  if (state.q) h.set("q", state.q);
  if (state.who !== "team") h.set("who", state.who);
  if (state.verdicts.size !== VERDICTS.length) h.set("v", [...state.verdicts].join(","));
  if (state.open) h.set("open", state.open);
  history.replaceState(null, "", "#" + h.toString());
  render();
}

function syncControls() {
  $("q").value = state.q;
  $("who").value = state.who;
  for (const box of $("verdicts").querySelectorAll("input")) box.checked = state.verdicts.has(box.value);
}

function esc(text) {
  return String(text ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}
