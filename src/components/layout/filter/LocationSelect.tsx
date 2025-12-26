import { useFilterProperties } from "@/app/store/useFilterProperties";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getDistricts, getUniqueCities } from "@/lib/propertyUtils";

function LocationSelect() {
  const filters = useFilterProperties((state) => state.filters);
  const uniqueCities = getUniqueCities();
  const setFilter = useFilterProperties((state) => state.setFilter);
  const districtsForSelectedCity = getDistricts(filters.city);

  return (
    <div className="flex gap-1.5 justify-between">
      <Select
        value={filters.city ?? "الرياض  "}
        onValueChange={(value) => setFilter("city", value)}
        dir="rtl"
      >
        <SelectTrigger className="w-full rtl">
          <SelectValue placeholder="الرياض" />
        </SelectTrigger>
        <SelectContent className="bg-background">
          {uniqueCities.map((city, i) => (
            <div key={i}>
              <SelectItem value={city}>{city}</SelectItem>
            </div>
          ))}
        </SelectContent>
      </Select>
      <Select
        defaultValue="الحي"
        value={filters.district ?? ""}
        onValueChange={(value) =>
          setFilter("district", value === "all" ? null : value)
        }
        dir="rtl"
      >
        <SelectTrigger className="w-full rtl">
          <SelectValue placeholder="الحي" />
        </SelectTrigger>
        <SelectContent className="bg-background">
          <SelectItem value="all">الكل</SelectItem>
          {districtsForSelectedCity.map((district) => (
            <SelectItem key={district} value={district}>
              {district}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default LocationSelect;
