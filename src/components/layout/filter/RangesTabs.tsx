"use client";
import { useFilterProperties } from "@/app/store/useFilterProperties";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  getMinAndMaxPropertyArea,
  getMinAndMaxPropertyPrice,
} from "@/lib/getMinAndMaxPropertyRanges";

function RangesTabs() {
  const filters = useFilterProperties((state) => state.filters);
  const setRangeFilter = useFilterProperties((state) => state.setRangeFilter);

  const { maxPrice } = getMinAndMaxPropertyPrice();
  const { maxArea } = getMinAndMaxPropertyArea();

  return (
    <div dir="ltr">
      <div>Ranges</div>
      <div className="flex flex-col gap-3">
        <Slider
          label="Area (m²)"
          value={filters.areaRange}
          onChange={(val) =>
            setRangeFilter("areaRange", val as [number, number])
          }
          min={0}
          max={maxArea}
          step={maxArea / 50}
          showTooltip
        />
        <div className="flex gap-[52px] rounded-lg">
          <Input
            className="bg-secondary w-full rounded-lg px-3"
            placeholder="0"
            type="number"
            min={0}
            max={filters.areaRange[1]}
            value={filters.areaRange[0]}
            onChange={(e) => {
              const val = Number(e.target.value);
              const newRange: [number, number] = [
                Math.min(filters.areaRange[1], Math.max(0, val)),
                filters.areaRange[1],
              ];
              setRangeFilter("areaRange", newRange);
            }}
          />

          <Input
            className="bg-secondary w-full rounded-lg px-3"
            type="number"
            min={filters.areaRange[0]}
            max={maxArea}
            value={filters.areaRange[1]}
            onChange={(e) => {
              const val = Number(e.target.value);
              const newRange: [number, number] = [
                filters.areaRange[0],
                Math.max(filters.areaRange[0], Math.min(maxArea, val)),
              ];
              setRangeFilter("areaRange", newRange);
            }}
          />
        </div>
      </div>
      <div dir="rtl" className="flex flex-col gap-3">
        <Slider
          label="السعر"
          value={filters.priceRange}
          onChange={(val) =>
            setRangeFilter("priceRange", val as [number, number])
          }
          min={0}
          max={maxPrice}
          step={maxPrice / 1000} // Adjust step as needed
          showTooltip
        />
        <div dir="ltr" className="flex gap-[52px] rounded-lg">
          {/* Lower Bound Input (priceRange[0]) */}
          <Input
            className="bg-secondary w-full rounded-lg px-3"
            placeholder="0"
            type="number"
            min={0}
            max={filters.priceRange[1]}
            value={filters.priceRange[0]}
            onChange={(e) => {
              const val = Number(e.target.value);
              const newRange: [number, number] = [
                Math.min(filters.priceRange[1], Math.max(0, val)),
                filters.priceRange[1],
              ];
              setRangeFilter("priceRange", newRange);
            }}
          />

          {/* Upper Bound Input (priceRange[1]) */}
          <Input
            className="bg-secondary w-full rounded-lg px-3"
            placeholder="10000000"
            type="number"
            min={filters.priceRange[0]}
            max={maxPrice}
            value={filters.priceRange[1]}
            onChange={(e) => {
              const val = Number(e.target.value);
              const newRange: [number, number] = [
                filters.priceRange[0],
                Math.min(maxPrice, Math.max(filters.priceRange[0], val)),
              ];
              setRangeFilter("priceRange", newRange);
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default RangesTabs;
