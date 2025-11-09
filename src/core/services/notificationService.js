/**
 * Notification Service - Push notifications y recordatorios
 */

class NotificationService {
  constructor() {
    this.permission = 'default';
    this.isSupported = 'Notification' in window;
  }

  /**
   * Solicitar permisos de notificación
   */
  async requestPermission() {
    if (!this.isSupported) {
      console.warn('Notificaciones no soportadas en este navegador');
      return false;
    }

    try {
      this.permission = await Notification.requestPermission();
      return this.permission === 'granted';
    } catch (error) {
      console.error('Error solicitando permisos:', error);
      return false;
    }
  }

  /**
   * Verificar si tenemos permisos
   */
  hasPermission() {
    return this.isSupported && Notification.permission === 'granted';
  }

  /**
   * Mostrar notificación
   */
  async show(title, options = {}) {
    if (!this.hasPermission()) {
      const granted = await this.requestPermission();
      if (!granted) return false;
    }

    try {
      const notification = new Notification(title, {
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        vibrate: [200, 100, 200],
        ...options
      });

      return notification;
    } catch (error) {
      console.error('Error mostrando notificación:', error);
      return false;
    }
  }

  /**
   * Programar recordatorio
   */
  async scheduleReminder(title, body, delay) {
    if (!this.hasPermission()) {
      await this.requestPermission();
    }

    setTimeout(() => {
      this.show(title, { body });
    }, delay);
  }

  /**
   * Recordatorio de comida
   */
  async remindMeal(mealType, time) {
    const messages = {
      breakfast: {
        es: '¡Hora del desayuno! 🥑',
        en: 'Breakfast time! 🥑'
      },
      lunch: {
        es: '¡Hora del almuerzo! 🥗',
        en: 'Lunch time! 🥗'
      },
      dinner: {
        es: '¡Hora de la cena! 🍖',
        en: 'Dinner time! 🍖'
      }
    };

    const lang = localStorage.getItem('keto14-rick-lang') || 'es';
    const message = messages[mealType]?.[lang] || messages[mealType]?.es;

    return this.show(message, {
      body: lang === 'es' ? 'No olvides tu plan keto' : "Don't forget your keto plan",
      tag: `meal-${mealType}`,
      requireInteraction: false
    });
  }

  /**
   * Recordatorio de agua
   */
  async remindWater() {
    const lang = localStorage.getItem('keto14-rick-lang') || 'es';

    return this.show(
      lang === 'es' ? '💧 Hidratación' : '💧 Hydration',
      {
        body: lang === 'es' ? '¡Recuerda beber agua!' : 'Remember to drink water!',
        tag: 'water-reminder'
      }
    );
  }

  /**
   * Configurar recordatorios diarios
   */
  setupDailyReminders() {
    if (!this.hasPermission()) return;

    // Recordatorio de agua cada 2 horas (entre 8am y 8pm)
    const waterIntervalMinutes = 120;

    setInterval(() => {
      const hour = new Date().getHours();
      if (hour >= 8 && hour <= 20) {
        this.remindWater();
      }
    }, waterIntervalMinutes * 60 * 1000);

    // Recordatorios de comidas
    this.scheduleMealReminders();
  }

  /**
   * Programar recordatorios de comidas
   */
  scheduleMealReminders() {
    const now = new Date();
    const schedules = [
      { type: 'breakfast', hour: 8, minute: 0 },
      { type: 'lunch', hour: 13, minute: 0 },
      { type: 'dinner', hour: 19, minute: 0 }
    ];

    schedules.forEach((schedule) => {
      const scheduledTime = new Date();
      scheduledTime.setHours(schedule.hour, schedule.minute, 0, 0);

      if (scheduledTime < now) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
      }

      const delay = scheduledTime.getTime() - now.getTime();

      setTimeout(() => {
        this.remindMeal(schedule.type);

        // Repetir cada 24 horas
        setInterval(() => {
          this.remindMeal(schedule.type);
        }, 24 * 60 * 60 * 1000);
      }, delay);
    });
  }

  /**
   * Notificación de logro
   */
  async notifyAchievement(achievement) {
    const lang = localStorage.getItem('keto14-rick-lang') || 'es';

    return this.show(
      lang === 'es' ? '🏆 ¡Nuevo Logro!' : '🏆 New Achievement!',
      {
        body: achievement.name,
        tag: `achievement-${achievement.id}`,
        requireInteraction: true
      }
    );
  }
}

export default new NotificationService();
