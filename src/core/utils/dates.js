/**
 * Date Utilities - Manejo de fechas
 */

import { format, addDays, differenceInDays, startOfWeek, endOfWeek } from 'date-fns';
import { es, enUS } from 'date-fns/locale';

/**
 * Obtener locale según idioma
 */
function getLocale(lang = 'es') {
  return lang === 'es' ? es : enUS;
}

/**
 * Formatear fecha
 */
export function formatDate(date, pattern = 'PP', lang = 'es') {
  return format(new Date(date), pattern, { locale: getLocale(lang) });
}

/**
 * Obtener día de la semana
 */
export function getDayName(date, lang = 'es') {
  return format(new Date(date), 'EEEE', { locale: getLocale(lang) });
}

/**
 * Agregar días a fecha
 */
export function addDaysToDate(date, days) {
  return addDays(new Date(date), days);
}

/**
 * Calcular diferencia en días
 */
export function daysBetween(startDate, endDate) {
  return differenceInDays(new Date(endDate), new Date(startDate));
}

/**
 * Obtener día actual del plan
 */
export function getCurrentPlanDay(startDate) {
  const today = new Date();
  const start = new Date(startDate);
  const diff = daysBetween(start, today);

  return diff >= 0 ? diff : 0;
}

/**
 * Obtener semana actual del plan
 */
export function getCurrentWeek(startDate) {
  const currentDay = getCurrentPlanDay(startDate);
  return Math.floor(currentDay / 7) + 1;
}

/**
 * Obtener rango de fechas de una semana
 */
export function getWeekRange(startDate, weekNumber) {
  const start = addDaysToDate(startDate, (weekNumber - 1) * 7);
  const end = addDaysToDate(start, 6);

  return {
    start,
    end,
    days: Array.from({ length: 7 }, (_, i) => addDaysToDate(start, i))
  };
}

/**
 * Verificar si es hoy
 */
export function isToday(date) {
  const today = new Date();
  const compareDate = new Date(date);

  return (
    today.getDate() === compareDate.getDate() &&
    today.getMonth() === compareDate.getMonth() &&
    today.getFullYear() === compareDate.getFullYear()
  );
}

/**
 * Verificar si es futuro
 */
export function isFuture(date) {
  return new Date(date) > new Date();
}

/**
 * Obtener inicio de semana
 */
export function getStartOfWeek(date) {
  return startOfWeek(new Date(date), { weekStartsOn: 1 }); // Lunes
}

/**
 * Obtener fin de semana
 */
export function getEndOfWeek(date) {
  return endOfWeek(new Date(date), { weekStartsOn: 1 }); // Domingo
}

/**
 * Formatear fecha para input date
 */
export function toInputDate(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/**
 * Obtener timestamp
 */
export function getTimestamp(date = new Date()) {
  return new Date(date).getTime();
}

/**
 * Calcular edad
 */
export function calculateAge(birthDate) {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}

/**
 * Obtener días restantes
 */
export function daysRemaining(endDate) {
  const diff = daysBetween(new Date(), new Date(endDate));
  return diff > 0 ? diff : 0;
}
