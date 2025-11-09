/**
 * Keto Pro Ultra - Main Entry Point
 * Aplicación modular con arquitectura basada en componentes
 */

import './styles/main.css';

// Core imports
import store from './core/state/store.js';
import storageService from './core/services/storageService.js';
import notificationService from './core/services/notificationService.js';

// Import translations
import es from './core/data/i18n/es.js';
import en from './core/data/i18n/en.js';

// App state
const app = {
  translations: { es, en },
  currentLang: 'es',
  isInitialized: false
};

/**
 * Get translation
 */
function t(key) {
  const keys = key.split('.');
  let value = app.translations[app.currentLang];

  for (const k of keys) {
    if (value && typeof value === 'object') {
      value = value[k];
    } else {
      return key;
    }
  }

  return value || key;
}

/**
 * Initialize splash screen
 */
function initSplash() {
  const splash = document.getElementById('splash');
  if (!splash) return;

  // Animate splash screen
  setTimeout(() => {
    splash.classList.add('fade-out');

    setTimeout(() => {
      splash.style.display = 'none';
      document.getElementById('main-content').classList.remove('hidden');
    }, 500);
  }, 1500);
}

/**
 * Create header component
 */
function createHeader() {
  const state = store.getState();
  const header = document.getElementById('app-header');

  const userName = state.userName || t('app.tagline');
  const theme = state.theme || 'dark';

  header.innerHTML = `
    <div class="header-content">
      <div class="header-left">
        <h1 class="header-title">
          <span class="header-icon">🥑</span>
          ${t('app.name')}
        </h1>
        <p class="header-subtitle">${userName}</p>
      </div>
      <div class="header-right">
        <button id="theme-toggle" class="btn btn-icon" aria-label="Toggle theme">
          <span class="theme-icon">${theme === 'dark' ? '☀️' : '🌙'}</span>
        </button>
      </div>
    </div>
  `;

  // Theme toggle handler
  const themeToggle = document.getElementById('theme-toggle');
  themeToggle?.addEventListener('click', toggleTheme);
}

/**
 * Toggle theme
 */
function toggleTheme() {
  const currentTheme = store.getState('theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  document.body.setAttribute('data-theme', newTheme);
  store.setState({ theme: newTheme });

  // Update icon
  const icon = document.querySelector('.theme-icon');
  if (icon) {
    icon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
  }

  showToast(newTheme === 'dark' ? 'Tema oscuro activado' : 'Tema claro activado');
}

/**
 * Create tabs navigation
 */
function createTabs() {
  const tabs = document.getElementById('app-tabs');
  const activeTab = store.getState('activeTab');

  const tabItems = [
    { id: 'menu', label: t('nav.menu'), icon: '🍽️' },
    { id: 'shopping', label: t('nav.shopping'), icon: '🛒' },
    { id: 'progress', label: t('nav.progress'), icon: '📊' },
    { id: 'settings', label: t('nav.settings'), icon: '⚙️' }
  ];

  tabs.innerHTML = `
    <div class="tabs-wrapper scrollbar-thin">
      ${tabItems
        .map(
          (tab) => `
        <button
          class="tab-btn ${tab.id === activeTab ? 'active' : ''}"
          data-tab="${tab.id}"
          aria-label="${tab.label}"
        >
          <span class="tab-icon">${tab.icon}</span>
          <span class="tab-label">${tab.label}</span>
        </button>
      `
        )
        .join('')}
    </div>
  `;

  // Add click handlers
  tabs.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const tabId = btn.dataset.tab;
      navigateToTab(tabId);
    });
  });
}

/**
 * Create bottom navigation (mobile)
 */
function createBottomNav() {
  const bottomNav = document.getElementById('bottom-nav');
  const activeTab = store.getState('activeTab');

  const navItems = [
    { id: 'menu', icon: '🍽️', label: t('nav.menu') },
    { id: 'shopping', icon: '🛒', label: t('nav.shopping') },
    { id: 'progress', icon: '📊', label: t('nav.progress') },
    { id: 'settings', icon: '⚙️', label: t('nav.settings') }
  ];

  bottomNav.innerHTML = navItems
    .map(
      (item) => `
    <button
      class="bottom-nav-btn ${item.id === activeTab ? 'active' : ''}"
      data-tab="${item.id}"
      aria-label="${item.label}"
    >
      <span class="nav-icon">${item.icon}</span>
      <span class="nav-label">${item.label}</span>
    </button>
  `
    )
    .join('');

  // Add click handlers
  bottomNav.querySelectorAll('.bottom-nav-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const tabId = btn.dataset.tab;
      navigateToTab(tabId);
    });
  });
}

