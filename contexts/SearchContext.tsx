import React, { createContext, useCallback, useContext, useState } from "react";

type SearchState = {
  sport: string;
  location: string;
  maxDistance: number;
  setFilters: (sport: string, location: string, maxDistance?: number) => void;
  clearFilters: () => void;
};

const SearchContext = createContext<SearchState>({
  sport: "",
  location: "",
  maxDistance: 50,
  setFilters: () => {},
  clearFilters: () => {},
});

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [sport, setSport] = useState("");
  const [location, setLocation] = useState("");
  const [maxDistance, setMaxDistance] = useState(50);

  const setFilters = useCallback((s: string, l: string, d = 50) => {
    setSport(s);
    setLocation(l);
    setMaxDistance(d);
  }, []);

  const clearFilters = useCallback(() => {
    setSport("");
    setLocation("");
    setMaxDistance(50);
  }, []);

  return (
    <SearchContext.Provider value={{ sport, location, maxDistance, setFilters, clearFilters }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  return useContext(SearchContext);
}
