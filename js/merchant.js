const SUGGEST = {
  2: { th: 25, copy: "2% after $25 — a light Tuesday rate. Easy to post, easy to clear." },
  3: { th: 35, copy: "3% after $35 — enough to feel, cheap enough to post midweek." },
  5: { th: 50, copy: "5% after $50 — use when you need the ticket to matter." }
};

let rate = 3;
let threshold = 35;
let sales = ["Sesame loaf, still warm", "House ricotta"];

const rateSeg = document.getElementById("rateSeg");
const thSeg = document.getElementById("thSeg");
const hint = document.getElementById("pairHint");
const closeAt = document.getElementById("closeAt");
const saleFields = document.getElementById("saleFields");
const pubStatus = document.getElementById("pubStatus");

function selectSeg(root, attr, value) {
  root.querySelectorAll("button").forEach((b) => {
    b.classList.toggle("on", b.dataset[attr] === String(value));
  });
}

function fmtTime(value) {
  const [h, m] = value.split(":").map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function renderSales() {
  saleFields.innerHTML = sales
    .map(
      (s, i) => `<div class="sale-row">
        <input data-i="${i}" value="${s.replace(/"/g, "&quot;")}" />
        <button type="button" data-del="${i}" aria-label="Remove">✕</button>
      </div>`
    )
    .join("");
  saleFields.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", () => {
      sales[+input.dataset.i] = input.value;
      preview();
    });
  });
  saleFields.querySelectorAll("[data-del]").forEach((btn) => {
    btn.addEventListener("click", () => {
      sales.splice(+btn.dataset.del, 1);
      renderSales();
      preview();
    });
  });
}

function preview() {
  document.getElementById("livePct").textContent = `${rate}%`;
  document.getElementById("liveRule").textContent = `Unlock after $${threshold} · NowCard on file`;
  document.getElementById("liveClock").textContent = `Expires ${fmtTime(closeAt.value)}`;
  document.getElementById("liveSale").innerHTML = sales
    .filter(Boolean)
    .map((s) => `<li>${s}</li>`)
    .join("");
  document.getElementById("ledRate").textContent = `${rate}% after $${threshold}`;
}

rateSeg.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-rate]");
  if (!btn) return;
  rate = +btn.dataset.rate;
  threshold = SUGGEST[rate].th;
  hint.textContent = SUGGEST[rate].copy;
  selectSeg(rateSeg, "rate", rate);
  selectSeg(thSeg, "th", threshold);
  pubStatus.textContent = "Draft";
  pubStatus.classList.remove("live");
  preview();
});

thSeg.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-th]");
  if (!btn) return;
  threshold = +btn.dataset.th;
  selectSeg(thSeg, "th", threshold);
  pubStatus.textContent = "Draft";
  pubStatus.classList.remove("live");
  preview();
});

closeAt.addEventListener("change", preview);

document.getElementById("addSale").addEventListener("click", () => {
  if (sales.length >= 3) return;
  sales.push("");
  renderSales();
});

document.getElementById("publishBtn").addEventListener("click", () => {
  pubStatus.textContent = "Live today";
  pubStatus.classList.add("live");
});

document.getElementById("pauseBtn").addEventListener("click", () => {
  pubStatus.textContent = "Paused";
  pubStatus.classList.remove("live");
});

renderSales();
preview();
