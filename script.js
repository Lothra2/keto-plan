// ====== CONSTANTES DE STORAGE ======
const LS_PREFIX = "keto14-rick-";
const LS_NAME = LS_PREFIX + "name";
const LS_THEME = LS_PREFIX + "theme";
const LS_START = LS_PREFIX + "start-date";
const LS_PLAN_WEEKS = LS_PREFIX + "plan-weeks";
const LS_DAILY_VIEW = LS_PREFIX + "daily-view";
const LS_PRIMARY = LS_PREFIX + "primary-color";
const LS_HEIGHT = LS_PREFIX + "height-cm";
const LS_START_WEIGHT = LS_PREFIX + "start-weight";
const LS_LANG = LS_PREFIX + "lang";
const LS_LIKE = LS_PREFIX + "like-foods";
const LS_DISLIKE = LS_PREFIX + "dislike-foods";
const LS_API_USER = LS_PREFIX + "api-user";
const LS_API_PASS = LS_PREFIX + "api-pass";
const LS_AI_DAY_PREFIX = LS_PREFIX + "ai-day-";
const LS_CAL_PREFIX = LS_PREFIX + "cal-";
const LS_PROGRESS_PREFIX = LS_PREFIX + "prog-";
const LS_SELECTED_DAY = LS_PREFIX + "sel-day";
const LS_SELECTED_WEEK = LS_PREFIX + "sel-week";

const GROK_PROXY = "/.netlify/functions/grok";

let weightChart = null;
let exerciseChart = null;
let derivedPlan = [];
let currentWeeks = 2;
let dailyView = 0;
let appLang = "es";

// ====== TOAST ======
const toastEl = document.getElementById("appToast");
let toastTimer = null;
function showToast(msg, duration = 1800) {
  if (!toastEl) return;
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => hideToast(), duration);
}
function hideToast() {
  if (!toastEl) return;
  toastEl.classList.remove("show");
  if (toastTimer) {
    clearTimeout(toastTimer);
    toastTimer = null;
  }
}
if (toastEl) toastEl.addEventListener("click", hideToast);
document.addEventListener("scroll", () => hideToast(), true);

// ====== PLAN BASE (14 DÍAS) ======
const basePlan = [
  {dia:"Día 1",kcal:1650,macros:{carbs:"7%",prot:"25%",fat:"68%"},desayuno:{nombre:"Huevos con aguacate y feta",qty:"2 huevos, 1/2 aguacate, 30 g feta, 5 g mantequilla"},snackAM:{nombre:"Yogur griego con marañones",qty:"120 g yogur, 20 g marañones"},almuerzo:{nombre:"Salmón con brócoli",qty:"150 g salmón, 120 g brócoli, 10 g mantequilla"},snackPM:{nombre:"Feta con tomate cherry",qty:"30 g feta, 4 tomates"},cena:{nombre:"Bife de res con rocket y aguacate",qty:"160 g res, 40 g rocket, 1/2 aguacate"}},
  {dia:"Día 2",kcal:1600,macros:{carbs:"8%",prot:"24%",fat:"68%"},desayuno:{nombre:"Omelette feta y tomate",qty:"2-3 huevos, 30 g feta, 40 g tomate"},snackAM:{nombre:"Marañones y café",qty:"20 g marañones"},almuerzo:{nombre:"Pollo a la parrilla con rocket",qty:"150 g pollo, 50 g rocket, 1/2 aguacate"},snackPM:{nombre:"Yogur con coco",qty:"120 g yogur, 10 g coco"},cena:{nombre:"Camarones al ajillo con coliflor",qty:"140 g camarón, 120 g coliflor"}},
  {dia:"Día 3",kcal:1580,macros:{carbs:"6%",prot:"26%",fat:"68%"},desayuno:{nombre:"Yogur con nueces y chía",qty:"150 g yogur, 15 g nueces, 5 g chía"},snackAM:{nombre:"Feta y aguacate",qty:"25 g feta, 30 g aguacate"},almuerzo:{nombre:"Hamburguesa sin pan con rocket",qty:"150 g carne, 50 g rocket, 4 tomates"},snackPM:{nombre:"Marañones",qty:"20 g"},cena:{nombre:"Salmón con brócoli y mantequilla",qty:"150 g salmón, 120 g brócoli, 5 g mantequilla"}},
  {dia:"Día 4",kcal:1620,macros:{carbs:"7%",prot:"24%",fat:"69%"},desayuno:{nombre:"Huevos cocidos con aguacate",qty:"2 huevos, 1/2 aguacate"},snackAM:{nombre:"Yogur y marañones",qty:"120 g yogur, 20 g marañones"},almuerzo:{nombre:"Pollo en crema con champiñón y brócoli",qty:"150 g pollo, 60 g champiñón, 100 g brócoli, 20 ml crema"},snackPM:{nombre:"Feta con rocket",qty:"30 g feta, 20 g rocket"},cena:{nombre:"Carne roja con rocket y tomate seco",qty:"160 g carne, 40 g rocket, 15 g tomate seco"}},
  {dia:"Día 5",kcal:1590,macros:{carbs:"8%",prot:"25%",fat:"67%"},desayuno:{nombre:"Omelette con feta y champiñones",qty:"2-3 huevos, 30 g feta, 50 g champiñón"},snackAM:{nombre:"Café con crema + marañones",qty:"café + 10 ml crema + 15 g marañones"},almuerzo:{nombre:"Ensalada keto de pollo",qty:"140 g pollo, 1/2 aguacate, 40 g tomate, 40 g rocket"},snackPM:{nombre:"Yogur con coco",qty:"120 g yogur, 10 g coco"},cena:{nombre:"Camarones con puré de coliflor",qty:"140 g camarón, 120 g coliflor, 10 g mantequilla"}},
  {dia:"Día 6",kcal:1600,macros:{carbs:"7%",prot:"25%",fat:"68%"},desayuno:{nombre:"Yogur con chía y nueces",qty:"150 g yogur, 5 g chía, 15 g nueces"},snackAM:{nombre:"Feta y aguacate",qty:"25 g feta, 30 g aguacate"},almuerzo:{nombre:"Bife con ensalada y feta",qty:"160 g res, 40 g hojas verdes, 20 g feta"},snackPM:{nombre:"Marañones",qty:"20 g"},cena:{nombre:"Pollo al horno con brócoli gratinado",qty:"150 g pollo, 100 g brócoli, 20 g queso"}},
  {dia:"Día 7",kcal:1580,macros:{carbs:"7%",prot:"24%",fat:"69%"},desayuno:{nombre:"Huevos revueltos con mantequilla y aguacate",qty:"2 huevos, 1/2 aguacate, 5 g mantequilla"},snackAM:{nombre:"Yogur + chía",qty:"120 g yogur, 5 g chía"},almuerzo:{nombre:"Ensalada de salmón con rocket y feta",qty:"140 g salmón, 40 g rocket, 20 g feta"},snackPM:{nombre:"Feta con tomate",qty:"30 g feta, 4 tomates"},cena:{nombre:"Filete de res con brócoli",qty:"160 g res, 100 g brócoli, 5 g mantequilla"}},
  {dia:"Día 8",kcal:1600,macros:{carbs:"7%",prot:"25%",fat:"68%"},desayuno:{nombre:"Omelette 3 huevos con feta y rocket",qty:"3 huevos, 30 g feta, 30 g rocket"},snackAM:{nombre:"Yogur con marañones",qty:"120 g yogur, 20 g marañones"},almuerzo:{nombre:"Pollo salteado con brócoli",qty:"150 g pollo, 100 g brócoli, 5 ml aceite"},snackPM:{nombre:"Feta y aguacate",qty:"25 g feta, 30 g aguacate"},cena:{nombre:"Salmón con mantequilla de ajo",qty:"150 g salmón, 5 g mantequilla"}},
  {dia:"Día 9",kcal:1590,macros:{carbs:"7%",prot:"25%",fat:"68%"},desayuno:{nombre:"Yogur con nueces y coco",qty:"150 g yogur, 10 g coco, 15 g nueces"},snackAM:{nombre:"Feta y tomate",qty:"25 g feta, 4 tomates"},almuerzo:{nombre:"Bife con rocket y aguacate",qty:"160 g res, 40 g rocket, 1/2 aguacate"},snackPM:{nombre:"Marañones o almendras",qty:"20 g"},cena:{nombre:"Camarones con crema y brócoli",qty:"140 g camarón, 100 g brócoli, 20 ml crema"}},
  {dia:"Día 10",kcal:1600,macros:{carbs:"8%",prot:"24%",fat:"68%"},desayuno:{nombre:"Huevos fritos con aguacate",qty:"2 huevos, 1/2 aguacate"},snackAM:{nombre:"Yogur con chía",qty:"120 g yogur, 5 g chía"},almuerzo:{nombre:"Pollo al curry sin arroz con coliflor",qty:"150 g pollo, 100 g coliflor"},snackPM:{nombre:"Feta con rocket",qty:"25 g feta, 20 g rocket"},cena:{nombre:"Salmón con tomate y feta",qty:"150 g salmón, 40 g tomate, 20 g feta"}},
  {dia:"Día 11",kcal:1590,macros:{carbs:"7%",prot:"25%",fat:"68%"},desayuno:{nombre:"Omelette con champiñones y feta",qty:"2-3 huevos, 50 g champiñón, 20 g feta"},snackAM:{nombre:"Marañones",qty:"20 g"},almuerzo:{nombre:"Ensalada de pollo y aguacate",qty:"140 g pollo, 1/2 aguacate, 40 g rocket"},snackPM:{nombre:"Yogur con coco",qty:"120 g yogur, 10 g coco"},cena:{nombre:"Carne roja con puré de coliflor",qty:"160 g carne, 120 g coliflor"}},
  {dia:"Día 12",kcal:1580,macros:{carbs:"7%",prot:"24%",fat:"69%"},desayuno:{nombre:"Yogur con nueces",qty:"150 g yogur, 15 g nueces"},snackAM:{nombre:"Feta y aguacate",qty:"25 g feta, 30 g aguacate"},almuerzo:{nombre:"Camarones al ajillo con ensalada",qty:"140 g camarón, 50 g hojas verdes, 5 ml aceite"},snackPM:{nombre:"Café con crema + marañones",qty:"10 ml crema, 15 g marañones"},cena:{nombre:"Pollo al horno con brócoli y feta",qty:"150 g pollo, 100 g brócoli, 20 g feta"}},
  {dia:"Día 13",kcal:1600,macros:{carbs:"7%",prot:"24%",fat:"69%"},desayuno:{nombre:"Huevos cocidos con aguacate",qty:"2 huevos, 1/2 aguacate"},snackAM:{nombre:"Yogur con coco",qty:"120 g yogur, 10 g coco"},almuerzo:{nombre:"Bife con tomate y rocket",qty:"160 g res, 40 g rocket, 40 g tomate"},snackPM:{nombre:"Feta con nueces",qty:"25 g feta, 10 g nueces"},cena:{nombre:"Salmón con mantequilla y brócoli",qty:"150 g salmón, 100 g brócoli, 5 g mantequilla"}},
  {dia:"Día 14",kcal:1600,macros:{carbs:"7%",prot:"24%",fat:"69%"},desayuno:{nombre:"Omelette feta y rocket",qty:"2-3 huevos, 30 g feta, 30 g rocket"},snackAM:{nombre:"Yogur con chía",qty:"120 g yogur, 5 g chía"},almuerzo:{nombre:"Pollo con aguacate y tomate",qty:"140 g pollo, 1/2 aguacate, 40 g tomate"},snackPM:{nombre:"Marañones o feta",qty:"20 g marañones o 25 g feta"},cena:{nombre:"Filete de res con brócoli y mantequilla",qty:"160 g res, 100 g brócoli, 5 g mantequilla"}}
];

