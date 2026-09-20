import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface FilterState {
  tab: 'upcoming' | 'past' | 'cancelled';
}

interface FilterContextValue {
  filters: FilterState;
  setFilters: (updates: Partial<FilterState>) => void;
}

const FilterContext = createContext<FilterContextValue | null>(null);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFiltersState] = useState<FilterState>({
    tab: 'upcoming',
  });

  const setFilters = useCallback((updates: Partial<FilterState>) => {
    setFiltersState((prev) => ({ ...prev, ...updates }));
  }, []);

  return (
    <FilterContext.Provider value={{ filters, setFilters }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error('useFilters must be inside FilterProvider');
  return ctx;
}
