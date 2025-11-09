/**
 * Store principal - Sistema de estado reactivo simple
 */

class Store {
  constructor(initialState = {}) {
    this.state = initialState;
    this.listeners = new Map();
    this.history = [];
    this.maxHistory = 50;
  }

  /**
   * Obtener estado actual
   */
  getState(key) {
    if (key) {
      return this.state[key];
    }
    return { ...this.state };
  }

  /**
   * Actualizar estado
   */
  setState(updates, addToHistory = true) {
    if (addToHistory) {
      this.history.push({ ...this.state });
      if (this.history.length > this.maxHistory) {
        this.history.shift();
      }
    }

    const prevState = { ...this.state };
    this.state = { ...this.state, ...updates };

    // Notificar a listeners
    Object.keys(updates).forEach((key) => {
      if (this.listeners.has(key)) {
        this.listeners.get(key).forEach((callback) => {
          callback(this.state[key], prevState[key]);
        });
      }
    });

    // Notificar a listeners globales
    if (this.listeners.has('*')) {
      this.listeners.get('*').forEach((callback) => {
        callback(this.state, prevState);
      });
    }

    return this.state;
  }

  /**
   * Suscribirse a cambios
   */
  subscribe(key, callback) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key).add(callback);

    // Retornar función de unsuscribe
    return () => {
      this.listeners.get(key).delete(callback);
    };
  }

  /**
   * Deshacer última acción
   */
  undo() {
    if (this.history.length > 0) {
      const prevState = this.history.pop();
      this.setState(prevState, false);
      return true;
    }
    return false;
  }

  /**
   * Resetear estado
   */
  reset() {
    this.state = {};
    this.history = [];
    this.listeners.clear();
  }
}

// Store principal de la aplicación
export const store = new Store({
  // User data
  userName: localStorage.getItem('keto14-rick-name') || '',
  userGender: localStorage.getItem('keto14-rick-gender') || 'male',
  startDate: localStorage.getItem('keto14-rick-start') || new Date().toISOString().split('T')[0],

  // Plan settings
  planWeeks: Number(localStorage.getItem('keto14-rick-weeks')) || 2,
  dailyView: localStorage.getItem('keto14-rick-daily-view') === '1',
  primaryColor: localStorage.getItem('keto14-rick-color') || '#0f766e',
  theme: localStorage.getItem('keto14-rick-theme') || 'dark',
  language: localStorage.getItem('keto14-rick-lang') || 'es',

  // Progress
  selectedWeek: Number(localStorage.getItem('keto14-rick-sel-week')) || 1,
  selectedDay: Number(localStorage.getItem('keto14-rick-sel-day')) || 0,
  completedDays: new Set(
    JSON.parse(localStorage.getItem('keto14-rick-completed') || '[]')
  ),

  // Water
  waterGoal: Number(localStorage.getItem('keto14-rick-water-goal')) || 2400,
  waterIntake: new Map(),

  // Food preferences
  foodLikes: localStorage.getItem('keto14-rick-like') || '',
  foodDislikes: localStorage.getItem('keto14-rick-dislike') || '',

  // Workout
  workoutIntensity: localStorage.getItem('keto14-rick-workout-intensity') || 'medium',

  // Weight tracking
  weightHistory: JSON.parse(localStorage.getItem('keto14-rick-weight-history') || '[]'),

  // API credentials
  apiUser: localStorage.getItem('keto14-rick-api-user') || '',
  apiPass: localStorage.getItem('keto14-rick-api-pass') || '',

  // UI state
  activeTab: 'menu',
  isLoading: false,
  toastMessage: '',
  modalOpen: false
});

// Sincronizar cambios con localStorage
store.subscribe('*', (newState) => {
  // Guardar cambios relevantes en localStorage
  localStorage.setItem('keto14-rick-name', newState.userName || '');
  localStorage.setItem('keto14-rick-gender', newState.userGender || 'male');
  localStorage.setItem('keto14-rick-start', newState.startDate || '');
  localStorage.setItem('keto14-rick-weeks', newState.planWeeks || 2);
  localStorage.setItem('keto14-rick-daily-view', newState.dailyView ? '1' : '0');
  localStorage.setItem('keto14-rick-color', newState.primaryColor || '#0f766e');
  localStorage.setItem('keto14-rick-theme', newState.theme || 'dark');
  localStorage.setItem('keto14-rick-lang', newState.language || 'es');
  localStorage.setItem('keto14-rick-sel-week', newState.selectedWeek || 1);
  localStorage.setItem('keto14-rick-sel-day', newState.selectedDay || 0);
  localStorage.setItem('keto14-rick-water-goal', newState.waterGoal || 2400);
  localStorage.setItem('keto14-rick-like', newState.foodLikes || '');
  localStorage.setItem('keto14-rick-dislike', newState.foodDislikes || '');
  localStorage.setItem('keto14-rick-workout-intensity', newState.workoutIntensity || 'medium');
  localStorage.setItem('keto14-rick-api-user', newState.apiUser || '');
  localStorage.setItem('keto14-rick-api-pass', newState.apiPass || '');

  if (newState.completedDays) {
    localStorage.setItem(
      'keto14-rick-completed',
      JSON.stringify(Array.from(newState.completedDays))
    );
  }

  if (newState.weightHistory) {
    localStorage.setItem('keto14-rick-weight-history', JSON.stringify(newState.weightHistory));
  }
});

export default store;