const cenaSwaps = [
  {nombre:"Pollo 150 g con brócoli 120 g y mantequilla 5 g",qty:"150 g pollo, 120 g brócoli, 5 g mantequilla"},
  {nombre:"Hamburguesa sin pan con queso y ensalada",qty:"150 g carne, 20 g queso, ensalada verde"},
  {nombre:"Salmón 140 g con ensalada verde",qty:"140 g salmón, 50 g hojas verdes"}
];

const tipsES = [
  "🥤 Toma agua con un poco de sal.",
  "🥑 Si tienes hambre sube grasa.",
  "🍳 Dos huevos extra están bien.",
  "📸 Foto día 1 y día final.",
  "🧴 Puedes cambiar mantequilla por aceite."
];
const tipsEN = [
  "🥤 Remember to drink water with a pinch of salt.",
  "🥑 If you feel hungry, increase fats.",
  "🍳 Two extra eggs are fine.",
  "📸 Take a picture on day 1 and last day.",
  "🧴 You can swap butter for olive oil."
];

// ====== WORKOUTS LOCALIZADOS ======
const localizedWorkouts = {
  1: {
    focusES: "Base de movilidad + caminar",
    focusEN: "Mobility + walking base",
    days: [
      "Caminar 30 min ritmo cómodo",
      "Movilidad cadera + hombros 12 min",
      "Descanso activo: 15 min estiramientos",
      "Caminar 30 min + plancha 3 x 30 s",
      "Fuerza peso corporal 20 min",
      "Caminar 25-30 min",
      "Respiración profunda 5 min + estiramientos"
    ]
  },
  2: {
    focusES: "Más cardio y fuerza ligera",
    focusEN: "More cardio and light strength",
    days: [
      "Caminar 35 min",
      "Pierna peso corporal 20 min",
      "Caminar 20 min + core 3 x 15",
      "Caminar 35 min",
      "Torso 20 min",
      "Movilidad 10 min",
      "Descanso activo 15 min"
    ]
  },
  3: {
    focusES: "Frecuencia alta y core",
    focusEN: "Higher frequency + core",
    days: [
      "Caminar rápido 30 min",
      "Core 15 min",
      "Fuerza full body ligera",
      "Caminar 30-35 min",
      "Subir escaleras 10-12 min",
      "Movilidad 10 min",
      "Descanso activo"
    ]
  },
  4: {
    focusES: "Consolidación y fuerza completa",
    focusEN: "Consolidation + full strength",
    days: [
      "Caminar 40 min",
      "Fuerza completa 25 min",
      "Core + movilidad 15 min",
      "Caminar 35 min",
      "Fuerza tren inferior 20 min",
      "Caminar 25 min",
      "Respiración + estiramientos 10 min"
    ]
  }
};

function getWorkoutForDay(week, dayIndex) {
  const w = localizedWorkouts[week] || localizedWorkouts[1];
  const today = w.days[dayIndex] || w.days[0];
  return {
    focus: appLang === "en" ? w.focusEN : w.focusES,
    today
  };
}

// ====== BUILD PLAN ======
function buildPlan(weeks) {
  const totalDays = weeks * 7;
  const arr = [];
  for (let i = 0; i < totalDays; i++) {
    const base = basePlan[i % basePlan.length];
    const copy = JSON.parse(JSON.stringify(base));
    copy.dia = "Día " + (i + 1);
    arr.push(copy);
  }
  return arr;
}

// ====== TIPS ======
function setRandomTip(name) {
  const tipBox = document.getElementById("tipBox");
  const source = appLang === "en" ? tipsEN : tipsES;
  const base = source[Math.floor(Math.random() * source.length)];
  tipBox.textContent = name ? base + " " + name + "." : base;
}

// ====== MOTIVACIÓN ======
function showMotivation() {
  const box = document.getElementById("motivation");
  const done = getCompletedCount();
  const total = derivedPlan.length;
  const name = localStorage.getItem(LS_NAME) || "";
  let msg = "";
  if (appLang === "en") {
    if (done === 0) msg = "Starting is the hardest part. You're here " + (name || "");
    else if (done < total / 2) msg = "Good pace " + (name || "") + ". You have " + done + " days done.";
    else if (done < total) msg = "More than half. Keep it up.";
    else msg = "Plan completed. Take a photo and share.";
  } else {
    if (done === 0) msg = "Inicio es lo más difícil. Ya estás aquí " + (name || "");
    else if (done < total / 2) msg = "Buen ritmo " + (name || "") + ". Ya tienes " + done + " días.";
    else if (done < total) msg = "Más de la mitad. Mantén el plan.";
    else msg = "Plan completado. Haz una foto y compártelo.";
  }
  box.textContent = msg;
  box.style.display = "block";
}

