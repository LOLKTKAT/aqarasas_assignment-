"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { SlidersHorizontal } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import PurposeTabs from "../layout/filter/PurposeTabs";
import LocationSelect from "../layout/filter/LocationSelect";
import DurationTabs from "../layout/filter/DurationTabs";
import RangesTabs from "../layout/filter/RangesTabs";
import RadicalSwitch from "../layout/filter/RadicalSwitch";
import AdvancedSearch from "../layout/filter/AdvancedSearch";

type FilterProps = React.ComponentPropsWithoutRef<"div">;

const FilterContent = React.forwardRef<HTMLDivElement, FilterProps>(
  function FilterContent({ className, dir, ...props }, ref) {
    return (
      <div
        ref={ref}
        dir={dir ?? "rtl"}
        {...props}
        className={cn("text-foreground w-full gap-4 flex flex-col", className)}
      >
        <PurposeTabs />
        <LocationSelect />
        <DurationTabs />
        <RangesTabs />
        <RadicalSwitch />
        <AdvancedSearch />
      </div>
    );
  }
);

FilterContent.displayName = "FilterContent";

const Filter = React.forwardRef<HTMLDivElement, FilterProps>(function Filter(
  { className, dir, ...props },
  ref
) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop Filter - Hidden on mobile */}
      <div
        ref={ref}
        dir={dir ?? "rtl"}
        {...props}
        className={cn(
          "hidden md:flex max-h-[530px] no-scrollbar overflow-y-auto text-foreground transition-transform z-10 bg-background/90 w-[331px] m-3 shadow-xl border border-gray-200 p-4 gap-4 flex-col rounded-lg",
          className
        )}
      >
        <FilterContent />
      </div>

      {/* Mobile Filter Button & Drawer - Hidden on desktop */}
      <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <button className="rounded-full text-primary text-lg bg-background flex gap-1 p-4">
              <SlidersHorizontal className="h-6 w-6" />
              <div>تصفية البحث</div>
            </button>
          </DrawerTrigger>
          <DrawerContent className="max-h-[85vh]">
            <DrawerHeader className="text-right" dir={dir ?? "rtl"}>
              <DrawerTitle>تصفية البحث</DrawerTitle>
            </DrawerHeader>
            <div className="overflow-y-auto px-4 pb-8">
              <FilterContent dir={dir ?? "rtl"} />
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </>
  );
});

Filter.displayName = "Filter";

export default Filter;
