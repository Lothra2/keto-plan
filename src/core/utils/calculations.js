/**
 * Calculations - Cálculos nutricionales y de salud
 */

/**
 * Calcular TMB (Tasa Metabólica Basal) - Ecuación de Harris-Benedict
 */
export function calculateBMR(weight, height, age, gender) {
  if (gender === 'male') {
    return 66.5 + 13.75 * weight + 5.003 * height - 6.75 * age;
  } else {
    return 655.1 + 9.563 * weight + 1.85 * height - 4.676 * age;
  }
}

/**
 * Calcular TDEE (Total Daily Energy Expenditure)
 */
export function calculateTDEE(bmr, activityLevel) {
  const multipliers = {
    sedentary: 1.2, // Poco o ningún ejercicio
    light: 1.375, // Ejercicio ligero 1-3 días/semana
    moderate: 1.55, // Ejercicio moderado 3-5 días/semana
    active: 1.725, // Ejercicio intenso 6-7 días/semana
    veryActive: 1.9 // Ejercicio muy intenso, trabajo físico
  };

  return bmr * (multipliers[activityLevel] || multipliers.moderate);
}

/**
 * Calcular IMC (Índice de Masa Corporal)
 */
export function calculateBMI(weight, height) {
  // weight en kg, height en cm
  const heightInMeters = height / 100;
  return weight / (heightInMeters * heightInMeters);
}

/**
 * Estimar porcentaje de grasa corporal (Fórmula de la Marina de EE.UU.)
 */
export function estimateBodyFat(weight, height, waist, neck, gender, hip = null) {
  if (gender === 'male') {
    return (
      86.01 * Math.log10(waist - neck) - 70.041 * Math.log10(height) + 36.76
    );
  } else {
    // Para mujeres se necesita medida de cadera
    if (!hip) return null;
    return (
      163.205 * Math.log10(waist + hip - neck) -
      97.684 * Math.log10(height) -
      78.387
    );
  }
}

/**
 * Calcular calorías para déficit/superávit
 */
export function calculateCalorieGoal(tdee, goal, percentage = 20) {
  const deficit = (tdee * percentage) / 100;

  if (goal === 'lose') {
    return tdee - deficit;
  } else if (goal === 'gain') {
    return tdee + deficit;
  }

  return tdee; // maintain
}

/**
 * Calcular macros para dieta cetogénica
 */
export function calculateKetoMacros(calories, proteinPerKg, weight) {
  // Keto típico: 70-75% grasa, 20-25% proteína, 5-10% carbohidratos
  const protein = proteinPerKg * weight; // gramos
  const proteinCalories = protein * 4;

  const carbsPercent = 0.05; // 5%
  const carbsCalories = calories * carbsPercent;
  const carbs = carbsCalories / 4;

  const fatCalories = calories - proteinCalories - carbsCalories;
  const fat = fatCalories / 9;

  return {
    calories: Math.round(calories),
    protein: Math.round(protein),
    carbs: Math.round(carbs),
    fat: Math.round(fat),
    percentages: {
      protein: Math.round((proteinCalories / calories) * 100),
      carbs: Math.round(carbsPercent * 100),
      fat: Math.round((fatCalories / calories) * 100)
    }
  };
}

/**
 * Calcular necesidad de agua diaria (en ml)
 */
export function calculateWaterNeeds(weight, activityLevel = 'moderate') {
  // Fórmula base: 30-35ml por kg de peso
  let baseWater = weight * 33;

  // Ajustar por actividad
  const activityMultipliers = {
    sedentary: 1.0,
    light: 1.1,
    moderate: 1.2,
    active: 1.3,
    veryActive: 1.5
  };

  return Math.round(baseWater * (activityMultipliers[activityLevel] || 1.2));
}

/**
 * Calcular calorías quemadas en ejercicio
 */
export function calculateCaloriesBurned(weight, duration, met) {
  // MET (Metabolic Equivalent of Task)
  // Fórmula: Calorías = MET × peso(kg) × duración(horas)
  const hours = duration / 60;
  return Math.round(met * weight * hours);
}

/**
 * Calcular déficit calórico total
 */
export function calculateTotalDeficit(dailyDeficit, days) {
  return dailyDeficit * days;
}

/**
 * Estimar pérdida de peso (1 kg = ~7700 kcal)
 */
export function estimateWeightLoss(totalDeficit) {
  return totalDeficit / 7700;
}

/**
 * Calcular progreso hacia meta
 */
export function calculateProgress(current, start, goal) {
  const total = Math.abs(goal - start);
  const progress = Math.abs(current - start);
  return Math.min((progress / total) * 100, 100);
}

/**
 * Calcular velocidad de pérdida de peso (kg/semana)
 */
export function calculateWeightLossRate(weights) {
  if (weights.length < 2) return 0;

  const sortedWeights = [...weights].sort((a, b) => new Date(a.date) - new Date(b.date));

  const firstWeight = sortedWeights[0].weight;
  const lastWeight = sortedWeights[sortedWeights.length - 1].weight;

  const firstDate = new Date(sortedWeights[0].date);
  const lastDate = new Date(sortedWeights[sortedWeights.length - 1].date);

  const daysDiff = (lastDate - firstDate) / (1000 * 60 * 60 * 24);
  const weeksDiff = daysDiff / 7;

  if (weeksDiff === 0) return 0;

  return (firstWeight - lastWeight) / weeksDiff;
}

/**
 * Calcular calorías de un alimento
 */
export function calculateFoodCalories(protein, carbs, fat) {
  return protein * 4 + carbs * 4 + fat * 9;
}

/**
 * Verificar si está en cetosis (carbos < 50g/día)
 */
export function isInKetosis(dailyCarbs) {
  return dailyCarbs < 50;
}

/**
 * Calcular ratio cetogénico
 */
export function calculateKetoRatio(fat, protein, carbs) {
  // Ratio keto = grasa / (proteína + carbohidratos)
  return fat / (protein + carbs);
}

/**
 * Validar ratio cetogénico (debe ser >= 2:1 para cetosis terapéutica)
 */
export function isValidKetoRatio(ratio, therapeutic = false) {
  return therapeutic ? ratio >= 2 : ratio >= 1.5;
}

/**
 * Calcular peso ideal (Fórmula de Devine)
 */
export function calculateIdealWeight(height, gender) {
  // height en cm
  const heightInInches = height / 2.54;

  if (gender === 'male') {
    return 50 + 2.3 * (heightInInches - 60);
  } else {
    return 45.5 + 2.3 * (heightInInches - 60);
  }
}
