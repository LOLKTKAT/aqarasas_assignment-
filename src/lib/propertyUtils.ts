import properties from "@/constans/propertiesData";

interface GeoJSONFeature {
  type: "Feature";
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
  properties: {
    id: string;
    title: string;
    price: number;
    area: number;
    purpose: string;
    district: string;
    isLuxury: boolean;
  };
}

export interface GeoJSONFeatureCollection {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
}

// Gets all unique districts for a given city
function getDistricts(city: string): string[] {
  const cityProperties = properties.filter(property => property.city === city);
  return Array.from(new Set(cityProperties.map(prop => prop.district)));
}

// Gets all unique cities from the properties data
function getUniqueCities(): string[] {
  return Array.from(new Set(properties.map(property => property.city)));
}

// Convert properties to GeoJSON format
function propertiesToGeoJSON(properties: any[]): GeoJSONFeatureCollection {
  return {
    type: "FeatureCollection",
    features: properties.map((p) => ({
      type: "Feature" as const,
      geometry: {
        type: "Point" as const,
        coordinates: [p.location.coordinates[1], p.location.coordinates[0]], // [lng, lat]
      },
      properties: {
        id: p.id,
        title: p.title,
        price: p.price,
        area: p.area,
        purpose: p.purpose,
        district: p.district,
        isLuxury: p.isLuxury,
      },
    })),
  };
}

export { getDistricts, getUniqueCities, propertiesToGeoJSON };