/**
 * Formatters - Formateadores de datos
 */

/**
 * Formatear calorías
 */
export function formatCalories(calories) {
  return `${Math.round(calories)} kcal`;
}

/**
 * Formatear peso
 */
export function formatWeight(weight, unit = 'kg') {
  return `${weight.toFixed(1)} ${unit}`;
}

/**
 * Formatear porcentaje
 */
export function formatPercentage(value, decimals = 0) {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Formatear macros
 */
export function formatMacro(value, type) {
  const units = {
    protein: 'g',
    carbs: 'g',
    fat: 'g',
    fiber: 'g'
  };

  return `${Math.round(value)}${units[type] || 'g'}`;
}

/**
 * Formatear agua (ml a litros si es necesario)
 */
export function formatWater(ml) {
  if (ml >= 1000) {
    return `${(ml / 1000).toFixed(1)}L`;
  }
  return `${ml}ml`;
}

/**
 * Formatear duración
 */
export function formatDuration(minutes) {
  if (minutes < 60) {
    return `${minutes}min`;
  }

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (mins === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${mins}min`;
}

/**
 * Formatear número con separador de miles
 */
export function formatNumber(num, locale = 'es-ES') {
  return new Intl.NumberFormat(locale).format(num);
}

/**
 * Formatear moneda
 */
export function formatCurrency(amount, currency = 'USD', locale = 'es-ES') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  }).format(amount);
}

/**
 * Formatear lista
 */
export function formatList(items, lang = 'es') {
  if (!items || items.length === 0) return '';

  const formatter = new Intl.ListFormat(lang === 'es' ? 'es-ES' : 'en-US', {
    style: 'long',
    type: 'conjunction'
  });

  return formatter.format(items);
}

/**
 * Formatear IMC
 */
export function formatBMI(bmi) {
  return bmi.toFixed(1);
}

/**
 * Obtener categoría de IMC
 */
export function getBMICategory(bmi, lang = 'es') {
  const categories = {
    es: {
      underweight: 'Bajo peso',
      normal: 'Normal',
      overweight: 'Sobrepeso',
      obese: 'Obesidad'
    },
    en: {
      underweight: 'Underweight',
      normal: 'Normal',
      overweight: 'Overweight',
      obese: 'Obese'
    }
  };

  const langCategories = categories[lang] || categories.es;

  if (bmi < 18.5) return langCategories.underweight;
  if (bmi < 25) return langCategories.normal;
  if (bmi < 30) return langCategories.overweight;
  return langCategories.obese;
}

/**
 * Formatear grasa corporal estimada
 */
export function formatBodyFat(percentage) {
  return `${percentage.toFixed(1)}%`;
}

/**
 * Capitalizar primera letra
 */
export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Formatear nombre completo
 */
export function formatFullName(firstName, lastName) {
  return `${capitalize(firstName)} ${capitalize(lastName)}`.trim();
}

/**
 * Abreviar número grande (1000 -> 1K)
 */
export function abbreviateNumber(num) {
  if (num < 1000) return num.toString();
  if (num < 1000000) return `${(num / 1000).toFixed(1)}K`;
  return `${(num / 1000000).toFixed(1)}M`;
}

/**
 * Formatear tiempo relativo (hace 2 horas, etc.)
 */
export function formatRelativeTime(date, lang = 'es') {
  const rtf = new Intl.RelativeTimeFormat(lang === 'es' ? 'es-ES' : 'en-US', {
    numeric: 'auto'
  });

  const now = new Date();
  const then = new Date(date);
  const diffInSeconds = Math.floor((then - now) / 1000);

  const units = [
    { unit: 'year', seconds: 31536000 },
    { unit: 'month', seconds: 2592000 },
    { unit: 'week', seconds: 604800 },
    { unit: 'day', seconds: 86400 },
    { unit: 'hour', seconds: 3600 },
    { unit: 'minute', seconds: 60 },
    { unit: 'second', seconds: 1 }
  ];

  for (const { unit, seconds } of units) {
    if (Math.abs(diffInSeconds) >= seconds) {
      const value = Math.floor(diffInSeconds / seconds);
      return rtf.format(value, unit);
    }
  }

  return rtf.format(0, 'second');
}
