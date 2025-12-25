import { create } from "zustand";
import properties from "@/constans/propertiesData";
import { Property } from "../types/property-type";

/* =========================
   Types
========================= */

type Purpose = "rent" | "sale";

interface Filters {
  purpose: Purpose;
  city: string;
  duration: number;
}

interface PropertiesStore {
  allProperties: Property[];

  // Derived/computed state - always up to date
  filteredProperties: Property[];

  // Current filters (always defined)
  filters: Filters;

  // Default render on mount
  defaultFilters: Filters;

  // Has user touched filters?
  hasInteracted: boolean;

  setFilter: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
}

/* =========================
   Filter Logic
========================= */

const applyFilters = (properties: Property[], filters: Filters): Property[] =>
  properties.filter((p) => {
    return (
      p.purpose === filters.purpose &&
      p.city === filters.city &&
      p.duration <= filters.duration
    );
  });

/* =========================
   Store
========================= */

const defaultFiltersConfig: Filters = {
  purpose: "rent",
  city: "الرياض",
  duration: 2700,
};

export const useFilterProperties = create<PropertiesStore>((set, get) => ({
  allProperties: properties,

  // Used ONLY on first render
  defaultFilters: defaultFiltersConfig,

  // Filters always exist
  filters: defaultFiltersConfig,

  // Initialize with default filtered properties
  filteredProperties: applyFilters(properties, defaultFiltersConfig),

  hasInteracted: false,

  setFilter: (key, value) =>
    set((state) => {
      const newFilters = {
        ...state.filters,
        [key]: value,
      };

      // Compute filtered properties immediately when filters change
      const newFilteredProperties = applyFilters(
        state.allProperties,
        newFilters
      );

      return {
        hasInteracted: true,
        filters: newFilters,
        filteredProperties: newFilteredProperties,
      };
    }),
}));
