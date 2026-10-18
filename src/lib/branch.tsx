import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { branches, type Branch, type BranchId } from '../data/madelina';
import { branchStatus, wineToday, type Status } from './time';

const STORAGE_KEY = 'madelina.branch';

type Ctx = {
  branchId: BranchId | null;
  branch: Branch;
  other: Branch;
  chosen: boolean;
  setBranch: (id: BranchId) => void;
  now: Date;
  status: Record<BranchId, Status>;
  /** True while a Brixton wine night is on, or while the evening preview is switched on. */
  evening: boolean;
  wineLive: boolean;
  previewEvening: boolean;
  setPreviewEvening: (on: boolean) => void;
};

const BranchContext = createContext<Ctx | null>(null);

function readStored(): BranchId | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === 'brixton' || v === 'dulwich' ? v : null;
  } catch {
    return null;
  }
}

export function BranchProvider({ children }: { children: ReactNode }) {
  const [branchId, setBranchId] = useState<BranchId | null>(readStored);
  const [now, setNow] = useState(() => new Date());
  const [previewEvening, setPreviewEvening] = useState(false);

  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(t);
  }, []);

  const status = useMemo(
    () => ({ brixton: branchStatus(branches.brixton, now), dulwich: branchStatus(branches.dulwich, now) }),
    [now],
  );

  // Before anyone has picked, lead with whichever branch is open (Brixton if both or neither).
  const effectiveId: BranchId = branchId ?? (!status.brixton.open && status.dulwich.open ? 'dulwich' : 'brixton');
  const branch = branches[effectiveId];
  const other = branches[effectiveId === 'brixton' ? 'dulwich' : 'brixton'];

  const wineLive = effectiveId === 'brixton' && !!wineToday(branches.brixton, now)?.now;
  const evening = wineLive || (previewEvening && effectiveId === 'brixton');

  const setBranch = useCallback((id: BranchId) => {
    setBranchId(id);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      /* private mode: the choice just won't stick */
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.mode = evening ? 'evening' : 'day';
    document.documentElement.dataset.branch = effectiveId;
    const meta = document.querySelector('meta[name="theme-color"]');
    meta?.setAttribute('content', evening ? '#1d2850' : '#f2e7d6');
  }, [evening, effectiveId]);

  const value: Ctx = {
    branchId,
    branch,
    other,
    chosen: branchId !== null,
    setBranch,
    now,
    status,
    evening,
    wineLive,
    previewEvening,
    setPreviewEvening,
  };
  return <BranchContext.Provider value={value}>{children}</BranchContext.Provider>;
}

export function useBranch() {
  const ctx = useContext(BranchContext);
  if (!ctx) throw new Error('useBranch outside BranchProvider');
  return ctx;
}
