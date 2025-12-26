"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useFilterProperties } from "@/app/store/useFilterProperties";
import { getDistricts, getUniqueCities } from "@/lib/propertyUtils";

type FilterProps = React.ComponentPropsWithoutRef<"div">;

const Filter = React.forwardRef<HTMLDivElement, FilterProps>(function Filter(
  { className, dir, ...props },
  ref
) {
  const setDateRange = useFilterProperties((state) => state.setDateRange);
  const setFilter = useFilterProperties((state) => state.setFilter);
  const filters = useFilterProperties((state) => state.filters);
  const setRangeFilter = useFilterProperties((state) => state.setRangeFilter);
  const [fromDay, setFromDay] = useState<string>("");
  const [fromMonth, setFromMonth] = useState<string>("");
  const [fromYear, setFromYear] = useState<string>("");
  const [toDay, setToDay] = useState<string>("");
  const [toMonth, setToMonth] = useState<string>("");
  const [toYear, setToYear] = useState<string>("");
  const filteredProperties = useFilterProperties(
    (state) => state.filteredProperties
  );
  const uniqueCities = getUniqueCities();
  const districtsForSelectedCity = getDistricts(filters.city);
  // Date selects: initialize to real time (today)
  const today = new Date();
  const currentYear = today.getFullYear();
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const days = Array.from({ length: 31 }, (_, i) => String(i + 1));
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1),
    label: monthNames[i],
  }));
  const years = Array.from({ length: 11 }, (_, i) =>
    String(currentYear - 5 + i)
  );

  // Helper to convert selections to Date
  const buildDate = (day: string, month: string, year: string): Date | null => {
    if (!day || !month || !year) return null;
    const monthIndex = monthNames.indexOf(month);
    if (monthIndex === -1) return null;
    return new Date(parseInt(year), monthIndex, parseInt(day));
  };

  // Update store whenever date selections change
  useEffect(() => {
    const from = buildDate(fromDay, fromMonth, fromYear);
    const to = buildDate(toDay, toMonth, toYear);
    setDateRange(from, to);
  }, [fromDay, fromMonth, fromYear, toDay, toMonth, toYear, setDateRange]);
  return (
    <div
      ref={ref}
      dir={dir ?? "rtl"}
      {...props}
      className={cn(
        "text-foreground transition-transform z-10 bg-background/90 w-[331px] m-3 shadow-xl border border-gray-soft p-4 gap-4 flex flex-col rounded-lg",
        className
      )}
    >
      <div className="flex justify-between ">
        <Tabs
          defaultValue={filters.purpose}
          onValueChange={(value) =>
            setFilter("purpose", value as "rent" | "sale")
          }
          className="w-full"
        >
          <TabsList varient="bordered" className="h-8">
            <TabsTrigger value="rent">إيجار</TabsTrigger>
            <TabsTrigger value="sale">بيع</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
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
      <div>
        <div>المدة</div>
        <Tabs
          defaultValue={String(filters.duration)}
          onValueChange={(value) => setFilter("duration", Number(value))}
          className="w-full"
        >
          <TabsList varient="faded" className="h-8 text-xs">
            <TabsTrigger value="24">آخر ٢٤ ساعة</TabsTrigger>
            <TabsTrigger value="72">آخر ٣ أيام</TabsTrigger>
            <TabsTrigger value="790">آخر شهر</TabsTrigger>
            <TabsTrigger value="2700">آخر ٣ أشهر</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
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
            max={25000}
            step={500}
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
              placeholder="25000"
              type="number"
              min={filters.areaRange[0]}
              max={25000}
              value={filters.areaRange[1]}
              onChange={(e) => {
                const val = Number(e.target.value);
                const newRange: [number, number] = [
                  filters.areaRange[0],
                  Math.max(filters.areaRange[0], Math.min(25000, val)),
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
            max={10000000} // Adjust based on your max price
            step={10000} // Adjust step as needed
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
              max={10000000} // Adjust based on your max price
              value={filters.priceRange[1]}
              onChange={(e) => {
                const val = Number(e.target.value);
                const newRange: [number, number] = [
                  filters.priceRange[0],
                  Math.min(10000000, Math.max(filters.priceRange[0], val)),
                ];
                setRangeFilter("priceRange", newRange);
              }}
            />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Label htmlFor="bargain">صفقات متطرفة</Label>
        <Switch
          onCheckedChange={(value) => setFilter("isRadical", value)}
          id="bargain"
          defaultChecked={false}
        />
      </div>
      <div className="flex justify-between items-center">
        <Accordion className="w-full" type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>البحث المتقدم</AccordionTrigger>
            <AccordionContent className="grid grid-cols-3 gap-1">
              {/* FROM DATE */}
              <Select value={fromDay} onValueChange={setFromDay}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Day" />
                </SelectTrigger>
                <SelectContent className="bg-background">
                  {days.map((day) => (
                    <SelectItem key={day} value={day}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={fromMonth} onValueChange={setFromMonth}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Mo" />
                </SelectTrigger>
                <SelectContent className="bg-background">
                  {monthNames.map((month) => (
                    <SelectItem key={month} value={month}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={fromYear} onValueChange={setFromYear}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent className="bg-background">
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* TO DATE */}
              <Select value={toDay} onValueChange={setToDay}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Day" />
                </SelectTrigger>
                <SelectContent className="bg-background">
                  {days.map((day) => (
                    <SelectItem key={day} value={day}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={toMonth} onValueChange={setToMonth}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Mo" />
                </SelectTrigger>
                <SelectContent className="bg-background">
                  {monthNames.map((month) => (
                    <SelectItem key={month} value={month}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={toYear} onValueChange={setToYear}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent className="bg-background">
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
});

Filter.displayName = "Filter";

export default Filter;
