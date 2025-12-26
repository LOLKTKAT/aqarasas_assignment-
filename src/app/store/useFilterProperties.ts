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
  district: string | null; // null means "all districts"
  duration: number;
  isRadical: boolean;
  areaRange: [number, number]; // [min, max]
  priceRange: [number, number]; // [min, max]
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
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

  // Helper method for range updates
  setRangeFilter: (
    key: "areaRange" | "priceRange",
    range: [number, number]
  ) => void;

  // Helper method for date range updates
  setDateRange: (from: Date | null, to: Date | null) => void;
}

/* =========================
   Filter Logic
========================= */

const applyFilters = (properties: Property[], filters: Filters): Property[] =>
  properties.filter((p) => {
    const matchesPurpose = p.purpose === filters.purpose;
    const matchesCity = p.city === filters.city;

    // District filter: if null, show all districts
    const matchesDistrict =
      !filters.district || p.district === filters.district;

    const matchesDuration = p.duration <= filters.duration;

    // If isRadical filter is false, show ALL properties
    // If isRadical filter is true, show ONLY radical properties
    const matchesRadical = !filters.isRadical || p.isRadical === true;

    // Area range filter
    const matchesArea =
      p.area >= filters.areaRange[0] && p.area <= filters.areaRange[1];

    // Price range filter
    const matchesPrice =
      p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1];

    // Date range filter
    let matchesDateRange = true;
    if (filters.dateRange.from || filters.dateRange.to) {
      const propertyDate = new Date(p.listedAt);

      if (filters.dateRange.from && filters.dateRange.to) {
        matchesDateRange =
          propertyDate >= filters.dateRange.from &&
          propertyDate <= filters.dateRange.to;
      } else if (filters.dateRange.from) {
        matchesDateRange = propertyDate >= filters.dateRange.from;
      } else if (filters.dateRange.to) {
        matchesDateRange = propertyDate <= filters.dateRange.to;
      }
    }

    return (
      matchesPurpose &&
      matchesCity &&
      matchesDistrict &&
      matchesDuration &&
      matchesRadical &&
      matchesArea &&
      matchesPrice &&
      matchesDateRange
    );
  });

/* =========================
   Store
========================= */

const defaultFiltersConfig: Filters = {
  purpose: "rent",
  city: "الرياض",
  district: null, // Show all districts by default
  duration: 2700, // three months
  isRadical: false,
  areaRange: [0, 25000], // Default: show all areas
  priceRange: [0, 10000000], // Default: show all prices
  dateRange: {
    from: null,
    to: null,
  },
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

      // When city changes, reset district to show all districts in new city
      if (key === "city") {
        newFilters.district = null;
      }

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

  // Convenience method for updating ranges
  setRangeFilter: (key, range) =>
    set((state) => {
      const newFilters = {
        ...state.filters,
        [key]: range,
      };

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

  // Convenience method for updating date range
  setDateRange: (from, to) =>
    set((state) => {
      const newFilters = {
        ...state.filters,
        dateRange: { from, to },
      };

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
