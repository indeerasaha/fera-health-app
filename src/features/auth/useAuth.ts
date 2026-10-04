import type { Session } from '@supabase/supabase-js';
import { useSyncExternalStore } from 'react';

import { supabase } from '@/lib/supabase';

interface AuthState {
  session: Session | null;
  isLoading: boolean;
}

let state: AuthState = { session: null, isLoading: true };
const listeners = new Set<() => void>();

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

supabase.auth.getSession().then(({ data }) => {
  state = { session: data.session, isLoading: false };
  emit();
});

supabase.auth.onAuthStateChange((_event, session) => {
  state = { session, isLoading: false };
  emit();
});

export function useAuth() {
  return useSyncExternalStore(subscribe, getSnapshot);
}

export async function signInWithEmail(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

export async function signUpWithEmail(email: string, password: string) {
  const { error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
