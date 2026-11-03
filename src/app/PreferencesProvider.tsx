import { useEffect, useState, type ReactNode } from 'react';
import { PreferencesContext } from './PreferencesContext';
import {
  defaultPreferences,
  getBrowserStorage,
  readPreferences,
  resetPreferences,
  writePreferences,
} from '../state/preferences';

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState(() =>
    readPreferences(getBrowserStorage()),
  );
  useEffect(() => {
    writePreferences(getBrowserStorage(), preferences);
  }, [preferences]);
  return (
    <PreferencesContext
      value={{
        preferences,
        updateDraft: (patch) =>
          setPreferences((previous) => ({
            ...previous,
            draft: { ...previous.draft, ...patch },
          })),
        toggleSaved: (roomId) =>
          setPreferences((previous) => ({
            ...previous,
            savedRoomIds: previous.savedRoomIds.includes(roomId)
              ? previous.savedRoomIds.filter((id) => id !== roomId)
              : [...previous.savedRoomIds, roomId],
          })),
        clearDraft: () =>
          setPreferences((previous) => ({
            ...previous,
            draft: defaultPreferences().draft,
          })),
        reset: () => {
          resetPreferences(getBrowserStorage());
          setPreferences(defaultPreferences());
        },
      }}
    >
      {children}
    </PreferencesContext>
  );
}