// ====== NOMBRE ======
function saveNameFromModal() {
  const n1 = document.getElementById("name1").value.trim();
  if (n1) {
    localStorage.setItem(LS_NAME, n1);
    setHeaderName(n1);
    setRandomTip(n1);
  }
  document.getElementById("nameModal").style.display = "none";
}
function setHeaderName(name) {
  const sub = document.getElementById("subTitle");
  sub.textContent = (appLang === "en" ? "For " : "Para ") + name;
  const settings = document.getElementById("settingsName");
  if (settings) settings.value = name;
}
function applySettingsName() {
  const name = document.getElementById("settingsName").value.trim();
  localStorage.setItem(LS_NAME, name);
  setHeaderName(name);
  setRandomTip(name);
  showToast(appLang === "en" ? "Name updated" : "Nombre actualizado");
}

// ====== FECHA INICIO ======
function askStartDateIfNeeded() {
  const saved = localStorage.getItem(LS_START);
  if (!saved) {
    const today = new Date().toISOString().slice(0,10);
    localStorage.setItem(LS_START, today);
  }
}
function changeStartDate() {
  const val = document.getElementById("startDateInput").value;
  if (val) {
    localStorage.setItem(LS_START, val);
    showToast(appLang === "en" ? "Start date changed" : "Fecha cambiada");
    switchTab("menu");
  }
}
function getCurrentDayIndex() {
  const saved = localStorage.getItem(LS_START);
  if (!saved) return 0;
  const start = new Date(saved);
  const today = new Date();
  const diffMs = today - start;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return 0;
  if (diffDays > derivedPlan.length - 1) return derivedPlan.length - 1;
  return diffDays;
}

// ====== RENDER CONTROLES SEMANAS/DÍAS ======
function renderWeekButtons() {
  const ws = document.getElementById("weekSwitch");
  ws.innerHTML = "";
  for (let w = 1; w <= currentWeeks; w++) {
    const btn = document.createElement("div");
    btn.className = "week-btn" + (w === 1 ? " active" : "");
    btn.dataset.week = w;
    btn.textContent = (appLang === "en" ? "Week " : "Semana ") + w + " (" + ((w - 1) * 7 + 1) + "-" + (w * 7) + ")";
    ws.appendChild(btn);
  }
  ws.style.display = dailyView ? "none" : "flex";
  document.getElementById("dayFloating").style.display = dailyView ? "none" : "flex";
}
function renderDayPills(week) {
  const wrap = document.getElementById("dayFloating");
  wrap.innerHTML = "";
  const start = (week - 1) * 7;
  const end = Math.min(week * 7, derivedPlan.length);
  for (let i = start; i < end; i++) {
    const pill = document.createElement("div");
    pill.className = "day-pill";
    pill.textContent = derivedPlan[i].dia;
    pill.onclick = () => renderMenuDay(i, week);
    wrap.appendChild(pill);
  }
}

// ====== PROGRESO GLOBAL ======
function getCompletedCount() {
  let count = 0;
  for (let i = 0; i < derivedPlan.length; i++) {
    if (localStorage.getItem(LS_PREFIX + "done-" + i) === "1") count++;
  }
  return count;
}
function updateProgressBar() {
  const count = getCompletedCount();
  document.getElementById("progressText").textContent =
    count + " " + (appLang === "en" ? "of" : "de") + " " + derivedPlan.length + " " + (appLang === "en" ? "days" : "días");
  document.getElementById("progressBar").style.width = (count / derivedPlan.length * 100) + "%";
}

// ====== CALORÍAS POR DÍA ======
function getCalorieState(idx, day) {
  const stored = localStorage.getItem(LS_CAL_PREFIX + idx);
  const baseGoal = day.kcal || 1600;
  if (stored) {
    const parsed = JSON.parse(stored);
    parsed.goal = parsed.goal || baseGoal;
    return parsed;
  }
  return {
    goal: baseGoal,
    meals: {
      desayuno: false,
      snackAM: false,
      almuerzo: false,
      snackPM: false,
      cena: false
    }
  };
}
function saveCalorieState(idx, state) {
  localStorage.setItem(LS_CAL_PREFIX + idx, JSON.stringify(state));
}
const mealPercents = {
  desayuno: 0.25,
  snackAM: 0.1,
  almuerzo: 0.35,
  snackPM: 0.1,
  cena: 0.2
};
function calcConsumedFromState(state, day) {
  const goal = state.goal || day.kcal || 1600;
  let consumed = 0;
  Object.keys(state.meals).forEach(meal => {
    if (state.meals[meal]) {
      consumed += Math.round(goal * (mealPercents[meal] || 0));
    }
  });
  return {consumed, goal};
}
function toggleMealCal(idx, mealKey, week) {
  const day = getDayWithAI(idx);
  const state = getCalorieState(idx, day);
  state.meals[mealKey] = !state.meals[mealKey];
  saveCalorieState(idx, state);
  renderMenuDay(idx, week);
}
window.toggleMealCal = toggleMealCal;

// ====== OBTENER DÍA CON IA MERGEADO ======
function getDayWithAI(idx) {
  let day = derivedPlan[idx];
  const aiStored = localStorage.getItem(LS_AI_DAY_PREFIX + idx);
  if (aiStored) {
    try {
      const parsed = JSON.parse(aiStored);
      day = Object.assign({}, day, parsed);
    } catch(e) {}
  }
  return day;
}

// ====== MACROS DINÁMICOS SEGÚN COMIDAS MARCADAS ======
function computeDynamicMacros(day, calState) {
  const baseCarb = Number((day.macros.carbs || "0").replace("%","")) || 0;
  const baseProt = Number((day.macros.prot || "0").replace("%","")) || 0;
  const baseFat  = Number((day.macros.fat  || "0").replace("%","")) || 0;
  const calCalc = calcConsumedFromState(calState, day);
  const factor = calCalc.goal ? (calCalc.consumed / calCalc.goal) : 0;
  const carb = Math.round(baseCarb * factor);
  const prot = Math.round(baseProt * factor);
  const fat  = Math.round(baseFat  * factor);
  return {
    carbs: carb + "% / " + baseCarb + "%",
    prot:  prot + "% / " + baseProt + "%",
    fat:   fat + "% / " + baseFat + "%"
  };
}

