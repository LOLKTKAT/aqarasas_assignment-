export type Property = {
  id: string;

  purpose: "rent" | "sale";

  city: string;
  district: string;
  address: string;

  // Mapbox-friendly (same object)
  location: {
    type: "Point";
    coordinates: [number, number]; // [lng, lat]
  };

  title: string;
  description: string;

  area: number; // m²
  price: number; // SAR

  bedrooms: number;
  bathrooms: number;

  propertyType: "apartment" | "villa" | "office";

  listedAt: string;
  duration: number; // day | 3 days | month | 3 months in hours

  isRadical: boolean;
};

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