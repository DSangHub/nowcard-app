const MERCHANTS = [
  {
    name: "Grove Market",
    dist: "0.4 mi",
    rate: 5,
    threshold: 50,
    closes: "4h 12m",
    sale: "Ethiopia Guji beans",
    keywords: ["coffee", "beans", "milk", "oat", "bread", "sourdough", "butter", "soap", "produce"]
  },
  {
    name: "Cedar Hardware",
    dist: "0.7 mi",
    rate: 3,
    threshold: 35,
    closes: "6h 40m",
    sale: "Spring clamps, 4-pack",
    keywords: ["nail", "screw", "clamp", "paint", "soap", "tool", "wood"]
  },
  {
    name: "Lumen Florist",
    dist: "0.5 mi",
    rate: 2,
    threshold: 25,
    closes: "3h 05m",
    sale: "Ranunculus bunches",
    keywords: ["tulip", "flower", "ranunculus", "bouquet", "candle"]
  },
  {
    name: "Harbor Fish",
    dist: "1.1 mi",
    rate: 5,
    threshold: 50,
    closes: "2h 18m",
    sale: "Day-boat rockfish",
    keywords: ["fish", "salmon", "rockfish", "shrimp"]
  },
  {
    name: "North Oven",
    dist: "0.3 mi",
    rate: 3,
    threshold: 35,
    closes: "5h 50m",
    sale: "Sesame loaf, still warm",
    keywords: ["bread", "sourdough", "loaf", "butter", "pastry"]
  }
];

const menuBtn = document.getElementById("menuBtn");
const mobileNav = document.getElementById("mobileNav");
menuBtn?.addEventListener("click", () => {
  mobileNav.classList.toggle("open");
});
mobileNav?.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => mobileNav.classList.remove("open"))
);

const listInput = document.getElementById("listInput");
const locateBtn = document.getElementById("locateBtn");
const clearBtn = document.getElementById("clearBtn");
const geoStatus = document.getElementById("geoStatus");
const results = document.getElementById("merchantResults");

function parseList(text) {
  return text
    .split(/[\n,]+/)
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

function matchMerchants(items) {
  return MERCHANTS.map((m) => {
    const hits = items.filter((item) =>
      m.keywords.some((k) => item.includes(k) || k.includes(item))
    );
    return { ...m, hits };
  }).sort((a, b) => b.hits.length - a.hits.length || a.rate - b.rate);
}

function renderMerchants(items) {
  const ranked = matchMerchants(items);
  results.classList.remove("empty");
  results.innerHTML = ranked
    .map((m) => {
      const hitText = m.hits.length
        ? `<span class="match">Matches: ${m.hits.join(", ")}</span> · Now on Sale: ${m.sale}`
        : `Now on Sale: ${m.sale}`;
      return `<article class="merchant">
        <div>
          <h4>${m.name}</h4>
          <div class="dist">${m.dist} · rate expires in ${m.closes}</div>
        </div>
        <div class="rate">${m.rate}%</div>
        <p class="meta">Unlock after $${m.threshold} with NowCard on file. ${hitText}</p>
      </article>`;
    })
    .join("");
}

function runDemo(useGeo) {
  const items = parseList(listInput.value);
  if (!items.length) {
    geoStatus.textContent = "Add at least one item to the list.";
    return;
  }
  if (useGeo && navigator.geolocation) {
    geoStatus.textContent = "Asking the browser for a pin…";
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        geoStatus.textContent = `Pinned near ${latitude.toFixed(3)}, ${longitude.toFixed(3)}. Showing member demo radius.`;
        renderMerchants(items);
      },
      () => {
        geoStatus.textContent = "Location declined. Using a Midtown demo radius instead.";
        renderMerchants(items);
      },
      { enableHighAccuracy: false, timeout: 4000 }
    );
  } else {
    geoStatus.textContent = "Using Midtown demo radius. Member rates are for today only.";
    renderMerchants(items);
  }
}

locateBtn?.addEventListener("click", () => runDemo(true));
clearBtn?.addEventListener("click", () => {
  listInput.value = "";
  geoStatus.textContent = "Waiting for a list and a pin.";
  results.classList.add("empty");
  results.innerHTML = "<p>Add a few items, then drop a pin. We’ll match the list to what’s on sale nearby today.</p>";
});

document.getElementById("applyForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target).entries());
  const note = document.getElementById("formNote");
  const routes = {
    shopper: "Routed to a member Fintec for a one-click NowCard application. NowCard never receives PAN or ID images.",
    merchant: "Routed to merchant membership. You will set a daily rate of 2, 3, or 5% and a $25 / $35 / $50 threshold.",
    fintec: "Routed to the Stripe + Fintec bridge desk. Issuing and tokenization stay on your side of the vault."
  };
  note.textContent = `Thanks, ${data.name || "there"}. ${routes[data.role] || routes.shopper}`;
  e.target.reset();
});