// ====== MENÚ DÍA ======
function renderMenuDay(idx, week) {
  // recordar selección
  localStorage.setItem(LS_SELECTED_DAY, String(idx));
  localStorage.setItem(LS_SELECTED_WEEK, String(week));

  const menuDays = document.getElementById("menuDays");
  menuDays.innerHTML = "";
  const day = getDayWithAI(idx);
  const done = localStorage.getItem(LS_PREFIX + "done-" + idx) === "1";
  const card = document.createElement("div");
  card.className = "day-card";

  const dayIndexInWeek = (idx % 7);
  const workout = getWorkoutForDay(week, dayIndexInWeek);

  const calState = getCalorieState(idx, day);
  const calCalc = calcConsumedFromState(calState, day);
  const calPercent = Math.min(100, Math.round((calCalc.consumed / calCalc.goal) * 100));
  const dynMacros = computeDynamicMacros(day, calState);

  card.innerHTML = `
    <div class="day-title">
      <h2>${day.dia}</h2>
      <div class="kcal">${day.kcal || 1600} kcal</div>
    </div>
    <div class="macros">
      <div class="macro">Carbs ${dynMacros.carbs}</div>
      <div class="macro">${appLang === "en" ? "Protein" : "Prote"} ${dynMacros.prot}</div>
      <div class="macro">${appLang === "en" ? "Fat" : "Grasa"} ${dynMacros.fat}</div>
    </div>
    <div class="calorie-bar">
      <div class="calorie-head">
        ${appLang === "en" ? "Calories today" : "Calorías hoy"}:
        <strong id="cal-val-${idx}">${calCalc.consumed}</strong>/<span>${calCalc.goal}</span> kcal
      </div>
      <div class="calorie-line">
        <span style="width:${calPercent}%" id="cal-bar-${idx}"></span>
      </div>
    </div>
    <div class="food-grid">
      ${buildMealBlock(idx, week, "desayuno", "🍳 " + (appLang === "en" ? "Breakfast" : "Desayuno"), day.desayuno, calState.meals.desayuno)}
      ${buildMealBlock(idx, week, "snackAM", "⏰ " + (appLang === "en" ? "Snack AM" : "Snack AM"), day.snackAM, calState.meals.snackAM)}
      ${buildMealBlock(idx, week, "almuerzo", "🥗 " + (appLang === "en" ? "Lunch" : "Almuerzo"), day.almuerzo, calState.meals.almuerzo)}
      ${buildMealBlock(idx, week, "snackPM", "🥜 " + (appLang === "en" ? "Snack PM" : "Snack PM"), day.snackPM, calState.meals.snackPM)}
      ${buildMealBlock(idx, week, "cena", "🍖 " + (appLang === "en" ? "Dinner" : "Cena"), day.cena, calState.meals.cena, true)}
    </div>
    <div class="workout-box">
      <strong>${appLang === "en" ? "Weekly focus" : "Foco semanal"}:</strong>
      <p class="small">${workout.focus}</p>
      <strong>${appLang === "en" ? "Today's training" : "Entrenamiento de hoy"}:</strong>
      <p class="small" id="workout-text-${idx}">${workout.today}</p>
      <button class="ia-btn small-btn" onclick="generateWorkoutAI(${idx}, ${week})">${appLang === "en" ? "Workout AI 🏋️" : "Entreno IA 🏋️"}</button>
      <div class="ai-workout-list" id="ai-workout-list-${idx}" style="display:none"></div>
    </div>
    <div class="day-actions">
      <button class="done-btn ${done ? "done" : ""}" onclick="toggleDone(${idx}, ${week})">
        ${done ? (appLang === "en" ? "✔ Day completed" : "✔ Día completado") : (appLang === "en" ? "Mark day ✔" : "Marcar día ✔")}
      </button>
      <button class="swap-btn" onclick="swapCena(${idx}, ${week})">
        ${appLang === "en" ? "Change dinner 🔁" : "Cambiar cena 🔁"}
      </button>
      <button class="ia-btn" onclick="generateFullDayAI(${idx}, ${week})">
        ${appLang === "en" ? "Full day AI 📅" : "Día completo IA 📅"}
      </button>
    </div>

  `;
  menuDays.appendChild(card);
  animateCards();
  document.querySelectorAll(".day-pill").forEach((p, i) => {
    const base = (week - 1) * 7;
    p.classList.toggle("active", (i + base) === idx);
  });
}

function buildMealBlock(idx, week, key, title, mealObj, done, isDinner = false) {
  const qty = mealObj && mealObj.qty ? mealObj.qty : "";
  const name = mealObj && mealObj.nombre ? mealObj.nombre : "";

  // ahora también la cena puede tener IA
  const canIA = (key === "desayuno" || key === "almuerzo" || key === "cena");

  return `
    <div class="meal ${done ? "meal-done" : ""}" ${isDinner ? 'id="cena-block"' : ""}>
      <div class="meal-title-row">
        <div class="meal-title-left">
          <span class="meal-title-text">${title}</span>
          <span class="meal-qty" ${isDinner ? 'id="cena-qty"' : ""}>${qty}</span>
        </div>
        <div class="meal-actions-right">
          ${canIA ? `<button class="ia-mini-btn" onclick="generateMealAI(${idx}, '${key}', ${week})">IA</button>` : ""}
          <button class="cal-btn" onclick="toggleMealCal(${idx}, '${key}', ${week})">${done ? "✓" : "+"}</button>
        </div>
      </div>
      <div class="meal-name" ${isDinner ? 'id="cena-text"' : ""}>${name}</div>
    </div>
  `;
}

// ====== TOGGLE DÍA COMPLETO ======
function toggleDone(idx, week) {
  const key = LS_PREFIX + "done-" + idx;
  const cur = localStorage.getItem(key) === "1";
  localStorage.setItem(key, cur ? "0" : "1");
  renderMenuDay(idx, week);
  updateProgressBar();
  showMotivation();
}
window.toggleDone = toggleDone;

// ====== SWAP CENA MANUAL ======
function swapCena(idx, week) {
  const option = cenaSwaps[Math.floor(Math.random() * cenaSwaps.length)];
  const existing = JSON.parse(localStorage.getItem(LS_AI_DAY_PREFIX + idx) || "{}");
  existing.cena = { nombre: option.nombre, qty: option.qty };
  localStorage.setItem(LS_AI_DAY_PREFIX + idx, JSON.stringify(existing));
  renderMenuDay(idx, week);
}
window.swapCena = swapCena;

// ====== LIMPIAR TEXTO CENA IA ======
function cleanAiDinnerText(raw) {
  if (!raw) return "";
  let text = raw.trim();
  text = text.replace(/\*\*/g, "");
  text = text.replace(/^\s*T[ií]tulo:\s*/i, "");
  if (text.length > 180) {
    const firstLine = text.split("\n").find(l => l.trim().length > 0) || text;
    text = firstLine.trim();
  }
  return text;
}

// ====== IA: DINNER ======
async function generateDinnerAI(idx) {
  const like = localStorage.getItem(LS_LIKE) || "";
  const dislike = localStorage.getItem(LS_DISLIKE) || "";
  const lang = appLang;
  const apiUser = localStorage.getItem(LS_API_USER) || "";
  const apiPass = localStorage.getItem(LS_API_PASS) || "";

  const prompt =
    lang === "en"
      ? `Make 1 short keto dinner (500-650 kcal). Prefer: ${like}. Avoid: ${dislike}. Respond ONLY with one simple line like "Chicken with broccoli in butter (150 g chicken, 120 g broccoli)".`
      : `Genera 1 cena keto corta (500-650 kcal). Prefiere: ${like}. Evita: ${dislike}. Responde SOLO con una línea así: "Pollo con brócoli en mantequilla (150 g pollo, 120 g brócoli)".`;

  try {
    const res = await fetch(GROK_PROXY, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, user: apiUser, pass: apiPass, mode: "dinner", lang })
    });
    const data = await res.json();
    if (!data.ok) {
      showToast(data.error || (lang === "en" ? "AI did not respond" : "IA no respondió"));
      return;
    }
    let aiText = cleanAiDinnerText(data.text || "");
    if (!aiText) {
      showToast(lang === "en" ? "AI returned empty text" : "La IA devolvió texto vacío");
      return;
    }
    const existing = JSON.parse(localStorage.getItem(LS_AI_DAY_PREFIX + idx) || "{}");
    existing.cena = { nombre: aiText, qty: lang === "en" ? "AI dinner" : "Cena IA" };
    localStorage.setItem(LS_AI_DAY_PREFIX + idx, JSON.stringify(existing));

    const week = Math.floor(idx / 7) + 1;
    renderMenuDay(idx, week);
    showToast(lang === "en" ? "AI dinner updated" : "Cena IA actualizada");
  } catch (e) {
    console.error(e);
    showToast(appLang === "en" ? "Error calling AI" : "Error llamando a la IA");
  }
}
window.generateDinnerAI = generateDinnerAI;

// ====== IA: DESAYUNO / ALMUERZO ======
async function generateMealAI(idx, mealKey, week) {
  const like = localStorage.getItem(LS_LIKE) || "";
  const dislike = localStorage.getItem(LS_DISLIKE) || "";
  const lang = appLang;
  const apiUser = localStorage.getItem(LS_API_USER) || "";
  const apiPass = localStorage.getItem(LS_API_PASS) || "";

  const mealNameES = mealKey === "desayuno" ? "desayuno" : "almuerzo";
  const mealNameEN = mealKey === "desayuno" ? "breakfast" : "lunch";

  const prompt =
    lang === "en"
      ? `Create 1 short keto ${mealNameEN} (~350-600 kcal). Prefer: ${like}. Avoid: ${dislike}. Respond ONLY with one line like "Scrambled eggs with feta and avocado (2 eggs, 30 g feta, 1/2 avocado)".`
      : `Genera 1 ${mealNameES} keto corto (~350-600 kcal). Prefiere: ${like}. Evita: ${dislike}. Responde SOLO con una línea así: "Huevos revueltos con feta y aguacate (2 huevos, 30 g feta, 1/2 aguacate)".`;

  try {
    const res = await fetch(GROK_PROXY, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, user: apiUser, pass: apiPass, mode: mealKey, lang })
    });
    const data = await res.json();
    if (!data.ok) {
      showToast(data.error || (lang === "en" ? "AI did not respond" : "IA no respondió"));
      return;
    }
    let text = (data.text || "").replace(/\*\*/g, "").trim();
    if (!text) {
      showToast(lang === "en" ? "AI returned empty text" : "La IA devolvió texto vacío");
      return;
    }
    const existing = JSON.parse(localStorage.getItem(LS_AI_DAY_PREFIX + idx) || "{}");
    existing[mealKey] = { nombre: text, qty: lang === "en" ? "AI " + mealNameEN : "IA " + mealNameES };
    localStorage.setItem(LS_AI_DAY_PREFIX + idx, JSON.stringify(existing));
    renderMenuDay(idx, week);
    showToast(lang === "en" ? "AI meal updated" : "Comida IA actualizada");
  } catch (e) {
    console.error(e);
    showToast(appLang === "en" ? "Error calling AI" : "Error llamando a la IA");
  }
}
window.generateMealAI = generateMealAI;

