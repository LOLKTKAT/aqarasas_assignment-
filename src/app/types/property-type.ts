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
  rentalDuration?: "hour" | "day" | "month" | "year";

  isLuxury: boolean;
};
