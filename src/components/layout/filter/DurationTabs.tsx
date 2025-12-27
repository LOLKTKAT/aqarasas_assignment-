import { useFilterProperties } from "@/app/store/useFilterProperties";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

function DurationTabs() {
  const setFilter = useFilterProperties((state) => state.setFilter);
  const filters = useFilterProperties((state) => state.filters);
  return (
    <div className="flex flex-col gap-2">
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
  );
}

export default DurationTabs;