// ====== IA: DÍA COMPLETO ======
async function generateFullDayAI(idx, week) {
  const name = localStorage.getItem(LS_NAME) || "";
  const like = localStorage.getItem(LS_LIKE) || "";
  const dislike = localStorage.getItem(LS_DISLIKE) || "";
  const lang = appLang;
  const apiUser = localStorage.getItem(LS_API_USER) || "";
  const apiPass = localStorage.getItem(LS_API_PASS) || "";
  const baseDay = derivedPlan[idx];

  const payload = {
    mode: "full-day",
    lang,
    user: apiUser,
    pass: apiPass,
    kcal: baseDay.kcal,
    prefs: { like, dislike },
    dayIndex: idx + 1,
    username: name
  };

  try {
    const res = await fetch(GROK_PROXY, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!data.ok) {
      showToast(data.error || (lang === "en" ? "AI error" : "Error de IA"));
      return;
    }

    let structured = null;
    if (data.structured) {
      structured = data.structured;
    } else if (data.text) {
      try {
        structured = JSON.parse(data.text);
      } catch(e) {}
    }

    if (structured) {
      const normalized = {
        dia: baseDay.dia,
        kcal: structured.kcal || baseDay.kcal,
        macros: structured.macros || baseDay.macros,
        desayuno: structured.desayuno || baseDay.desayuno,
        snackAM: structured.snackAM || baseDay.snackAM,
        almuerzo: structured.almuerzo || baseDay.almuerzo,
        snackPM: structured.snackPM || baseDay.snackPM,
        cena: structured.cena || baseDay.cena
      };
      localStorage.setItem(LS_AI_DAY_PREFIX + idx, JSON.stringify(normalized));
      renderMenuDay(idx, week);
      showToast(lang === "en" ? "Full AI day applied" : "Día IA aplicado");
    } else {
      showToast(lang === "en" ? "AI answered but was not structured" : "La IA respondió pero no en formato estructurado");
    }
  } catch (e) {
    console.error(e);
    showToast(lang === "en" ? "Error calling AI" : "Error llamando a la IA");
  }
}
window.generateFullDayAI = generateFullDayAI;

// ====== IA: WORKOUT DEL DÍA (FORMATO LIMPIO) ======
function parseWorkoutTextToClean(raw, lang) {
  // fallback por si la IA no devuelve JSON
  const lines = (raw || "").split("\n").map(l => l.trim()).filter(Boolean);
  return lines.map((l, i) => ({
    nombre: l.replace(/^\d+[\).\-\s]*/, "").replace(/^\-\s*/, ""),
    series: lang === "en" ? "3 sets" : "3 series",
    descripcion: ""
  }));
}

async function generateWorkoutAI(idx, week) {
  const apiUser = localStorage.getItem(LS_API_USER) || "";
  const apiPass = localStorage.getItem(LS_API_PASS) || "";
  const lang = appLang;
  const prompt =
    lang === "en"
      ? "Return a JSON with a field 'ejercicios' that is an array of up to 5 items. Each item: {\"nombre\": short exercise name, \"series\": like \"3 x 12\" or time, \"descripcion\": very short tip}. Bodyweight only. Beginner/intermediate. English."
      : "Devuelve un JSON con un campo 'ejercicios' que sea un array de máximo 5 ítems. Cada ítem: {\"nombre\": nombre corto del ejercicio, \"series\": por ejemplo \"3 x 12\" o tiempo, \"descripcion\": tip muy corto}. Solo peso corporal. Nivel inicial/intermedio. Español.";

  try {
    const res = await fetch(GROK_PROXY, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: "workout-day", user: apiUser, pass: apiPass, lang, prompt })
    });
    const data = await res.json();
    if (!data.ok) {
      showToast(data.error || (lang === "en" ? "AI did not respond" : "IA no respondió"));
      return;
    }
    const box = document.getElementById("ai-workout-list-" + idx);
    if (box) {
      let workouts = [];
      if (data.structured && Array.isArray(data.structured.ejercicios)) {
        workouts = data.structured.ejercicios;
      } else {
        try {
          const parsed = JSON.parse(data.text);
          if (parsed && Array.isArray(parsed.ejercicios)) {
            workouts = parsed.ejercicios;
          } else {
            workouts = parseWorkoutTextToClean(data.text, lang);
          }
        } catch(e) {
          workouts = parseWorkoutTextToClean(data.text, lang);
        }
      }

      box.innerHTML =
        `<p class="small"><strong>${lang === "en" ? "AI workout" : "Entreno IA"}:</strong></p>` +
        `<div class="ai-workout-grid">` +
        workouts
          .map(w => {
            const n = w.nombre || w.name || "";
            const s = w.series || w.reps || "";
            const d = w.descripcion || w.desc || "";
            return `
              <div class="ai-workout-item">
                <div class="ai-w-name">${n}</div>
                <div class="ai-w-series">${s}</div>
                <div class="ai-w-desc">${d}</div>
              </div>
            `;
          })
          .join("") +
        `</div>`;
      box.style.display = "block";
    }
    showToast(lang === "en" ? "Workout generated" : "Entreno generado");
  } catch (e) {
    console.error(e);
    showToast(appLang === "en" ? "Error calling AI" : "Error llamando a la IA");
  }
}
window.generateWorkoutAI = generateWorkoutAI;

// ====== COMPRAS ======
function renderCompras() {
  const container = document.getElementById("compras");
  container.innerHTML = "";
  const done = getCompletedCount();
  const dash = document.createElement("div");
  dash.className = "list-row";
  dash.innerHTML = `
    <strong>${appLang === "en" ? "Quick summary" : "Resumen rápido"}</strong>
    <div class="small">${appLang === "en" ? "Completed days" : "Días completados"}: ${done} ${appLang === "en" ? "of" : "de"} ${derivedPlan.length}</div>
  `;
  container.appendChild(dash);

  const list = appLang === "en" ? [
    {cat:"Proteins",items:"Eggs, chicken, salmon, shrimp, beef, greek yogurt"},
    {cat:"Veggies",items:"Broccoli, cauliflower, cherry tomato, rocket, avocado, mushrooms"},
    {cat:"Healthy fats",items:"Butter, olive oil, heavy cream, feta cheese"},
    {cat:"Snacks",items:"Cashews, nuts, chia, shredded coconut"},
    {cat:"Others",items:"Sugar-free coffee, pink salt, lemon"}
  ] : [
    {cat:"Proteínas",items:"Huevos, pollo, salmón, camarones, carne de res, yogur griego"},
    {cat:"Verduras",items:"Brócoli, coliflor, tomate cherry, rúcula/rocket, aguacate, champiñón"},
    {cat:"Grasas buenas",items:"Mantequilla, aceite de oliva, crema de leche, queso feta"},
    {cat:"Snacks",items:"Marañones, nueces, chía, coco rallado"},
    {cat:"Otros",items:"Café sin azúcar, sal rosada, limón"}
  ];
  list.forEach(it => {
    const row = document.createElement("div");
    row.className = "list-row";
    row.innerHTML = `<strong>${it.cat}</strong><div class="small">${it.items}</div>`;
    container.appendChild(row);
  });

  const aiExtras = [];
  for (let idx = 0; idx < derivedPlan.length; idx++) {
    const aiDay = localStorage.getItem(LS_AI_DAY_PREFIX + idx);
    if (aiDay) {
      try {
        const parsed = JSON.parse(aiDay);
        ["desayuno","snackAM","almuerzo","snackPM","cena"].forEach(m => {
          if (parsed[m] && parsed[m].qty) aiExtras.push(parsed[m].qty);
        });
      } catch(e) {}
    }
  }
  if (aiExtras.length) {
    const row = document.createElement("div");
    row.className = "list-row";
    row.innerHTML = `<strong>${appLang === "en" ? "AI extras" : "Extras IA"}</strong>
    <div class="small">${aiExtras.join(" • ")}</div>`;
    container.appendChild(row);
  }

  animateCards();
}

