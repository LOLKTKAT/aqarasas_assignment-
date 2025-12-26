import { useFilterProperties } from "@/app/store/useFilterProperties";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";

const PurposeTabs = () => {
  const setFilter = useFilterProperties((state) => state.setFilter);
  const filters = useFilterProperties((state) => state.filters);
  return (
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
  );
};

export default PurposeTabs;
