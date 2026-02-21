/* Prototype app: no frameworks, mobile-first */

const STORAGE_KEY = "sarafan.prototype.v1";

function nowIso() {
  return new Date().toISOString();
}

function uid() {
  return Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2);
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function defaultState() {
  return {
    user: {
      role: null, // "client" | "business"
      name: "",
      phone: "",
      email: "",
      city: "",
      avatarDataUrl: "",
    },
    ui: {
      activeCategory: "Организация праздников",
      businessSort: "last", // last | rating
      activeBusinessId: null,
    },
    requests: [
      {
        id: "rq_seed_1",
        query: "Ведущий на свадьбу",
        city: "Лондон",
        status: "Новый",
        createdAt: nowIso(),
      },
    ],
    businesses: [
      {
        id: "biz_1",
        category: "Организация праздников",
        name: "Text",
        rating: 4.8,
        reviews: 120,
        city: "Лондон",
        address: "31 Rose Way",
        lastAddedAt: "2026-02-18T12:00:00.000Z",
      },
      {
        id: "biz_2",
        category: "Организация праздников",
        name: "Event Studio",
        rating: 4.9,
        reviews: 56,
        city: "Лондон",
        address: "12 King Street",
        lastAddedAt: "2026-02-20T09:30:00.000Z",
      },
      {
        id: "biz_3",
        category: "Организация праздников",
        name: "Decor & More",
        rating: 4.6,
        reviews: 210,
        city: "Лондон",
        address: "8 Market Lane",
        lastAddedAt: "2026-02-10T16:15:00.000Z",
      },
    ],
  };
}

const loadedState = loadState();
const state = loadedState ? loadedState : defaultState();

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

const topbarTitle = $("#topbarTitle");
const backBtn = $("#backBtn");
const bottombar = $("#bottombar");

function setActiveRoute(route) {
  const views = $$(".view");
  for (const v of views) v.classList.toggle("is-active", v.dataset.route === route);
}

