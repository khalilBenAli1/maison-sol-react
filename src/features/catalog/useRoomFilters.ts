import { useEffect, useRef } from 'react';
import { useNavigationType, useSearchParams } from 'react-router';
import { parseRoomFilters } from '../../domain/filters';
import type { RoomFilters } from '../../domain/types';

export default function useRoomFilters() {
  const [search, setSearch] = useSearchParams();
  const navigationType = useNavigationType();
  const pending = useRef<URLSearchParams | null>(null);
  useEffect(() => {
    if (
      navigationType !== 'REPLACE' ||
      pending.current?.toString() === search.toString()
    )
      pending.current = null;
  }, [search, navigationType]);
  // Router transitions may defer a render. Merge uncommitted intent rather than
  // rebuilding each rapid change from the same stale URL snapshot.
  function change(key: keyof RoomFilters, value: string) {
    const next = new URLSearchParams(pending.current ?? search);
    if (!value) next.delete(key);
    else next.set(key, value);
    pending.current = next;
    setSearch(next, { replace: true });
  }
  function resetFilters() {
    const next = new URLSearchParams();
    pending.current = next;
    setSearch(next, { replace: true });
  }
  return { filters: parseRoomFilters(search), change, resetFilters };
}
