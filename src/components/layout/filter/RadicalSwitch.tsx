import { useFilterProperties } from "@/app/store/useFilterProperties";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

function RadicalSwitch() {
  const setFilter = useFilterProperties((state) => state.setFilter);

  return (
    <div className="flex items-center gap-2">
      <Label htmlFor="bargain">صفقات متطرفة</Label>
      <Switch
        onCheckedChange={(value) => setFilter("isRadical", value)}
        id="bargain"
        defaultChecked={false}
      />
    </div>
  );
}

export default RadicalSwitch;
