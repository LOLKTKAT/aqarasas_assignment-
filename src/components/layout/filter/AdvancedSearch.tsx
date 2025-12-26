import React, { useEffect, useState, useRef } from "react"; // 1. Import useRef
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useFilterProperties } from "@/app/store/useFilterProperties";

const AdvancedSearch = () => {
  // 2. Create a ref for the container
  const containerRef = useRef<HTMLDivElement>(null);

  const [fromDay, setFromDay] = useState<string>("");
  const [fromMonth, setFromMonth] = useState<string>("");
  const [fromYear, setFromYear] = useState<string>("");
  const [toDay, setToDay] = useState<string>("");
  const [toMonth, setToMonth] = useState<string>("");
  const [toYear, setToYear] = useState<string>("");
  const setDateRange = useFilterProperties((state) => state.setDateRange);

  // ... (Your existing Date logic remains unchanged) ...
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

  const buildDate = (day: string, month: string, year: string): Date | null => {
    if (!day || !month || !year) return null;
    const monthIndex = monthNames.indexOf(month);
    if (monthIndex === -1) return null;
    return new Date(parseInt(year), monthIndex, parseInt(day));
  };

  useEffect(() => {
    const from = buildDate(fromDay, fromMonth, fromYear);
    const to = buildDate(toDay, toMonth, toYear);
    setDateRange(from, to);
  }, [fromDay, fromMonth, fromYear, toDay, toMonth, toYear, setDateRange]);

  // 3. Helper function to handle scrolling
  const handleScrollToBottom = () => {
    // We use a small timeout to wait for the Accordion animation to expand
    // otherwise it scrolls before the height has actually increased.
    setTimeout(() => {
      containerRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end", // This aligns the bottom of the element with the bottom of the visible area
      });
    }, 200);
  };

  return (
    <div ref={containerRef} className="flex justify-between items-center pb-2">
      <Accordion className="w-full" type="single" collapsible>
        <AccordionItem value="item-1" className="border-none">
          {/* 5. Add onClick to the Trigger */}
          <AccordionTrigger onClick={handleScrollToBottom}>
            البحث المتقدم
          </AccordionTrigger>

          <AccordionContent className="grid grid-cols-3 gap-1 pt-2">
            {/* FROM DATE */}
            <Select value={fromDay} onValueChange={setFromDay}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Day" />
              </SelectTrigger>
              <SelectContent className="bg-background max-h-[200px]">
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
              <SelectContent className="bg-background max-h-[200px]">
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
              <SelectContent className="bg-background max-h-[200px]">
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
              <SelectContent className="bg-background max-h-[200px]">
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
              <SelectContent className="bg-background max-h-[200px]">
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
              <SelectContent className="bg-background max-h-[200px]">
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
  );
};

export default AdvancedSearch;
