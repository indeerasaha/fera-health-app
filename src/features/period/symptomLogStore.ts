import { useSyncExternalStore } from 'react';

import type { SymptomLog } from '@/types';

interface SymptomLogState {
  byDate: Record<string, SymptomLog[]>;
}

let state: SymptomLogState = { byDate: {} };
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

export function addSymptomEntry(date: string, symptom: string, severity: number) {
  const entry: SymptomLog = { id: String(nextId++), loggedAt: new Date().toISOString(), symptom, severity };
  const existing = state.byDate[date] ?? [];
  state = { byDate: { ...state.byDate, [date]: [...existing, entry] } };
  emit();
}

export function useSymptomLogForDate(date: string) {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot);
  return snapshot.byDate[date] ?? [];
}

export function useLoggedDates() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot);
  return snapshot.byDate;
}