// ====== BODY FAT ESTIMATE ======
function estimateBodyFat(heightCm, weightKg) {
  if (!heightCm || !weightKg) return null;
  const h = Number(heightCm) / 100;
  const w = Number(weightKg);
  if (!h || !w) return null;
  const bmi = w / (h * h);
  let bf = 1.2 * bmi + 5;
  if (bf < 6) bf = 6;
  if (bf > 50) bf = 50;
  return bf.toFixed(1);
}

// ====== PROGRESO ======
function renderProgreso() {
  const container = document.getElementById("progreso");
  container.innerHTML = "";

  const heightSaved = localStorage.getItem(LS_HEIGHT) || "";
  const startWeightSaved = localStorage.getItem(LS_START_WEIGHT) || "";

  const baseBox = document.createElement("div");
  baseBox.className = "list-row";
  baseBox.innerHTML = `
    <strong>${appLang === "en" ? "Base data" : "Datos base"}</strong>
    <p class="small">${appLang === "en" ? "Enter your height and initial weight to estimate body fat." : "Pon tu estatura y tu peso inicial para calcular % de grasa aproximado."}</p>
    <input type="number" id="heightCm" placeholder="${appLang === "en" ? "Height (cm)" : "Estatura (cm)"}" value="${heightSaved}">
    <input type="number" id="startWeight" placeholder="${appLang === "en" ? "Initial weight (kg)" : "Peso inicial (kg)"}" value="${startWeightSaved}">
    <button class="save-btn" onclick="saveBaseProgress()">${appLang === "en" ? "Save base data" : "Guardar datos base"}</button>
    <p class="small" id="bfInfo"></p>
  `;
  container.appendChild(baseBox);

  const shareBox = document.createElement("div");
  shareBox.className = "list-row";
  shareBox.innerHTML = `
    <strong>${appLang === "en" ? "Share results" : "Compartir resultados"}</strong>
    <p class="small">${appLang === "en" ? "Create a summary to share." : "Genera un resumen para enviar por WhatsApp o correo."}</p>
    <button class="save-btn" onclick="shareProgress()">${appLang === "en" ? "Share progress" : "Compartir progreso"}</button>
  `;
  container.appendChild(shareBox);

  const canvasWrap = document.createElement("div");
  canvasWrap.style.height = "210px";
  canvasWrap.style.position = "relative";
  const canvas = document.createElement("canvas");
  canvas.id = "weightChart";
  canvas.style.maxWidth = "100%";
  canvasWrap.appendChild(canvas);
  container.appendChild(canvasWrap);

  const canvasWrap2 = document.createElement("div");
  canvasWrap2.style.height = "210px";
  canvasWrap2.style.position = "relative";
  const canvas2 = document.createElement("canvas");
  canvas2.id = "exerciseChart";
  canvas2.style.maxWidth = "100%";
  canvasWrap2.appendChild(canvas2);
  container.appendChild(canvasWrap2);

  const note = document.createElement("div");
  note.className = "list-row";
  note.textContent = appLang === "en" ? "Stored in this browser." : "Se guarda en este navegador.";
  container.appendChild(note);

  derivedPlan.forEach((d, idx) => {
    const saved = JSON.parse(localStorage.getItem(LS_PROGRESS_PREFIX + idx) || "{}");
    const hasData = saved.peso || saved.cintura || saved.energia || saved.notas || saved.exkcal;
    const card = document.createElement("div");
    card.className = "day-card";
    card.innerHTML = `
      <div class="day-title"><h2>${d.dia}</h2><span class="kcal">${d.kcal} kcal</span></div>
      <div class="prog-form" id="prog-form-${idx}" ${hasData ? 'style="display:none"' : ''}>
        <input type="number" placeholder="${appLang === "en" ? "Weight (kg)" : "Peso (kg)"}" id="peso-${idx}" value="${saved.peso || ""}">
        <input type="number" placeholder="${appLang === "en" ? "Waist (cm)" : "Cintura (cm)"}" id="cintura-${idx}" value="${saved.cintura || ""}">
        <input type="number" placeholder="${appLang === "en" ? "Energy (1-10)" : "Energía (1-10)"}" id="energia-${idx}" value="${saved.energia || ""}">
        <input type="number" placeholder="${appLang === "en" ? "Exercise kcal" : "Calorías ejercicio (kcal)"}" id="exkcal-${idx}" value="${saved.exkcal || ""}">
        <textarea placeholder="${appLang === "en" ? "Notes" : "Notas"}" id="nota-${idx}">${saved.notas || ""}</textarea>
        <button class="save-btn" onclick="saveProgreso(${idx})">${appLang === "en" ? "Save" : "Guardar"}</button>
      </div>
      <div class="prog-resumen" id="prog-resumen-${idx}" ${hasData ? "" : 'style="display:none"'}>
        <p class="small">
          ${saved.peso ? (appLang === "en" ? `Weight: ${saved.peso} kg` : `Peso: ${saved.peso} kg`) : ""}
          ${saved.cintura ? (appLang === "en" ? ` | Waist: ${saved.cintura} cm` : ` | Cintura: ${saved.cintura} cm`) : ""}
          ${saved.energia ? (appLang === "en" ? ` | Energy: ${saved.energia}` : ` | Energía: ${saved.energia}`) : ""}
          ${saved.exkcal ? (appLang === "en" ? ` | Ex kcal: ${saved.exkcal}` : ` | Ej kcal: ${saved.exkcal}`) : ""}
        </p>
        ${saved.notas ? `<p class="small">${appLang === "en" ? "Notes: " : "Notas: "}${saved.notas}</p>` : ""}
        <button class="save-btn" onclick="editarProgreso(${idx})">${appLang === "en" ? "Edit" : "Editar"}</button>
      </div>
    `;
    container.appendChild(card);
  });
  animateCards();
  drawChart();
  drawExerciseChart();
  updateBodyFatInfo();
}

function saveBaseProgress() {
  const h = document.getElementById("heightCm").value;
  const sw = document.getElementById("startWeight").value;
  if (h) localStorage.setItem(LS_HEIGHT, h);
  if (sw) localStorage.setItem(LS_START_WEIGHT, sw);
  showToast(appLang === "en" ? "Base data saved" : "Datos base guardados");
  updateBodyFatInfo();
  drawChart();
  drawExerciseChart();
}
function updateBodyFatInfo() {
  const el = document.getElementById("bfInfo");
  if (!el) return;
  const h = localStorage.getItem(LS_HEIGHT);
  let lastWeight = localStorage.getItem(LS_START_WEIGHT) || "";
  for (let i = derivedPlan.length - 1; i >= 0; i--) {
    const saved = JSON.parse(localStorage.getItem(LS_PROGRESS_PREFIX + i) || "{}");
    if (saved.peso) { lastWeight = saved.peso; break; }
  }
  if (h && lastWeight) {
    const bf = estimateBodyFat(h, lastWeight);
    if (bf) el.textContent = (appLang === "en" ? "Estimated body fat: " : "Estimación de grasa corporal: ") + bf + " %";
    else el.textContent = "";
  } else {
    el.textContent = "";
  }
}
function shareProgress() {
  const name = localStorage.getItem(LS_NAME) || (appLang === "en" ? "My keto progress" : "Mi progreso Keto");
  const done = getCompletedCount();
  const lastIdx = derivedPlan.length - 1;
  let lastPeso = "";
  for (let i = lastIdx; i >= 0; i--) {
    const saved = JSON.parse(localStorage.getItem(LS_PROGRESS_PREFIX + i) || "{}");
    if (saved.peso) { lastPeso = saved.peso; break; }
  }
  const text = appLang === "en"
    ? `${name} is doing the keto plan. Completed days: ${done} of ${derivedPlan.length}${lastPeso ? (". Latest weight: " + lastPeso + " kg.") : "."}`
    : `${name} está haciendo el plan keto. Días completados: ${done} de ${derivedPlan.length}${lastPeso ? (". Peso más reciente: " + lastPeso + " kg.") : "."}`;
  if (navigator.share) {
    navigator.share({ title: appLang === "en" ? "My keto progress" : "Progreso keto", text }).catch(() => {});
  } else {
    showToast(text, 4000);
  }
}
window.shareProgress = shareProgress;

