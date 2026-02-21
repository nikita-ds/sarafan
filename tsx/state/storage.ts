import type { AppState } from "./types";
import { defaultState } from "./defaultState";

const STORAGE_KEY = "sarafan.prototype.v1";

export function loadState(): AppState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw) as AppState;
    return parsed;
  } catch {
    return defaultState();
  }
}

export function saveState(state: AppState) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
