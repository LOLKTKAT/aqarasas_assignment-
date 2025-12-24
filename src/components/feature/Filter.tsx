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
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type FilterProps = React.ComponentPropsWithoutRef<"div">;

const Filter = React.forwardRef<HTMLDivElement, FilterProps>(function Filter(
  { className, dir, ...props },
  ref
) {
  const [rangesValues, setRangesValues] = useState<[number, number]>([
    0, 25000,
  ]);
  const [priceValues, setPriceValues] = useState<[number, number]>([0, 25000]);

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

  const [fromDate, setFromDate] = useState({
    day: String(today.getDate()),
    month: String(today.getMonth() + 1),
    year: String(today.getFullYear()),
  });

  // default `to` = today
  const [toDate, setToDate] = useState({
    day: String(today.getDate()),
    month: String(today.getMonth() + 1),
    year: String(today.getFullYear()),
  });

  return (
    <div
      ref={ref}
      dir={dir ?? "rtl"}
      {...props}
      className={cn(
        "text-foreground bg-background/90 w-[331px] m-3 shadow-xl border border-gray-soft p-4 gap-4 flex flex-col rounded-lg",
        className
      )}
    >
      <div className="flex justify-between ">
        <Tabs defaultValue="account" className="w-full ">
          <TabsList varient="bordered" className="h-8">
            <TabsTrigger value="account">إجار</TabsTrigger>
            <TabsTrigger value="password">بيع</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="flex gap-1.5 justify-between">
        <Select dir="rtl">
          <SelectTrigger className="w-full rtl">
            <SelectValue placeholder="الرياض" />
          </SelectTrigger>
          <SelectContent className="bg-background">
            <SelectItem value="light">الرياض</SelectItem>
            <SelectItem value="dark">جدة</SelectItem>
            <SelectItem value="system">مكة</SelectItem>
          </SelectContent>
        </Select>
        <Select dir="rtl">
          <SelectTrigger className="w-full rtl">
            <SelectValue placeholder="الحي" />
          </SelectTrigger>
          <SelectContent className="bg-background">
            <SelectItem value="light">المونسية</SelectItem>
            <SelectItem value="dark">النرجس</SelectItem>
            <SelectItem value="system">التعاون</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <div>المدة</div>
        <Tabs defaultValue="24-hours" className="w-full ">
          <TabsList varient="faded" className="h-8 text-xs">
            <TabsTrigger value="24-hours">آخر ٢٤ ساعة</TabsTrigger>
            <TabsTrigger value="3-days">آخر ٣ أيام</TabsTrigger>
            <TabsTrigger value="last-months">آخر شهر</TabsTrigger>
            <TabsTrigger value="3-months">آخر ٣ أشهر</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div dir="ltr">
        <div>Ranges</div>
        <div className="flex flex-col gap-3">
          <Slider
            label="Area (m²)"
            value={rangesValues}
            onChange={(val) => setRangesValues(val as [number, number])}
            min={0}
            max={25000}
            step={500}
            showTooltip
          />
          <div className="flex gap-[52px] rounded-lg">
            {/* Lower Bound Input (values[0]) */}
            <Input
              className="bg-secondary w-full rounded-lg px-3"
              placeholder="0"
              type="number"
              min={0}
              max={rangesValues[1]} // Visual hint for the browser
              value={rangesValues[0]}
              onChange={(e) => {
                const val = Number(e.target.value);
                setRangesValues((prev) => {
                  const next = [...prev] as [number, number];
                  // Ensure val is not less than 0 AND not greater than the current Upper Bound
                  next[0] = Math.min(next[1], Math.max(0, val));
                  return next;
                });
              }}
            />

            {/* Upper Bound Input (values[1]) */}
            <Input
              className="bg-secondary w-full rounded-lg px-3"
              placeholder="25000"
              type="number"
              min={rangesValues[0]} // Visual hint for the browser
              max={25000}
              value={rangesValues[1]}
              onChange={(e) => {
                const val = Number(e.target.value);
                setRangesValues((prev) => {
                  const next = [...prev] as [number, number];
                  // Ensure val is not greater than 25000 AND not less than the current Lower Bound
                  next[1] = Math.min(25000, Math.max(next[0], val));
                  return next;
                });
              }}
            />
          </div>
        </div>
        <div dir="rtl" className="flex flex-col gap-3">
          <Slider
            label="السعر"
            value={priceValues}
            onChange={(val) => setPriceValues(val as [number, number])}
            min={0}
            max={25000}
            step={500}
            showTooltip
          />
          <div dir="ltr" className="flex gap-[52px] rounded-lg">
            {/* Lower Bound Input (values[0]) */}
            <Input
              className="bg-secondary w-full rounded-lg px-3"
              placeholder="0"
              type="number"
              min={0}
              max={priceValues[1]} // Visual hint for the browser
              value={priceValues[0]}
              onChange={(e) => {
                const val = Number(e.target.value);
                setPriceValues((prev) => {
                  const next = [...prev] as [number, number];
                  // Ensure val is not less than 0 AND not greater than the current Upper Bound
                  next[0] = Math.min(next[1], Math.max(0, val));
                  return next;
                });
              }}
            />

            {/* Upper Bound Input (values[1]) */}
            <Input
              className="bg-secondary w-full rounded-lg px-3"
              placeholder="25000"
              type="number"
              min={priceValues[0]} // Visual hint for the browser
              max={25000}
              value={priceValues[1]}
              onChange={(e) => {
                const val = Number(e.target.value);
                setPriceValues((prev) => {
                  const next = [...prev] as [number, number];
                  // Ensure val is not greater than 25000 AND not less than the current Lower Bound
                  next[1] = Math.min(25000, Math.max(next[0], val));
                  return next;
                });
              }}
            />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Label htmlFor="bargain">صفقات متطرفة</Label>
        <Switch id="bargain" />
      </div>
      <div className="flex justify-between items-center">
        <Accordion className="w-full" type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>البحث المتقدم</AccordionTrigger>
            <AccordionContent className="grid grid-cols-3 gap-1">
              <Select>
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

              <Select>
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

              <Select>
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
              <Select>
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

              <Select>
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

              <Select>
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
