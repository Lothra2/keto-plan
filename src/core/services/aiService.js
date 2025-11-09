/**
 * AI Service - Comunicación con APIs de IA (OpenAI, Gemini)
 */

import store from '../state/store.js';

class AIService {
  constructor() {
    this.baseUrl = '/.netlify/functions';
    this.defaultTimeout = 30000; // 30 segundos
  }

  /**
   * Obtener credenciales
   */
  getCredentials() {
    const state = store.getState();
    return {
      user: state.apiUser || '',
      pass: state.apiPass || ''
    };
  }

  /**
   * Generar comida individual con IA
   */
  async generateMeal(mealType, day, week) {
    const state = store.getState();
    const lang = state.language || 'es';
    const likes = state.foodLikes || '';
    const dislikes = state.foodDislikes || '';
    const gender = state.userGender || 'male';

    const credentials = this.getCredentials();

    const mealNames = {
      es: {
        breakfast: 'desayuno',
        lunch: 'almuerzo',
        dinner: 'cena',
        snackAM: 'snack matutino',
        snackPM: 'snack vespertino'
      },
      en: {
        breakfast: 'breakfast',
        lunch: 'lunch',
        dinner: 'dinner',
        snackAM: 'morning snack',
        snackPM: 'evening snack'
      }
    };

    const mealName = mealNames[lang][mealType] || mealType;

    try {
      const response = await fetch(`${this.baseUrl}/grok`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          mode: 'dinner',
          mealType: mealName,
          day,
          week,
          lang,
          gender,
          likes,
          dislikes,
          appUser: credentials.user,
          appPass: credentials.pass
        }),
        signal: AbortSignal.timeout(this.defaultTimeout)
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error generando comida con IA:', error);
      throw error;
    }
  }

  /**
   * Generar día completo con IA
   */
  async generateFullDay(day, week) {
    const state = store.getState();
    const lang = state.language || 'es';
    const likes = state.foodLikes || '';
    const dislikes = state.foodDislikes || '';
    const gender = state.userGender || 'male';
    const intensity = state.workoutIntensity || 'medium';

    const credentials = this.getCredentials();

    try {
      const response = await fetch(`${this.baseUrl}/grok`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          mode: 'full-day',
          day,
          week,
          lang,
          gender,
          likes,
          dislikes,
          intensity,
          appUser: credentials.user,
          appPass: credentials.pass
        }),
        signal: AbortSignal.timeout(this.defaultTimeout)
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error generando día completo con IA:', error);
      throw error;
    }
  }

  /**
   * Generar semana completa con IA
   */
  async generateWeek(week) {
    const promises = [];

    // Generar 7 días
    for (let day = 0; day < 7; day++) {
      promises.push(this.generateFullDay(day, week));
    }

    try {
      const results = await Promise.allSettled(promises);

      const successful = results
        .filter((r) => r.status === 'fulfilled')
        .map((r) => r.value);

      const failed = results.filter((r) => r.status === 'rejected').length;

      return {
        successful,
        failed,
        total: 7
      };
    } catch (error) {
      console.error('Error generando semana con IA:', error);
      throw error;
    }
  }

  /**
   * Generar lista de compras con IA
   */
  async generateShoppingList(meals) {
    const state = store.getState();
    const lang = state.language || 'es';
    const credentials = this.getCredentials();

    try {
      const response = await fetch(`${this.baseUrl}/gemini`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: this.buildShoppingListPrompt(meals, lang),
          lang,
          appUser: credentials.user,
          appPass: credentials.pass
        }),
        signal: AbortSignal.timeout(this.defaultTimeout)
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error generando lista de compras:', error);
      throw error;
    }
  }

  /**
   * Generar resumen semanal con IA
   */
  async generateWeeklySummary(week, completedDays, progress) {
    const state = store.getState();
    const lang = state.language || 'es';
    const credentials = this.getCredentials();

    const prompt =
      lang === 'es'
        ? `Genera un resumen motivacional de la semana ${week} del plan keto.
           Días completados: ${completedDays} de 7.
           Progreso: ${JSON.stringify(progress)}.
           Incluye:
           1. Felicitación por logros
           2. Áreas de mejora (si las hay)
           3. Consejo para la próxima semana
           4. Mensaje motivacional
           Formato: 4 puntos concisos y motivadores.`
        : `Generate a motivational summary for week ${week} of the keto plan.
           Completed days: ${completedDays} out of 7.
           Progress: ${JSON.stringify(progress)}.
           Include:
           1. Congratulations for achievements
           2. Areas for improvement (if any)
           3. Advice for next week
           4. Motivational message
           Format: 4 concise and motivating points.`;

    try {
      const response = await fetch(`${this.baseUrl}/gemini`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt,
          lang,
          appUser: credentials.user,
          appPass: credentials.pass
        }),
        signal: AbortSignal.timeout(this.defaultTimeout)
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error generando resumen semanal:', error);
      throw error;
    }
  }

  /**
   * Construir prompt para lista de compras
   */
  buildShoppingListPrompt(meals, lang) {
    const mealsList = meals.map((m) => `- ${m.name}: ${m.ingredients || ''}`).join('\n');

    if (lang === 'es') {
      return `Genera una lista de compras organizada por categorías (Proteínas, Vegetales, Lácteos, Otros)
              basada en estas comidas:\n${mealsList}\n\n
              Formato: JSON con estructura { "Proteínas": [...], "Vegetales": [...], ... }`;
    } else {
      return `Generate a shopping list organized by categories (Proteins, Vegetables, Dairy, Others)
              based on these meals:\n${mealsList}\n\n
              Format: JSON with structure { "Proteins": [...], "Vegetables": [...], ... }`;
    }
  }

  /**
   * Verificar estado del servicio
   */
  async healthCheck() {
    try {
      const response = await fetch(`${this.baseUrl}/grok`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000)
      });

      return response.ok;
    } catch (error) {
      console.error('Health check falló:', error);
      return false;
    }
  }
}

export default new AIService();