/**
 * Navigate to tab
 */
function navigateToTab(tabId) {
  store.setState({ activeTab: tabId });

  // Update active states
  document.querySelectorAll('.tab-btn, .bottom-nav-btn').forEach((btn) => {
    if (btn.dataset.tab === tabId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Render page
  renderPage(tabId);
}

/**
 * Render page content
 */
function renderPage(pageId) {
  const container = document.getElementById('page-container');

  // Simple page rendering (esto se expandirá con componentes reales)
  const pages = {
    menu: renderMenuPage,
    shopping: renderShoppingPage,
    progress: renderProgressPage,
    settings: renderSettingsPage
  };

  const renderFunction = pages[pageId];
  if (renderFunction) {
    container.innerHTML = '';
    renderFunction(container);
  }
}

/**
 * Render Menu Page (placeholder)
 */
function renderMenuPage(container) {
  container.innerHTML = `
    <div class="container">
      <div class="page-header mb-6">
        <h2 class="page-title">Plan de Comidas</h2>
        <p class="page-subtitle">Tu menú keto personalizado</p>
      </div>

      <div class="progress-card card mb-4">
        <div class="flex justify-between items-center mb-3">
          <span class="text-sm text-secondary">Progreso del plan</span>
          <span class="text-sm font-semibold">0 de 14 días</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: 0%"></div>
        </div>
      </div>

      <div class="tip-card card card-glass mb-4">
        <div class="flex items-center gap-3">
          <span class="tip-icon">💡</span>
          <p class="mb-0 text-sm">${t('tips')[0]}</p>
        </div>
      </div>

      <div class="actions-grid grid grid-cols-1 gap-3 mb-6">
        <button class="btn btn-primary">
          <span>🤖</span>
          Generar semana con IA
        </button>
        <button class="btn btn-secondary">
          <span>📅</span>
          Generar día con IA
        </button>
      </div>

      <div class="meals-container">
        <div class="card">
          <h3 class="mb-4">Día 1 - Lunes</h3>
          <p class="text-secondary text-sm">Plan base de comidas (próximamente con datos reales)</p>
        </div>
      </div>
    </div>
  `;
}

/**
 * Render Shopping Page (placeholder)
 */
function renderShoppingPage(container) {
  container.innerHTML = `
    <div class="container">
      <div class="page-header mb-6">
        <h2 class="page-title">Lista de Compras</h2>
        <p class="page-subtitle">Ingredientes para tu plan semanal</p>
      </div>

      <div class="card">
        <div class="flex justify-between items-center mb-4">
          <h3>Esta Semana</h3>
          <button class="btn btn-sm btn-ghost">
            <span>🤖</span>
            Generar con IA
          </button>
        </div>
        <p class="text-secondary text-sm">Genera tu plan de comidas para ver la lista de compras</p>
      </div>
    </div>
  `;
}

/**
 * Render Progress Page (placeholder)
 */
function renderProgressPage(container) {
  container.innerHTML = `
    <div class="container">
      <div class="page-header mb-6">
        <h2 class="page-title">Mi Progreso</h2>
        <p class="page-subtitle">Seguimiento y estadísticas</p>
      </div>

      <div class="stats-grid grid grid-cols-2 gap-4 mb-6">
        <div class="card text-center">
          <div class="stat-icon mb-2">⚖️</div>
          <div class="stat-value text-2xl font-bold mb-1">--</div>
          <div class="stat-label text-sm text-secondary">Peso actual</div>
        </div>
        <div class="card text-center">
          <div class="stat-icon mb-2">🔥</div>
          <div class="stat-value text-2xl font-bold mb-1">0</div>
          <div class="stat-label text-sm text-secondary">Días completados</div>
        </div>
      </div>

      <div class="card">
        <h3 class="mb-4">Gráfico de Peso</h3>
        <p class="text-secondary text-sm">Agrega tu peso para ver tu progreso</p>
      </div>
    </div>
  `;
}

/**
 * Render Settings Page (placeholder)
 */
function renderSettingsPage(container) {
  const state = store.getState();

  container.innerHTML = `
    <div class="container">
      <div class="page-header mb-6">
        <h2 class="page-title">Ajustes</h2>
        <p class="page-subtitle">Personaliza tu experiencia</p>
      </div>

      <div class="settings-section card mb-4">
        <h3 class="mb-4">Perfil</h3>
        <div class="form-group mb-3">
          <label class="form-label text-sm mb-2">Nombre</label>
          <input
            type="text"
            class="input"
            id="user-name-input"
            placeholder="Tu nombre"
            value="${state.userName || ''}"
          />
        </div>
        <div class="form-group mb-3">
          <label class="form-label text-sm mb-2">Género</label>
          <select class="select" id="gender-select">
            <option value="male" ${state.userGender === 'male' ? 'selected' : ''}>Hombre</option>
            <option value="female" ${state.userGender === 'female' ? 'selected' : ''}>Mujer</option>
          </select>
        </div>
        <button class="btn btn-primary" id="save-profile-btn">Guardar Perfil</button>
      </div>

      <div class="settings-section card mb-4">
        <h3 class="mb-4">Idioma</h3>
        <select class="select" id="language-select">
          <option value="es" ${state.language === 'es' ? 'selected' : ''}>Español</option>
          <option value="en" ${state.language === 'en' ? 'selected' : ''}>English</option>
        </select>
      </div>

      <div class="settings-section card">
        <h3 class="mb-4 text-danger">Zona de Peligro</h3>
        <p class="text-sm text-secondary mb-4">Esto eliminará todos tus datos permanentemente.</p>
        <button class="btn btn-ghost" id="reset-all-btn">Reiniciar Todo</button>
      </div>
    </div>
  `;

  // Add event listeners
  document.getElementById('save-profile-btn')?.addEventListener('click', saveProfile);
  document.getElementById('reset-all-btn')?.addEventListener('click', resetAll);
  document.getElementById('language-select')?.addEventListener('change', changeLanguage);
  document.getElementById('gender-select')?.addEventListener('change', (e) => {
    store.setState({ userGender: e.target.value });
    showToast('Género actualizado');
  });
}

/**
 * Save profile
 */
function saveProfile() {
  const nameInput = document.getElementById('user-name-input');
  const genderSelect = document.getElementById('gender-select');

  if (nameInput && genderSelect) {
    store.setState({
      userName: nameInput.value,
      userGender: genderSelect.value
    });

    showToast('Perfil guardado exitosamente');
    createHeader(); // Update header
  }
}

/**
 * Change language
 */
function changeLanguage(e) {
  const newLang = e.target.value;
  app.currentLang = newLang;
  store.setState({ language: newLang });

  // Reload UI
  initUI();
  showToast(newLang === 'es' ? 'Idioma cambiado' : 'Language changed');
}

/**
 * Reset all data
 */
async function resetAll() {
  if (confirm(t('settings.confirmReset'))) {
    await storageService.clearAllData();
    localStorage.clear();
    location.reload();
  }
}

/**
 * Show toast notification
 */
function showToast(message, duration = 3000) {
  const toastsContainer = document.getElementById('toasts');

  const toast = document.createElement('div');
  toast.className = 'toast fade-in';
  toast.textContent = message;

  toastsContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/**
 * Initialize UI
 */
function initUI() {
  app.currentLang = store.getState('language') || 'es';
  document.documentElement.lang = app.currentLang;

  // Set theme
  const theme = store.getState('theme') || 'dark';
  document.body.setAttribute('data-theme', theme);

  // Create UI components
  createHeader();
  createTabs();
  createBottomNav();

  // Render initial page
  const activeTab = store.getState('activeTab') || 'menu';
  renderPage(activeTab);
}

/**
 * Initialize app
 */
async function initApp() {
  try {
    console.log('🚀 Initializing Keto Pro Ultra...');

    // Initialize services
    await storageService.init();

    // Check for first-time user
    const userName = store.getState('userName');
    if (!userName) {
      console.log('👋 New user detected, showing onboarding');
      // TODO: Show onboarding modal
    }

    // Initialize UI
    initUI();

    // Hide splash screen
    initSplash();

    // Request notification permission
    if (Notification.permission === 'default') {
      setTimeout(() => {
        notificationService.requestPermission();
      }, 5000);
    }

    app.isInitialized = true;
    console.log('✅ App initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing app:', error);
    showToast('Error al inicializar la aplicación');
  }
}

// Start app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// Register service worker (PWA)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('✅ Service Worker registered:', registration.scope);
      })
      .catch((error) => {
        console.warn('⚠️ Service Worker registration failed:', error);
      });
  });
}

// Export for debugging
window.ketoApp = {
  store,
  storageService,
  notificationService,
  navigateToTab,
  showToast,
  t
};
