import Filter from "@/components/feature/Filter";
import Map from "@/components/feature/Map";

const page = () => {
  return (
    <div className="w-full relative">
      <Filter className="absolute end-1 top-1 " />
      <Map />
    </div>
  );
};

export default page;