function saveProgreso(idx) {
  const data = {
    peso: document.getElementById("peso-" + idx).value,
    cintura: document.getElementById("cintura-" + idx).value,
    energia: document.getElementById("energia-" + idx).value,
    exkcal: document.getElementById("exkcal-" + idx).value,
    notas: document.getElementById("nota-" + idx).value
  };
  localStorage.setItem(LS_PROGRESS_PREFIX + idx, JSON.stringify(data));
  showToast(appLang === "en" ? "Saved ✅" : "Guardado ✅");
  drawChart();
  drawExerciseChart();
  updateBodyFatInfo();

  const form = document.getElementById("prog-form-" + idx);
  const resumen = document.getElementById("prog-resumen-" + idx);
  if (form && resumen) {
    form.style.display = "none";
    resumen.style.display = "block";
    let html = "";
    if (data.peso) html += (appLang === "en" ? `Weight: ${data.peso} kg` : `Peso: ${data.peso} kg`);
    if (data.cintura) html += (appLang === "en" ? ` | Waist: ${data.cintura} cm` : ` | Cintura: ${data.cintura} cm`);
    if (data.energia) html += (appLang === "en" ? ` | Energy: ${data.energia}` : ` | Energía: ${data.energia}`);
    if (data.exkcal) html += (appLang === "en" ? ` | Ex kcal: ${data.exkcal}` : ` | Ej kcal: ${data.exkcal}`);
    resumen.querySelector("p.small").innerHTML = html;
    const extraNotes = resumen.querySelectorAll("p.small")[1];
    if (extraNotes) extraNotes.remove();
    if (data.notas) {
      const np = document.createElement("p");
      np.className = "small";
      np.textContent = (appLang === "en" ? "Notes: " : "Notas: ") + data.notas;
      resumen.insertBefore(np, resumen.querySelector("button.save-btn"));
    }
  }
}
window.saveProgreso = saveProgreso;

function editarProgreso(idx) {
  const form = document.getElementById("prog-form-" + idx);
  const resumen = document.getElementById("prog-resumen-" + idx);
  if (form && resumen) {
    form.style.display = "block";
    resumen.style.display = "none";
  }
}
window.editarProgreso = editarProgreso;

// ====== TABS ======
function switchTab(target) {
  const sections = ["menu","compras","progreso","ajustes"];
  sections.forEach(id => {
    const el = document.getElementById(id);
    const isTarget = id === target;
    el.style.display = isTarget ? "block" : "none";
    if (id === "progreso" && !isTarget) {
      if (weightChart) { weightChart.destroy(); weightChart = null; }
      if (exerciseChart) { exerciseChart.destroy(); exerciseChart = null; }
      el.innerHTML = "";
    }
  });
  document.querySelectorAll(".tab").forEach(t => t.classList.toggle("active", t.dataset.tab === target));
  document.querySelectorAll(".bottom-btn").forEach(t => t.classList.toggle("active", t.dataset.tab === target));
  hideToast();

  if (target === "menu") {
    // preferir lo último que vio el usuario
    let idx = Number(localStorage.getItem(LS_SELECTED_DAY));
    let week = Number(localStorage.getItem(LS_SELECTED_WEEK));
    if (isNaN(idx) || idx < 0 || idx >= derivedPlan.length) {
      idx = getCurrentDayIndex();
    }
    if (isNaN(week) || week < 1) {
      week = Math.floor(idx / 7) + 1;
    }

    if (!dailyView) {
      setWeekActive(week);
      renderDayPills(week);
      renderMenuDay(idx, week);
    } else {
      renderMenuDay(idx, week);
    }
    updateProgressBar();
    showMotivation();
  }
  if (target === "compras") renderCompras();
  if (target === "progreso") renderProgreso();
  if (target === "ajustes") {
    const saved = localStorage.getItem(LS_START);
    if (saved) document.getElementById("startDateInput").value = saved;
    document.getElementById("planWeeks").value = currentWeeks;
    document.getElementById("dailyView").value = dailyView;
    const pColor = localStorage.getItem(LS_PRIMARY) || "#0f766e";
    document.getElementById("primaryColor").value = pColor;
    document.getElementById("appLang").value = appLang;
    document.getElementById("likeFoods").value = localStorage.getItem(LS_LIKE) || "";
    document.getElementById("dislikeFoods").value = localStorage.getItem(LS_DISLIKE) || "";
    document.getElementById("apiUser").value = localStorage.getItem(LS_API_USER) || "";
    document.getElementById("apiPass").value = localStorage.getItem(LS_API_PASS) || "";
  }
}
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => switchTab(tab.dataset.tab));
});
document.querySelectorAll(".bottom-btn").forEach(btn => {
  btn.addEventListener("click", () => switchTab(btn.dataset.tab));
});
document.addEventListener("click", e => {
  if (e.target.classList.contains("week-btn")) {
    document.querySelectorAll(".week-btn").forEach(b => b.classList.remove("active"));
    e.target.classList.add("active");
    const week = Number(e.target.dataset.week);
    renderDayPills(week);
    const idx = (week - 1) * 7;
    renderMenuDay(idx, week);
  }
});

// ====== THEME ======
const themeToggle = document.getElementById("themeToggle");
const savedTheme = localStorage.getItem(LS_THEME) || "dark";
document.body.setAttribute("data-theme", savedTheme);
themeToggle.checked = savedTheme === "dark";
themeToggle.addEventListener("change", () => {
  const mode = themeToggle.checked ? "dark" : "light";
  document.body.setAttribute("data-theme", mode);
  localStorage.setItem(LS_THEME, mode);
  if (document.getElementById("progreso").style.display === "block") {
    drawChart();
    drawExerciseChart();
  }
  hideToast();
});

// ====== AJUSTES DINÁMICOS ======
function changeDailyView() {
  const val = Number(document.getElementById("dailyView").value);
  dailyView = val;
  localStorage.setItem(LS_DAILY_VIEW, String(val));
  renderWeekButtons();
  switchTab("menu");
}
function changePrimaryColor() {
  const val = document.getElementById("primaryColor").value;
  document.documentElement.style.setProperty("--primary", val);
  localStorage.setItem(LS_PRIMARY, val);
  showToast(appLang === "en" ? "Color updated" : "Color actualizado");
  if (document.getElementById("progreso").style.display === "block") {
    drawChart();
    drawExerciseChart();
  }
}
function changePlanWeeks() {
  const val = Number(document.getElementById("planWeeks").value);
  currentWeeks = val;
  localStorage.setItem(LS_PLAN_WEEKS, String(val));
  derivedPlan = buildPlan(currentWeeks);
  renderWeekButtons();
  const idx = getCurrentDayIndex();
  const week = Math.floor(idx / 7) + 1;
  if (!dailyView) {
    setWeekActive(week);
    renderDayPills(week);
  }
  renderMenuDay(idx, week);
  updateProgressBar();
  showToast(appLang === "en" ? "Plan updated" : "Plan actualizado a " + val + " semanas");
}
function setWeekActive(week) {
  document.querySelectorAll(".week-btn").forEach(b => {
    b.classList.toggle("active", Number(b.dataset.week) === week);
  });
}
function resetAll() {
  const keys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith(LS_PREFIX)) keys.push(k);
  }
  keys.forEach(k => localStorage.removeItem(k));
  showToast(appLang === "en" ? "All cleared" : "Todo borrado");
  setTimeout(() => location.reload(), 500);
}
window.resetAll = resetAll;

function changeAppLang() {
  const val = document.getElementById("appLang").value;
  appLang = val;
  localStorage.setItem(LS_LANG, val);
  switchTab("menu");
  setRandomTip(localStorage.getItem(LS_NAME) || "");
}
window.changeAppLang = changeAppLang;

