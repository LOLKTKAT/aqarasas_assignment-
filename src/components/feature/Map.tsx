"use client";

import { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import useWindowWidth from "@/app/hooks/useWindowWidth";
import properties from "@/constans/propertiesData";
import { Layers, Minus, Plus } from "lucide-react";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
const MAP_STYLES = {
  standard: "mapbox://styles/mapbox/standard",
  streets: "mapbox://styles/mapbox/streets-v12",
  satellite: "mapbox://styles/mapbox/satellite-streets-v12",
};

export default function Map() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const width = useWindowWidth();

  const [mapStyle, setMapStyle] = useState(MAP_STYLES.standard);
  const addPropertiesLayer = (map: mapboxgl.Map) => {
    if (map.getSource("properties")) return;

    map.addSource("properties", {
      type: "geojson",
      data: propertiesToGeoJSON(properties),
    });

    map.addLayer({
      id: "properties-layer",
      type: "circle",
      source: "properties",
      paint: {
        "circle-radius": 8,
        "circle-color": [
          "case",
          ["==", ["get", "isLuxury"], true],
          "#4f46e5",
          "#22c55e",
        ],
        "circle-stroke-width": 2,
        "circle-stroke-color": "#fff",
      },
    });
  };

  const zoomIn = () => map.current?.zoomIn();
  const zoomOut = () => map.current?.zoomOut();

  const changeStyle = () => {
    if (!map.current) return;

    const styles = Object.values(MAP_STYLES);
    const currentIndex = styles.indexOf(mapStyle);
    const nextStyle = styles[(currentIndex + 1) % styles.length];

    setMapStyle(nextStyle);
    map.current.setStyle(nextStyle);
  };

  useEffect(() => {
    if (!mapContainerRef.current || map.current) {
      return;
    }

    if (!MAPBOX_TOKEN) {
      console.error(
        "Mapbox token not found. Add NEXT_PUBLIC_MAPBOX_TOKEN to .env.local"
      );
      return;
    }

    // Set mapbox token
    mapboxgl.accessToken = MAPBOX_TOKEN;

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: mapStyle,
      projection: "mercator",
      center: [46.6753, 24.7136],
      zoom: 10, // Street view zoom level
    });

    // Set map loaded state when map finishes loading
    map.current.on("load", () => {
      console.log("Map loaded successfully");
      setMapLoaded(true);

      const geojson = propertiesToGeoJSON(properties);

      // Add source
      map.current!.addSource("properties", {
        type: "geojson",
        data: geojson,
      });

      // Add layer (circles)
      map.current!.addLayer({
        id: "properties-layer",
        type: "circle",
        source: "properties",
        paint: {
          "circle-radius": 8,
          "circle-color": [
            "case",
            ["==", ["get", "isLuxury"], true],
            "#4f46e5", // luxury → indigo
            "#22c55e", // normal → green
          ],
          "circle-stroke-width": 2,
          "circle-stroke-color": "#ffffff",
        },
      });
    });

    map.current!.on("click", "properties-layer", (e) => {
      const feature = e.features?.[0];
      if (!feature) return;

      const { title, price, district } = feature.properties as any;
      const coordinates = (feature.geometry as any).coordinates.slice();

      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(
          `
          <div style="font-family: sans-serif">
            <strong>${title}</strong>
            <p>${district}</p>
            <p>${price.toLocaleString()} SAR</p>
          </div>
        `
        )
        .addTo(map.current!);
    });

    map.current!.on("mouseenter", "properties-layer", () => {
      map.current!.getCanvas().style.cursor = "pointer";
    });

    map.current!.on("mouseleave", "properties-layer", () => {
      map.current!.getCanvas().style.cursor = "";
    });

    // Handle map errors
    map.current.on("error", (e) => {
      console.error("Map error:", e);
    });

    map.current.on("style.load", () => {
      addPropertiesLayer(map.current!);
    });

    // Cleanup on unmount
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  const propertiesToGeoJSON = (properties: any[]) => {
    return {
      type: "FeatureCollection" as const,
      features: properties.map((p) => ({
        type: "Feature" as const,
        geometry: p.location,
        properties: {
          id: p.id,
          title: p.title,
          price: p.price,
          area: p.area,
          purpose: p.purpose,
          district: p.district,
          isLuxury: p.isLuxury,
        },
      })),
    } as GeoJSON.FeatureCollection;
  };

  return (
    <>
      <div
        id="map-container"
        ref={mapContainerRef}
        className={`h-full relative w-full`}
      />
      <div className="absolute right-56 bottom-5  z-10 flex flex-col gap-3">
        {/* Zoom In */}
        <button
          onClick={zoomIn}
          className="w-12 h-12 rounded-2xl bg-background shadow-[0_8px_24px_rgba(0,0,0,0.12)]
          flex items-center justify-center hover:bg-gray-50 active:scale-95 transition"
          aria-label="Zoom in"
        >
          <Plus className="w-6 h-6 text-primary" />
        </button>

        {/* Zoom Out */}
        <button
          onClick={zoomOut}
          className="w-12 h-12 rounded-2xl bg-background shadow-[0_8px_24px_rgba(0,0,0,0.12)]
          flex items-center justify-center hover:bg-gray-50 active:scale-95 transition"
          aria-label="Zoom out"
        >
          <Minus className="w-6 h-6 text-primary" />
        </button>

        {/* Layers */}
        <button
          onClick={changeStyle}
          className="w-12 h-12 rounded-2xl bg-background shadow-[0_8px_24px_rgba(0,0,0,0.12)]
          flex items-center justify-center hover:bg-gray-50 active:scale-95 transition"
          aria-label="Change map style"
        >
          <Layers className="w-6 h-6 text-primary" />
        </button>
      </div>
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-0">
          <p>Loading map...</p>
        </div>
      )}
    </>
  );
}
