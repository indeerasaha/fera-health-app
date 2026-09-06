import { useSyncExternalStore } from 'react';

import type { ExerciseLog, MealCategory, MealLog, WaterLog } from '@/types';

export const DAILY_CALORIE_GOAL = 2000;
export const DAILY_WATER_GOAL_ML = 2000;

interface DailyLogState {
  meals: MealLog[];
  exercises: ExerciseLog[];
  water: WaterLog[];
}

let state: DailyLogState = { meals: [], exercises: [], water: [] };
const listeners = new Set<() => void>();
let nextId = 1;

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return state;
}

export function addMealEntry(category: MealCategory, name: string, calories: number) {
  const entry: MealLog = { id: String(nextId++), loggedAt: new Date().toISOString(), name, category, calories };
  state = { ...state, meals: [...state.meals, entry] };
  emit();
}

export function addExerciseEntry(activity: string, durationMinutes: number, caloriesBurned: number) {
  const entry: ExerciseLog = {
    id: String(nextId++),
    loggedAt: new Date().toISOString(),
    activity,
    durationMinutes,
    caloriesBurned,
  };
  state = { ...state, exercises: [...state.exercises, entry] };
  emit();
}

export function addWaterEntry(amountMl: number) {
  const entry: WaterLog = { id: String(nextId++), loggedAt: new Date().toISOString(), amountMl };
  state = { ...state, water: [...state.water, entry] };
  emit();
}

export function useDailyLog() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot);

  const caloriesByCategory: Record<MealCategory, number> = { breakfast: 0, lunch: 0, dinner: 0, snacks: 0 };
  for (const meal of snapshot.meals) {
    caloriesByCategory[meal.category] += meal.calories;
  }

  const caloriesConsumed = Object.values(caloriesByCategory).reduce((sum, value) => sum + value, 0);
  const caloriesBurned = snapshot.exercises.reduce((sum, entry) => sum + entry.caloriesBurned, 0);
  const waterMl = snapshot.water.reduce((sum, entry) => sum + entry.amountMl, 0);

  return {
    meals: snapshot.meals,
    exercises: snapshot.exercises,
    water: snapshot.water,
    caloriesByCategory,
    caloriesConsumed,
    caloriesBurned,
    waterMl,
    calorieGoal: DAILY_CALORIE_GOAL,
    waterGoalMl: DAILY_WATER_GOAL_ML,
  };
}