function saveFoodPrefs() {
  const like = document.getElementById("likeFoods").value.trim();
  const dislike = document.getElementById("dislikeFoods").value.trim();
  localStorage.setItem(LS_LIKE, like);
  localStorage.setItem(LS_DISLIKE, dislike);
  showToast(appLang === "en" ? "Food preferences saved" : "Preferencias guardadas");
}
window.saveFoodPrefs = saveFoodPrefs;

function saveApiAccess() {
  const u = document.getElementById("apiUser").value.trim();
  const p = document.getElementById("apiPass").value.trim();
  localStorage.setItem(LS_API_USER, u);
  localStorage.setItem(LS_API_PASS, p);
  showToast(appLang === "en" ? "API access saved" : "Acceso API guardado");
}
window.saveApiAccess = saveApiAccess;

// ====== ANIMACIONES ======
function animateCards() {
  const items = document.querySelectorAll(".day-card, .list-row");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("show"); });
    }, {threshold: .15});
    items.forEach(i => observer.observe(i));
  } else {
    items.forEach(i => i.classList.add("show"));
  }
}

// ====== CHARTS ======
function getPrimaryColor() {
  return getComputedStyle(document.documentElement).getPropertyValue("--primary").trim() || "#0f766e";
}
function drawChart() {
  const ctx = document.getElementById("weightChart");
  if (!ctx || typeof Chart === "undefined") return;

  const startWeight = parseFloat(localStorage.getItem(LS_START_WEIGHT) || "0") || null;
  const height = parseFloat(localStorage.getItem(LS_HEIGHT) || "0") || null;

  const labels = ["Inicio"];
  const weightData = [startWeight];
  const bodyFatData = [(height && startWeight) ? parseFloat(estimateBodyFat(height, startWeight)) : null];

  for (let idx = 0; idx < derivedPlan.length; idx++) {
    labels.push(derivedPlan[idx].dia);
    const saved = JSON.parse(localStorage.getItem(LS_PROGRESS_PREFIX + idx) || "{}");
    const w = saved.peso ? parseFloat(saved.peso) : null;
    weightData.push(w);
    if (height && w) {
      bodyFatData.push(parseFloat(estimateBodyFat(height, w)));
    } else {
      bodyFatData.push(null);
    }
  }

  if (weightChart) weightChart.destroy();

  const isDark = document.body.getAttribute("data-theme") === "dark";
  const axisColor = isDark ? "rgba(226,232,240,.8)" : "rgba(15,23,42,.7)";
  const gridColor = isDark ? "rgba(226,232,240,.06)" : "rgba(15,23,42,.05)";
  const fatColor = "#f97316";

  weightChart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: appLang === "en" ? "Weight (kg)" : "Peso (kg)",
          data: weightData,
          borderWidth: 2,
          borderColor: getPrimaryColor(),
          backgroundColor: getPrimaryColor(),
          tension: .35,
          pointRadius: 3,
          pointHoverRadius: 4
        },
        {
          label: appLang === "en" ? "Body fat (%) est." : "% Grasa (est.)",
          data: bodyFatData,
          borderWidth: 2,
          borderColor: fatColor,
          backgroundColor: fatColor,
          tension: .35,
          pointRadius: 3,
          borderDash: [4,4],
          yAxisID: "y1"
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          labels: {
            color: axisColor,
            usePointStyle: true,
            pointStyle: "circle",
            boxWidth: 8
          }
        },
        tooltip: { mode: "index", intersect: false }
      },
      scales: {
        x: {
          ticks: { color: axisColor, autoSkip: true, maxTicksLimit: 8 },
          grid: { color: gridColor }
        },
        y: {
          beginAtZero: false,
          ticks: { color: axisColor },
          grid: { color: gridColor },
          title: { display: true, text: "kg", color: axisColor, font: { size: 10 } }
        },
        y1: {
          position: "right",
          ticks: { color: axisColor },
          grid: { drawOnChartArea: false },
          title: { display: true, text: appLang === "en" ? "% fat" : "% grasa", color: axisColor, font: { size: 10 } },
          suggestedMin: 5,
          suggestedMax: 45
        }
      }
    }
  });
}

function drawExerciseChart() {
  const ctx = document.getElementById("exerciseChart");
  if (!ctx || typeof Chart === "undefined") return;

  const labels = [];
  const planKcal = [];
  const exerciseKcal = [];
  const energy = [];

  for (let idx = 0; idx < derivedPlan.length; idx++) {
    labels.push(derivedPlan[idx].dia);
    planKcal.push(derivedPlan[idx].kcal || 1600);
    const saved = JSON.parse(localStorage.getItem(LS_PROGRESS_PREFIX + idx) || "{}");
    exerciseKcal.push(saved.exkcal ? Number(saved.exkcal) : 0);
    energy.push(saved.energia ? Number(saved.energia) : null);
  }

  if (exerciseChart) exerciseChart.destroy();

  const isDark = document.body.getAttribute("data-theme") === "dark";
  const axisColor = isDark ? "rgba(226,232,240,.8)" : "rgba(15,23,42,.7)";
  const gridColor = isDark ? "rgba(226,232,240,.06)" : "rgba(15,23,42,.05)";

  exerciseChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          type: "line",
          label: appLang === "en" ? "Plan kcal" : "Plan kcal",
          data: planKcal,
          borderColor: getPrimaryColor(),
          borderWidth: 2,
          tension: .35,
          pointRadius: 2,
          yAxisID: "y"
        },
        {
          label: appLang === "en" ? "Exercise kcal" : "Calorías ejercicio",
          data: exerciseKcal,
          backgroundColor: getPrimaryColor(),
          yAxisID: "y"
        },
        {
          type: "line",
          label: appLang === "en" ? "Energy (1-10)" : "Energía (1-10)",
          data: energy,
          borderColor: "#f97316",
          borderWidth: 2,
          yAxisID: "y1",
          tension: .35,
          pointRadius: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: axisColor } }
      },
      scales: {
        x: { ticks: { color: axisColor }, grid: { color: gridColor } },
        y: {
          ticks: { color: axisColor },
          grid: { color: gridColor },
          title: { display: true, text: "kcal", color: axisColor, font: { size: 10 } }
        },
        y1: {
          position: "right",
          ticks: { color: axisColor, stepSize: 1, suggestedMin: 0, suggestedMax: 10 },
          grid: { drawOnChartArea: false },
          title: { display: true, text: appLang === "en" ? "Energy" : "Energía", color: axisColor, font: { size: 10 } }
        }
      }
    }
  });
}

// ====== INIT ======
(function init() {
  const savedPrimary = localStorage.getItem(LS_PRIMARY);
  if (savedPrimary) {
    document.documentElement.style.setProperty("--primary", savedPrimary);
  }

  const savedLang = localStorage.getItem(LS_LANG);
  appLang = savedLang || "es";

  const savedWeeks = Number(localStorage.getItem(LS_PLAN_WEEKS) || "2");
  currentWeeks = savedWeeks >= 2 && savedWeeks <= 4 ? savedWeeks : 2;
  derivedPlan = buildPlan(currentWeeks);

  dailyView = Number(localStorage.getItem(LS_DAILY_VIEW) || "0");

  const name = localStorage.getItem(LS_NAME) || "";
  if (name) {
    setHeaderName(name);
    setRandomTip(name);
  } else {
    const modal = document.getElementById("nameModal");
    if (modal) modal.style.display = "flex";
    setRandomTip();
  }

  askStartDateIfNeeded();
  renderWeekButtons();

  // preferimos lo último que vio; si no hay, usamos índice por fecha
  let idx = Number(localStorage.getItem(LS_SELECTED_DAY));
  let week = Number(localStorage.getItem(LS_SELECTED_WEEK));
  if (isNaN(idx) || idx < 0 || idx >= derivedPlan.length) {
    idx = getCurrentDayIndex();
  }
  if (isNaN(week) || week < 1) {
    week = Math.floor(idx / 7) + 1;
  }

  if (!dailyView) {
    setWeekActive(week);
    renderDayPills(week);
  }
  renderMenuDay(idx, week);
  updateProgressBar();
  showMotivation();
  hideToast();
})();
