"use client";

import { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "../../app/globals.css";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoibG9sa3RrYXQiLCJhIjoiY21qamRndDU2MDNtNDNscXl5YnJlOGpiNCJ9.1eCP4pcsqIUTvHGS7YLQJA";

export default function Map() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

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
      style: "mapbox://styles/mapbox/standard",
      projection: "mercator",
      center: [46.6753, 24.7136],
      zoom: 13, // Street view zoom level
    });

    // Set map loaded state when map finishes loading
    map.current.on("load", () => {
      console.log("Map loaded successfully");
      setMapLoaded(true);
      // Resize map after load to ensure correct rendering
      if (map.current) {
        map.current.resize();
      }
    });

    // Handle map errors
    map.current.on("error", (e) => {
      console.error("Map error:", e);
    });

    // Handle window resize
    const handleResize = () => {
      if (map.current) {
        map.current.resize();
      }
    };
    window.addEventListener("resize", handleResize);

    // Use ResizeObserver to detect container size changes
    const resizeObserver = new ResizeObserver(() => {
      if (map.current) {
        map.current.resize();
      }
    });

    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    // Cleanup on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
      resizeObserver.disconnect();
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  return (
    <>
      <div
        id="map-container"
        ref={mapContainerRef}
        className="w-full h-full min-h-[400px] relative"
      />
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-0">
          <p>Loading map...</p>
        </div>
      )}
    </>
  );
}
