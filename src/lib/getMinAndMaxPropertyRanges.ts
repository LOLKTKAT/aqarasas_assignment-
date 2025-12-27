import { Property } from "@/app/types/property-type";
import properties from "@/constans/propertiesData";

export function getMinAndMaxPropertyPrice(): {
  minPrice: number;
  maxPrice: number;
} {
  if (properties.length === 0) {
    return { minPrice: 0, maxPrice: 0 };
  }

  return properties.reduce(
    (acc, property) => ({
      minPrice: Math.min(acc.minPrice, property.price),
      maxPrice: Math.max(acc.maxPrice, property.price),
    }),
    {
      minPrice: properties[0].price,
      maxPrice: properties[0].price,
    }
  );
}
export function getMinAndMaxPropertyArea(): {
  minArea: number;
  maxArea: number;
} {
  if (properties.length === 0) {
    return { minArea: 0, maxArea: 0 };
  }

  return properties.reduce(
    (acc, property) => ({
      minArea: Math.min(acc.minArea, property.area),
      maxArea: Math.max(acc.maxArea, property.area),
    }),
    {
      minArea: properties[0].area,
      maxArea: properties[0].area,
    }
  );
}
