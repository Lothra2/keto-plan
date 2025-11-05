// Keto Pro App
document.addEventListener("DOMContentLoaded", () => {
  /* ----------------------- CONSTANTES Y KEYS ---------------------- */
  const LS_PREFIX = "keto14-rick-";
  const LS_NAME = LS_PREFIX + "name";
  const LS_THEME = LS_PREFIX + "theme";
  const LS_START = LS_PREFIX + "start-date";
  const LS_PLAN_WEEKS = LS_PREFIX + "plan-weeks";
  const LS_DAILY_VIEW = LS_PREFIX + "daily-view";
  const LS_PRIMARY = LS_PREFIX + "primary-color";
  const toastEl = document.getElementById("toast");

  let weightChart = null;
  let derivedPlan = [];
  let currentWeeks = 2;
  let dailyView = 0;

  /* ----------------------- PLAN BASE ------------------------------ */
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

  const tips = [
    "🥤 Toma agua con un poco de sal.",
    "🥑 Si tienes hambre sube grasa.",
    "🍳 Dos huevos extra están bien.",
    "📸 Foto día 1 y foto día final.",
    "🧴 Puedes cambiar mantequilla por aceite.",
    "🧂 No le tengas miedo a la sal en keto.",
    "💤 Dormir mejor ayuda a bajar más.",
  ];

  /* ---------------------- SELECTORES ---------------------- */
  const themeToggle = document.getElementById("themeToggle");
  const tipBox = document.getElementById("tipBox");
  const nameModal = document.getElementById("nameModal");

  /* ---------------------- INIT ---------------------- */
  (function init() {
    // theme
    const savedTheme = localStorage.getItem(LS_THEME) || "dark";
    document.body.setAttribute("data-theme", savedTheme);
    themeToggle.checked = savedTheme === "dark";

    // primary
    const savedPrimary = localStorage.getItem(LS_PRIMARY);
    if (savedPrimary) {
      document.documentElement.style.setProperty("--primary", savedPrimary);
    }

    // weeks
    const savedWeeks = Number(localStorage.getItem(LS_PLAN_WEEKS) || "2");
    currentWeeks = savedWeeks >= 2 && savedWeeks <= 4 ? savedWeeks : 2;

    // build plan
    derivedPlan = buildPlan(currentWeeks);

    // daily view
    dailyView = Number(localStorage.getItem(LS_DAILY_VIEW) || "0");

    // name
    const name = localStorage.getItem(LS_NAME) || "";
    if (name) {
      setHeaderName(name);
      setRandomTip(name);
    } else {
      nameModal.style.display = "flex";
      setRandomTip();
    }

    // start date default
    askStartDateIfNeeded();

    // render UI
    renderWeekButtons();
    const idx = getCurrentDayIndex();
    const week = Math.floor(idx / 7) + 1;
    if (!dailyView) {
      setWeekActive(week);
      renderDayPills(week);
    }
    renderMenuDay(idx, week);
    updateProgressBar();
    showMotivation();

    // tabs
    document.querySelectorAll(".tab").forEach(tab => {
      tab.addEventListener("click", () => switchTab(tab.dataset.tab));
    });
    document.querySelectorAll(".bottom-btn").forEach(btn => {
      btn.addEventListener("click", () => switchTab(btn.dataset.tab));
    });

    // week click (delegado)
    document.addEventListener("click", e => {
      if (e.target.classList.contains("week-btn")) {
        document.querySelectorAll(".week-btn").forEach(b => b.classList.remove("active"));
        e.target.classList.add("active");
        const w = Number(e.target.dataset.week);
        renderDayPills(w);
        const idx = (w - 1) * 7;
        renderMenuDay(idx, w);
      }
    });

    // theme toggle
    themeToggle.addEventListener("change", () => {
      const mode = themeToggle.checked ? "dark" : "light";
      document.body.setAttribute("data-theme", mode);
      localStorage.setItem(LS_THEME, mode);
    });
  })();

  /* ---------------------- FUNCIONES PRINCIPALES ---------------------- */
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

  function setRandomTip(name) {
    const base = tips[Math.floor(Math.random() * tips.length)];
    tipBox.textContent = name ? base + " " + name + "." : base;
  }

  function setHeaderName(name) {
    const sub = document.getElementById("subTitle");
    sub.textContent = "Para " + name;
    const settings = document.getElementById("settingsName");
    if (settings) settings.value = name;
  }

  function askStartDateIfNeeded() {
    const saved = localStorage.getItem(LS_START);
    if (!saved) {
      const today = new Date().toISOString().slice(0,10);
      localStorage.setItem(LS_START, today);
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

  function renderWeekButtons() {
    const ws = document.getElementById("weekSwitch");
    ws.innerHTML = "";
    for (let w = 1; w <= currentWeeks; w++) {
      const btn = document.createElement("div");
      btn.className = "week-btn" + (w === 1 ? " active" : "");
      btn.dataset.week = w;
      btn.textContent = "Semana " + w + " (" + ((w - 1) * 7 + 1) + "-" + (w * 7) + ")";
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

  function getCompletedCount() {
    let count = 0;
    for (let i = 0; i < derivedPlan.length; i++) {
      if (localStorage.getItem(LS_PREFIX + "done-" + i) === "1") count++;
    }
    return count;
  }

  function updateProgressBar() {
    const count = getCompletedCount();
    document.getElementById("progressText").textContent = `${count} de ${derivedPlan.length} días`;
    document.getElementById("progressBar").style.width = (count / derivedPlan.length * 100) + "%";
  }

  function getExercisesForWeek(week) {
    const all = {
      1: ["Caminar 30 min 4 veces", "2 sesiones de movilidad cadera", "Planchas 3 x 30 seg"],
      2: ["Caminar 35 min 4 veces", "1 día de fuerza pierna peso corporal", "Abdominales 3 x 15"],
      3: ["Caminar rápido 30 min 5 veces", "Fuerza torso (lagartijas apoyadas)", "Estiramientos 10 min"],
      4: ["Caminar 40 min 4 veces", "Fuerza completa 2 días", "Respiración 5 min"]
    };
    return all[week] || all[1];
  }

  function renderMenuDay(idx, week) {
    const menuDays = document.getElementById("menuDays");
    menuDays.innerHTML = "";
    const day = derivedPlan[idx];
    const done = localStorage.getItem(LS_PREFIX + "done-" + idx) === "1";
    const card = document.createElement("div");
    card.className = "day-card";
    const exercises = getExercisesForWeek(week);
    card.innerHTML = `
      <div class="day-title">
        <h2>${day.dia}</h2>
        <div class="kcal">${day.kcal} kcal</div>
      </div>
      <div class="macros">
        <div class="macro">Carbs ${day.macros.carbs}</div>
        <div class="macro">Prote ${day.macros.prot}</div>
        <div class="macro">Grasa ${day.macros.fat}</div>
      </div>
      <div class="food-grid">
        <div class="meal">
          <div class="meal-title"><span>🍳 Desayuno</span><span class="meal-qty">${day.desayuno.qty}</span></div>
          <div>${day.desayuno.nombre}</div>
        </div>
        <div class="meal">
          <div class="meal-title"><span>⏰ Snack AM</span><span class="meal-qty">${day.snackAM.qty}</span></div>
          <div>${day.snackAM.nombre}</div>
        </div>
        <div class="meal">
          <div class="meal-title"><span>🥗 Almuerzo</span><span class="meal-qty">${day.almuerzo.qty}</span></div>
          <div>${day.almuerzo.nombre}</div>
        </div>
        <div class="meal">
          <div class="meal-title"><span>🥜 Snack PM</span><span class="meal-qty">${day.snackPM.qty}</span></div>
          <div>${day.snackPM.nombre}</div>
        </div>
        <div class="meal" id="cena-block">
          <div class="meal-title"><span>🍖 Cena</span><span class="meal-qty" id="cena-qty">${day.cena.qty}</span></div>
          <div id="cena-text">${day.cena.nombre}</div>
        </div>
      </div>
      <div class="list-row" style="margin-top:.5rem">
        <strong>Ejercicios sugeridos semana ${week}</strong>
        <div class="small">${exercises.map(e => "• " + e).join("<br>")}</div>
      </div>
      <div class="day-actions">
        <button class="done-btn ${done ? "done" : ""}" onclick="toggleDone(${idx}, ${week})">${done ? "✔ Día completado" : "Marcar día ✔"}</button>
        <button class="swap-btn" onclick="swapCena(${idx}, ${week})">Cambiar cena 🔁</button>
      </div>
    `;
    menuDays.appendChild(card);
    animateCards();

    document.querySelectorAll(".day-pill").forEach((p, i) => {
      const base = (week - 1) * 7;
      p.classList.toggle("active", (i + base) === idx);
    });
  }

  function showMotivation() {
    const box = document.getElementById("motivation");
    const done = getCompletedCount();
    const total = derivedPlan.length;
    let msg = "";
    const name = localStorage.getItem(LS_NAME) || "";
    if (done === 0) msg = "El inicio es lo más difícil. Ya estás aquí " + (name || "");
    else if (done < total / 2) msg = "Buen ritmo " + (name || "") + ". Ya tienes " + done + " días.";
    else if (done < total) msg = "Más de la mitad. Mantén el plan.";
    else msg = "Plan completado. Haz una foto y compártelo.";
    box.textContent = msg;
    box.style.display = "block";
  }

  /* ---------------------- INTERACCIÓN DE MENÚ ---------------------- */
  function toggleDone(idx, week) {
    const key = LS_PREFIX + "done-" + idx;
    const cur = localStorage.getItem(key) === "1";
    localStorage.setItem(key, cur ? "0" : "1");
    renderMenuDay(idx, week);
    updateProgressBar();
    showMotivation();
    showToast("Día actualizado ✅");
  }
  window.toggleDone = toggleDone;

  function swapCena(idx, week) {
    const option = cenaSwaps[Math.floor(Math.random() * cenaSwaps.length)];
    renderMenuDay(idx, week);
    const cenaText = document.querySelector("#menuDays #cena-text");
    const cenaQty = document.querySelector("#menuDays #cena-qty");
    if (cenaText && cenaQty) {
      cenaText.textContent = option.nombre;
      cenaQty.textContent = option.qty;
    }
    showToast("Cena cambiada 👌");
  }
  window.swapCena = swapCena;

  /* ---------------------- COMPRAS ---------------------- */
  function renderCompras() {
    const container = document.getElementById("compras");
    container.innerHTML = "";
    const done = getCompletedCount();
    const dash = document.createElement("div");
    dash.className = "list-row";
    dash.innerHTML = `
      <strong>Resumen rápido</strong>
      <div class="small">Días completados: ${done} de ${derivedPlan.length}</div>
    `;
    container.appendChild(dash);

    const list = [
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
    animateCards();
  }

  /* ---------------------- PROGRESO ---------------------- */
  function renderProgreso() {
    const container = document.getElementById("progreso");
    container.innerHTML = "";

    const shareBox = document.createElement("div");
    shareBox.className = "list-row";
    shareBox.innerHTML = `
      <strong>Compartir resultados</strong>
      <p class="small">Genera un resumen para enviar por WhatsApp o correo.</p>
      <button class="save-btn" onclick="shareProgress()">Compartir progreso</button>
    `;
    container.appendChild(shareBox);

    const canvas = document.createElement("canvas");
    canvas.id = "weightChart";
    canvas.style.maxWidth = "100%";
    container.appendChild(canvas);

    const note = document.createElement("div");
    note.className = "list-row";
    note.textContent = "Se guarda en este navegador.";
    container.appendChild(note);

    derivedPlan.forEach((d, idx) => {
      const saved = JSON.parse(localStorage.getItem(LS_PREFIX + "prog-" + idx) || "{}");
      const card = document.createElement("div");
      card.className = "day-card";
      card.innerHTML = `
        <div class="day-title"><h2>${d.dia}</h2><span class="kcal">${d.kcal} kcal</span></div>
        <input type="number" placeholder="Peso (kg)" id="peso-${idx}" value="${saved.peso || ""}">
        <input type="number" placeholder="Cintura (cm)" id="cintura-${idx}" value="${saved.cintura || ""}">
        <input type="number" placeholder="Energía (1-10)" id="energia-${idx}" value="${saved.energia || ""}">
        <textarea placeholder="Notas" id="nota-${idx}">${saved.notas || ""}</textarea>
        <button class="save-btn" onclick="saveProgreso(${idx})">Guardar</button>
      `;
      container.appendChild(card);
    });
    animateCards();
    drawChart();
  }

  function shareProgress() {
    const name = localStorage.getItem(LS_NAME) || "Mi progreso Keto";
    const done = getCompletedCount();
    const lastIdx = derivedPlan.length - 1;
    let lastPeso = "";
    for (let i = lastIdx; i >= 0; i--) {
      const saved = JSON.parse(localStorage.getItem(LS_PREFIX + "prog-" + i) || "{}");
      if (saved.peso) {
        lastPeso = saved.peso;
        break;
      }
    }
    const text = name + " está haciendo Keto Pro App 🥑. Días completados: " + done + " de " + derivedPlan.length + (lastPeso ? (". Peso más reciente: " + lastPeso + " kg.") : ".") + " Buen trabajo.";
    if (navigator.share) {
      navigator.share({
        title: "Progreso keto de " + name,
        text: text
      }).catch(() => {});
    } else {
      alert(text);
    }
  }
  window.shareProgress = shareProgress;

  function saveProgreso(idx) {
    const data = {
      peso: document.getElementById("peso-" + idx).value,
      cintura: document.getElementById("cintura-" + idx).value,
      energia: document.getElementById("energia-" + idx).value,
      notas: document.getElementById("nota-" + idx).value
    };
    localStorage.setItem(LS_PREFIX + "prog-" + idx, JSON.stringify(data));
    showToast("Progreso guardado ✅");
    drawChart();
  }
  window.saveProgreso = saveProgreso;

  function drawChart() {
    const ctx = document.getElementById("weightChart");
    if (!ctx || typeof Chart === "undefined") return;
    const weights = derivedPlan.map((_, idx) => {
      const saved = JSON.parse(localStorage.getItem(LS_PREFIX + "prog-" + idx) || "{}");
      return saved.peso ? parseFloat(saved.peso) : null;
    });
    if (weightChart) weightChart.destroy();
    weightChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: derivedPlan.map(p => p.dia),
        datasets: [{
          label: 'Peso (kg)',
          data: weights,
          borderWidth: 2,
          tension: .35,
          borderColor: getComputedStyle(document.documentElement).getPropertyValue("--primary").trim() || "#0f766e",
          pointRadius: 3,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: false } }
      }
    });
    ctx.parentElement.style.height = "180px";
  }

  /* ---------------------- AJUSTES ---------------------- */
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
    showToast("Plan actualizado a " + val + " semanas");
  }
  window.changePlanWeeks = changePlanWeeks;

  function changeStartDate() {
    const val = document.getElementById("startDateInput").value;
    if (val) {
      localStorage.setItem(LS_START, val);
      showToast("Fecha cambiada");
      switchTab("menu");
    }
  }
  window.changeStartDate = changeStartDate;

  function changeDailyView() {
    const val = Number(document.getElementById("dailyView").value);
    dailyView = val;
    localStorage.setItem(LS_DAILY_VIEW, String(val));
    renderWeekButtons();
    switchTab("menu");
  }
  window.changeDailyView = changeDailyView;

  function changePrimaryColor() {
    const val = document.getElementById("primaryColor").value;
    document.documentElement.style.setProperty("--primary", val);
    localStorage.setItem(LS_PRIMARY, val);
    showToast("Color actualizado");
  }
  window.changePrimaryColor = changePrimaryColor;

  function applySettingsName() {
    const name = document.getElementById("settingsName").value.trim();
    localStorage.setItem(LS_NAME, name);
    setHeaderName(name);
    setRandomTip(name);
    showToast("Nombre actualizado");
  }
  window.applySettingsName = applySettingsName;

  function saveNameFromModal() {
    const n1 = document.getElementById("name1").value.trim();
    if (n1) {
      localStorage.setItem(LS_NAME, n1);
      setHeaderName(n1);
      setRandomTip(n1);
    }
    nameModal.style.display = "none";
  }
  window.saveNameFromModal = saveNameFromModal;

  function resetAll() {
    if (!confirm("¿Seguro que quieres borrar todo?")) return;
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(LS_PREFIX)) keys.push(k);
    }
    keys.forEach(k => localStorage.removeItem(k));
    showToast("Todo borrado. Recargando...");
    setTimeout(() => location.reload(), 800);
  }
  window.resetAll = resetAll;

  /* ---------------------- TABS ---------------------- */
  function switchTab(target) {
    const sections = ["menu","compras","progreso","ajustes"];
    sections.forEach(id => {
      const el = document.getElementById(id);
      const isTarget = id === target;
      el.style.display = isTarget ? "block" : "none";
      if (id === "progreso" && !isTarget) {
        if (weightChart) {
          weightChart.destroy();
          weightChart = null;
        }
        el.innerHTML = "";
      }
    });
    document.querySelectorAll(".tab").forEach(t => t.classList.toggle("active", t.dataset.tab === target));
    document.querySelectorAll(".bottom-btn").forEach(t => t.classList.toggle("active", t.dataset.tab === target));

    if (target === "menu") {
      const idx = getCurrentDayIndex();
      const week = Math.floor(idx / 7) + 1;
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
    }
  }
  window.switchTab = switchTab;

  function setWeekActive(week) {
    document.querySelectorAll(".week-btn").forEach(b => {
      b.classList.toggle("active", Number(b.dataset.week) === week);
    });
  }

  /* ---------------------- UI HELPERS ---------------------- */
  function animateCards() {
    const items = document.querySelectorAll(".day-card, .list-row");
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) e.target.classList.add("show");
        });
      }, {threshold: .15});
      items.forEach(i => observer.observe(i));
    } else {
      items.forEach(i => i.classList.add("show"));
    }
  }

  function showToast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    setTimeout(() => {
      toastEl.classList.remove("show");
    }, 2000);
  }

  /* ---------------------- FIN ---------------------- */
});