function getRoute() {
  const hash = location.hash.replace(/^#/, "").trim();
  return hash || "splash";
}

function setHash(route) {
  location.hash = `#${route}`;
}

function setTopbar(title, { showBack = false } = {}) {
  topbarTitle.textContent = title;
  backBtn.hidden = !showBack;
}

function roleLabel(role) {
  if (role === "business") return "Бизнесмен";
  if (role === "client") return "Клиент";
  return "—";
}

function isAuthed() {
  return Boolean(state.user.role && state.user.city);
}

function homeRouteByRole() {
  return state.user.role === "business" ? "biz-home" : "client-home";
}

function updateBottomBarVisibility(route) {
  const show = isAuthed() && ["client-home", "category", "business", "requests", "biz-home", "profile"].includes(route);
  bottombar.hidden = !show;

  const role = state.user.role;
  const tabs = $$(".bottombar .tab");

  for (const tab of tabs) {
    const tabRoute = tab.dataset.tab;
    const visibleForClient = ["client-home", "requests", "profile"].includes(tabRoute);
    const visibleForBiz = ["biz-home", "profile"].includes(tabRoute);
    const visible = role === "business" ? visibleForBiz : visibleForClient;
    tab.hidden = !visible;
  }

  const normalized = route === "category" || route === "business" ? "client-home" : route;
  for (const tab of tabs) tab.classList.toggle("is-active", tab.dataset.tab === normalized);
}

function persist() {
  saveState(state);
}

function renderProfile() {
  $("#profileName").textContent = state.user.name || "—";
  $("#profileCity").textContent = state.user.city ? `Город: ${state.user.city}` : "—";
  $("#profileRole").textContent = state.user.role ? `Роль: ${roleLabel(state.user.role)}` : "—";

  const el = $("#profileAvatar");
  if (state.user.avatarDataUrl) {
    el.style.backgroundImage = `url(${state.user.avatarDataUrl})`;
  } else {
    el.style.backgroundImage = "";
  }
}

function renderCityChips() {
  const label = state.user.city || "Выбрать город";
  const c1 = $("#cityChip");
  if (c1) c1.textContent = label;
  const c2 = $("#bizCityChip");
  if (c2) c2.textContent = label;
}

function renderBusinesses() {
  $("#categoryTitle").textContent = state.ui.activeCategory;

  const list = $("#businessList");
  list.innerHTML = "";

  const city = state.user.city;
  let items = state.businesses.filter((b) => b.category === state.ui.activeCategory);
  if (city) items = items.filter((b) => b.city === city);

  if (state.ui.businessSort === "rating") {
    items.sort((a, b) => b.rating - a.rating);
  } else {
    items.sort((a, b) => new Date(b.lastAddedAt) - new Date(a.lastAddedAt));
  }

  for (const biz of items) {
    const btn = document.createElement("button");
    btn.className = "card";
    btn.type = "button";
    btn.innerHTML = `
      <div class="card__title">${escapeHtml(biz.name)}</div>
      <div class="card__meta">${biz.rating.toFixed(1)} · ${biz.reviews} reviews · ${escapeHtml(biz.address)}</div>
    `;
    btn.addEventListener("click", () => {
      state.ui.activeBusinessId = biz.id;
      persist();
      setHash("business");
    });
    list.appendChild(btn);
  }

  if (!items.length) {
    const empty = document.createElement("div");
    empty.className = "hint";
    empty.textContent = "Пока нет предложений в выбранном городе.";
    list.appendChild(empty);
  }
}

function renderBusinessDetail() {
  const biz = state.businesses.find((b) => b.id === state.ui.activeBusinessId) || state.businesses[0];
  if (!biz) return;

  $("#bizName").textContent = biz.name;
  $("#bizRating").textContent = `${biz.rating.toFixed(1)} · ${biz.reviews} reviews`;
  $("#bizAddress").textContent = biz.address;

  const avatar = $("#bizAvatar");
  avatar.style.backgroundImage = "";
}

function renderRequests() {
  const list = $("#requestList");
  list.innerHTML = "";

  const items = [...state.requests].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  for (const r of items) {
    const el = document.createElement("div");
    el.className = "card";
    el.innerHTML = `
      <div class="card__title">${escapeHtml(r.query)}</div>
      <div class="card__meta">${escapeHtml(r.city)} · ${escapeHtml(r.status)}</div>
    `;
    list.appendChild(el);
  }

  if (!items.length) {
    const empty = document.createElement("div");
    empty.className = "hint";
    empty.textContent = "Пока нет запросов.";
    list.appendChild(empty);
  }
}

function renderBizFeed() {
  const list = $("#bizRequestFeed");
  list.innerHTML = "";

  const items = state.requests
    .filter((r) => (state.user.city ? r.city === state.user.city : true))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  for (const r of items) {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="card__title">${escapeHtml(r.query)}</div>
      <div class="card__meta">${escapeHtml(r.city)} · ${escapeHtml(r.status)}</div>
      <div style="margin-top:12px; display:grid; gap:8px;">
        <button class="btn btn--ghost" type="button">Откликнуться</button>
      </div>
    `;
    card.querySelector("button").addEventListener("click", () => {
      openSheet({
        title: "Отклик",
        body: renderSheetOffer(r),
      });
    });
    list.appendChild(card);
  }

  if (!items.length) {
    const empty = document.createElement("div");
    empty.className = "hint";
    empty.textContent = "Нет запросов в выбранном городе.";
    list.appendChild(empty);
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// --- Bottom sheet ---
const sheet = $("#sheet");
const sheetTitle = $("#sheetTitle");
const sheetBody = $("#sheetBody");

function openSheet({ title, body }) {
  sheetTitle.textContent = title;
  sheetBody.innerHTML = "";
  sheetBody.appendChild(body);
  sheet.hidden = false;
}

function closeSheet() {
  sheet.hidden = true;
}

$$('[data-sheet-close]').forEach((el) => el.addEventListener("click", closeSheet));

function renderSheetCreateRequest(presetQuery = "") {
  const wrap = document.createElement("div");
  wrap.innerHTML = `
    <label class="field">
      <span class="field__label">Что нужно?</span>
      <input class="input" id="rqQuery" placeholder="Например: ведущий на свадьбу" value="${escapeHtml(presetQuery)}" />
    </label>
    <button class="btn btn--primary" type="button" id="rqCreate">Создать запрос</button>
  `;
  wrap.querySelector("#rqCreate").addEventListener("click", () => {
    const query = wrap.querySelector("#rqQuery").value.trim();
    if (!query) return;
    state.requests.unshift({
      id: uid(),
      query,
      city: state.user.city || "—",
      status: "Новый",
      createdAt: nowIso(),
    });
    persist();
    closeSheet();
    renderRequests();
    renderBizFeed();
    setHash("requests");
  });
  return wrap;
}

function renderSheetOffer(request) {
  const wrap = document.createElement("div");
  wrap.innerHTML = `
    <div class="hint">Запрос: <b>${escapeHtml(request.query)}</b></div>
    <label class="field">
      <span class="field__label">Сообщение</span>
      <input class="input" id="offerMsg" placeholder="Могу помочь. Свяжитесь со мной…" />
    </label>
    <button class="btn btn--primary" type="button" id="offerSend">Отправить</button>
  `;
  wrap.querySelector("#offerSend").addEventListener("click", () => {
    closeSheet();
    alert("Прототип: отклик отправлен");
  });
  return wrap;
}

function renderSheetCity() {
  const wrap = document.createElement("div");
  wrap.innerHTML = `
    <label class="field">
      <span class="field__label">Город</span>
      <input class="input" id="cityValue" placeholder="Лондон" value="${escapeHtml(state.user.city || "")}" />
    </label>
    <button class="btn btn--primary" type="button" id="citySave">Сохранить</button>
  `;
  wrap.querySelector("#citySave").addEventListener("click", () => {
    const value = wrap.querySelector("#cityValue").value.trim();
    if (!value) return;
    state.user.city = value;
    persist();
    closeSheet();
    renderCityChips();
    renderRequests();
    renderBizFeed();
    if (getRoute() === "category") renderBusinesses();
  });
  return wrap;
}

// --- Registration flow ---
let selectedRole = state.user.role;

function bindRegistration() {
  const roleButtons = $$("[data-role]");
  const roleNext = $("#roleNext");

  function applyRoleUI() {
    for (const b of roleButtons) b.classList.toggle("is-selected", b.dataset.role === selectedRole);
    roleNext.disabled = !selectedRole;
  }

  roleButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedRole = btn.dataset.role;
      applyRoleUI();
    });
  });

  roleNext.addEventListener("click", () => {
    if (!selectedRole) return;
    state.user.role = selectedRole;
    persist();
    setHash("reg");
  });

  applyRoleUI();

  $("#saveProfile").addEventListener("click", () => {
    state.user.name = $("#regName").value.trim();
    state.user.phone = $("#regPhone").value.trim();
    state.user.email = $("#regEmail").value.trim();
    const inlineCityEl = $("#regCityInline");
    const stepCityEl = $("#regCity");
    const inlineCity = inlineCityEl ? inlineCityEl.value.trim() : "";
    const stepCity = stepCityEl ? stepCityEl.value.trim() : "";
    state.user.city = inlineCity || stepCity || state.user.city;

    if (!state.user.role) {
      setHash("role");
      return;
    }
    if (!state.user.city) {
      setHash("city");
      return;
    }

    persist();
    setHash(homeRouteByRole());
  });

  $("#avatarInput").addEventListener("change", async (e) => {
    const input = e.target;
    const file = input && input.files ? input.files[0] : null;
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    state.user.avatarDataUrl = dataUrl;
    persist();
    const prev = $("#avatarPreview");
    prev.style.backgroundImage = `url(${dataUrl})`;
  });
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(String(fr.result));
    fr.onerror = () => reject(fr.error);
    fr.readAsDataURL(file);
  });
}

// --- Navigation ---
function wireNav() {
  document.body.addEventListener("click", (e) => {
    const t = e.target;
    if (!(t instanceof Element)) return;

    const nav = t.closest("[data-nav]");
    if (nav) {
      const to = nav.getAttribute("data-nav");
      if (to?.startsWith("#")) {
        e.preventDefault();
        location.hash = to;
      }
      return;
    }

    const cat = t.closest("[data-category]");
    if (cat) {
      state.ui.activeCategory = cat.getAttribute("data-category") || state.ui.activeCategory;
      persist();
      setHash("category");
      return;
    }

    const sortChip = t.closest("[data-sort]");
    if (sortChip) {
      const sort = sortChip.getAttribute("data-sort");
      state.ui.businessSort = sort === "rating" ? "rating" : "last";
      persist();
      for (const el of $$("[data-sort]")) {
        const isActive = el.getAttribute("data-sort") === state.ui.businessSort;
        el.classList.toggle("chip--active", isActive);
        el.setAttribute("aria-selected", String(isActive));
      }
      renderBusinesses();
      return;
    }
  });

  backBtn.addEventListener("click", () => history.back());

  bottombar.addEventListener("click", (e) => {
    const t = e.target;
    if (!(t instanceof Element)) return;
    const tab = t.closest(".tab");
    if (!tab) return;

    const route = tab.dataset.tab;
    if (!route) return;

    if (route === "biz-home" && state.user.role !== "business") return;
    if ((route === "client-home" || route === "requests") && state.user.role === "business") return;

    setHash(route);
  });

  $("#clientSearch").addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    const q = e.currentTarget.value.trim();
    if (!q) return;
    openSheet({
      title: "Запрос",
      body: renderSheetCreateRequest(q),
    });
  });

  const regNext = $("#regNext");
  if (regNext) {
    regNext.addEventListener("click", (e) => {
      // JS mode: persist base info early and skip city step if already provided.
      e.preventDefault();
      state.user.name = $("#regName").value.trim();
      state.user.phone = $("#regPhone").value.trim();
      state.user.email = $("#regEmail").value.trim();
      const inlineCityEl = $("#regCityInline");
      const inlineCity = inlineCityEl ? inlineCityEl.value.trim() : "";
      if (inlineCity) state.user.city = inlineCity;
      persist();
      setHash(state.user.city ? "photo" : "city");
    });
  }

  const cityChip = $("#cityChip");
  if (cityChip) {
    cityChip.addEventListener("click", () => {
      openSheet({
        title: "Город",
        body: renderSheetCity(),
      });
    });
  }

  const bizCityChip = $("#bizCityChip");
  if (bizCityChip) {
    bizCityChip.addEventListener("click", () => {
      openSheet({
        title: "Город",
        body: renderSheetCity(),
      });
    });
  }

  $("#createRequestFromBiz").addEventListener("click", () => {
    openSheet({
      title: "Запрос",
      body: renderSheetCreateRequest(""),
    });
  });

  $("#bizDirections").addEventListener("click", () => alert("Прототип: Get Directions"));
  $("#bizBenefits").addEventListener("click", () => alert("Прототип: Explore benefits"));
  $("#bizReview").addEventListener("click", () => alert("Прототип: write a review"));

  $("#switchRole").addEventListener("click", () => {
    state.user.role = state.user.role === "business" ? "client" : "business";
    persist();
    setHash(homeRouteByRole());
  });

  $("#resetAll").addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEY);
    location.hash = "#splash";
    location.reload();
  });
}

function ensureAuthedRoute(route) {
  const publicRoutes = ["splash", "role", "reg", "city", "photo"]; 
  if (!isAuthed() && !publicRoutes.includes(route)) {
    return "splash";
  }
  if (isAuthed() && publicRoutes.includes(route)) {
    return homeRouteByRole();
  }
  return route;
}

function onRouteChange() {
  let route = getRoute();
  route = ensureAuthedRoute(route);

  if (route !== getRoute()) {
    setHash(route);
    return;
  }

  // header titles/back behavior
  const backRoutes = new Set(["category", "business", "requests", "profile"]);

  if (route === "splash") setTopbar("", { showBack: false });
  else if (route === "role") setTopbar("Регистрация", { showBack: true });
  else if (route === "reg") setTopbar("Регистрация", { showBack: true });
  else if (route === "city") setTopbar("Регистрация", { showBack: true });
  else if (route === "photo") setTopbar("Регистрация", { showBack: true });
  else if (route === "client-home") setTopbar("", { showBack: false });
  else if (route === "category") setTopbar("", { showBack: true });
  else if (route === "business") setTopbar("", { showBack: true });
  else if (route === "requests") setTopbar("", { showBack: true });
  else if (route === "biz-home") setTopbar("", { showBack: false });
  else if (route === "profile") setTopbar("", { showBack: true });
  else setTopbar("SARAFAN", { showBack: backRoutes.has(route) });

  setActiveRoute(route);

  renderCityChips();
  renderProfile();

  if (route === "category") renderBusinesses();
  if (route === "business") renderBusinessDetail();
  if (route === "requests") renderRequests();
  if (route === "biz-home") renderBizFeed();

  updateBottomBarVisibility(route);
}

bindRegistration();
wireNav();
window.addEventListener("hashchange", onRouteChange);

// initial UI fill
$("#regName").value = state.user.name || "";
$("#regPhone").value = state.user.phone || "";
$("#regEmail").value = state.user.email || "";
const inlineCity = $("#regCityInline");
if (inlineCity) inlineCity.value = state.user.city || "";
$("#regCity").value = state.user.city || "";
if (state.user.avatarDataUrl) {
  $("#avatarPreview").style.backgroundImage = `url(${state.user.avatarDataUrl})`;
}

onRouteChange();
