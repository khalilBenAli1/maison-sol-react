import { createContext, useContext } from 'react';
import type { BookingDraft } from '../domain/types';
import type { Preferences } from '../state/preferences';

export interface PreferencesActions {
  preferences: Preferences;
  updateDraft: (patch: Partial<BookingDraft>) => void;
  toggleSaved: (roomId: string) => void;
  clearDraft: () => void;
  reset: () => void;
}

export const PreferencesContext = createContext<PreferencesActions | null>(
  null,
);

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) throw new Error('PreferencesProvider is required.');
  return context;
}
