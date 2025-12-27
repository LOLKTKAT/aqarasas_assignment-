"use client";

import { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Layers, Minus, Plus } from "lucide-react";
import { useFilterProperties } from "@/app/store/useFilterProperties";
import { GeoJSONFeatureCollection, Property } from "@/app/types/property-type";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

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
  const [mapStyle, setMapStyle] = useState(MAP_STYLES.standard);
  const markersRef = useRef<mapboxgl.Marker[]>([]); // Track markers for cleanup
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const filteredProperties = useFilterProperties(
    (state) => state.filteredProperties
  );

  function propertiesToGeoJSON(
    properties: Property[]
  ): GeoJSONFeatureCollection {
    return {
      type: "FeatureCollection",
      features: properties.map((p) => ({
        type: "Feature",
        geometry: p.location,
        properties: {
          id: p.id,
          title: p.title,
          price: p.price,
          area: p.area,
          purpose: p.purpose,
          district: p.district,
          isLuxury: p.isRadical,
        },
      })),
    };
  }
  const addPropertiesLayer = (map: mapboxgl.Map) => {
    if (map.getSource("properties")) return;

    map.addSource("properties", {
      type: "geojson",
      data: propertiesToGeoJSON(filteredProperties),
    });
  };

  const createMarkerElement = (property: Property) => {
    const el = document.createElement("div");
    el.className = "property-marker";

    // Hardcoded to your primary brand color
    const primaryColor = "#1e1450";

    const formattedPrice = new Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(property.price);

    el.innerHTML = `
    <div style="
      background-color: ${primaryColor};
      color: white;
      padding: 6px 12px;
      border-radius: 10px;
      font-weight: 700;
      font-size: 13px;
      position: relative;
      white-space: nowrap;
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
      cursor: pointer;
    ">
      ${formattedPrice} SAR
      <div style="
        position: absolute;
        bottom: -6px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 6px solid ${primaryColor};
      "></div>
    </div>
  `;
    return el;
  };

  const renderMarkers = () => {
    if (!map.current) return;

    // 1. Remove existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // 2. Add new markers
    filteredProperties.forEach((p) => {
      const el = createMarkerElement(p);

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat(p.location.coordinates as [number, number])
        .setPopup(
          new mapboxgl.Popup({
            offset: 30,
            closeButton: false,
            maxWidth: "280px",
            className: "property-popup",
          }).setHTML(`
          <div style="overflow: hidden; border-radius: 12px; font-family: 'Inter', sans-serif;">
            <div style="background: #f3f4f6; height: 120px; width: 100%; display: flex; align-items: center; justify-content: center; color: #9ca3af;">
            </div>
            
            <div style="padding: 12px;">
              <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 4px;">
                <h3 style="margin: 0; font-size: 16px; font-weight: 700; color: #111827; line-height: 1.2;">
                  ${p.title}
                </h3>
              </div>
              
              <p style="margin: 0 0 8px 0; font-size: 13px; color: #6b7280;">
                ${p.district}, Riyadh
              </p>

              <div style="display: flex; gap: 12px; margin-bottom: 12px; font-size: 12px; color: #374151;">
                <span><strong>${p.area}</strong> m²</span>
                <span><strong>${
                  p.purpose === "sale" ? "For Sale" : "For Rent"
                }</strong></span>
              </div>

              <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid #f3f4f6; pt: 10px; margin-top: 8px; padding-top: 10px;">
                <span style="font-size: 16px; font-weight: 800; color: #4f46e5;">
                  ${p.price.toLocaleString()} <small style="font-size: 10px; font-weight: 400;">SAR</small>
                </span>
                <button style="background: #4f46e5; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 11px; font-weight: 600; cursor: pointer;">
                  Details
                </button>
              </div>
            </div>
          </div>
        `)
        )
        .addTo(map.current!);

      markersRef.current.push(marker);
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
      setMapLoaded(true);

      const geojson = propertiesToGeoJSON(filteredProperties);

      // Add source
      map.current!.addSource("properties", {
        type: "geojson",
        data: geojson,
      });
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

  useEffect(() => {
    // Only proceed if the map is loaded and the source exists
    if (map.current && mapLoaded) {
      const source = map.current.getSource(
        "properties"
      ) as mapboxgl.GeoJSONSource;

      if (source) {
        // Convert your new filtered list to GeoJSON
        const newGeojson = propertiesToGeoJSON(filteredProperties);

        // Update the data without redrawing the whole map
        source.setData(newGeojson);

        // OPTIONAL: Smoothly fly to the new points if the list changed
        if (filteredProperties.length > 0) {
          const firstProp = filteredProperties[0];
          map.current.flyTo({
            center: firstProp.location.coordinates as [number, number],
            speed: 3,
            curve: 1,
            essential: true,
          });
        } else {
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 3000);
        }
      }
      if (mapLoaded) {
        renderMarkers();

        // Fly to results
        if (filteredProperties.length > 0) {
          map.current?.flyTo({
            center: filteredProperties[0].location.coordinates as [
              number,
              number
            ],
            essential: true,
            zoom: 10,
          });
        }
      }
    }
  }, [filteredProperties, mapLoaded, mapStyle]);

  return (
    <>
      <div
        id="map-container"
        ref={mapContainerRef}
        className={`h-full relative w-full`}
      />

      <div className="fixed md:absolute right-5 bottom-5  z-10 flex flex-col gap-3">
        {/* Zoom In */}
        <button
          onClick={zoomIn}
          className="size-9 border-primary border-2 rounded-lg  bg-background shadow-[0_8px_24px_rgba(0,0,0,0.12)]
          flex items-center justify-center hover:bg-gray-50 active:scale-95 transition"
          aria-label="Zoom in"
        >
          <Plus className="w-6 h-6 text-primary" />
        </button>

        {/* Zoom Out */}
        <button
          onClick={zoomOut}
          className="size-9 border-primary border-2 rounded-lg  bg-background shadow-[0_8px_24px_rgba(0,0,0,0.12)]
          flex items-center justify-center hover:bg-gray-50 active:scale-95 transition"
          aria-label="Zoom out"
        >
          <Minus className="w-6 h-6 text-primary" />
        </button>

        {/* Layers */}
        <button
          onClick={changeStyle}
          className="size-9 border-primary border-2 rounded-lg  bg-background shadow-[0_8px_24px_rgba(0,0,0,0.12)]
          flex items-center justify-center hover:bg-gray-50 active:scale-95 transition"
          aria-label="Change map style"
        >
          <Layers className="w-6 h-6 text-primary" />
        </button>
      </div>
      {showAlert && (
        <Alert
          variant="destructive"
          className="absolute top-8 right-5 z-[100] max-w-fit shadow-lg"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-[20px] font-bold">
            لايوجد عقار بهذه المواصفات
          </AlertDescription>
        </Alert>
      )}
      {!mapLoaded && (
        <div className="absolute end-0 bottom-0 w-full md:h-full h-[calc(100vh-64px)] flex flex-col gap-10 items-center justify-center bg-gray-100 z-50">
          <img
            src="/aqarsas-logo-glyph.png"
            alt="agarsas-logo"
            className="w-24 h-auto animate-spin"
          />
          <p className="text-primary font-bold text-3xl"> يتم تحميل الخريطة</p>
        </div>
      )}
    </>
  );
}
