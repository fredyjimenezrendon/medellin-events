"use client";

import { useCallback, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

interface LocationPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
  initialLat?: number;
  initialLng?: number;
}

const containerStyle = {
  width: "100%",
  height: "400px",
};

// Default center: Medellín, Colombia
const defaultCenter = {
  lat: 6.2442,
  lng: -75.5812,
};

export default function LocationPicker({
  onLocationSelect,
  initialLat,
  initialLng,
}: LocationPickerProps) {
  const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number } | null>(
    initialLat && initialLng ? { lat: initialLat, lng: initialLng } : null
  );

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const handleMapClick = useCallback(
    (event: google.maps.MapMouseEvent) => {
      if (event.latLng) {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        setMarkerPosition({ lat, lng });
        onLocationSelect(lat, lng);
      }
    },
    [onLocationSelect]
  );

  const handleClearLocation = () => {
    setMarkerPosition(null);
    onLocationSelect(0, 0);
  };

  if (loadError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-800 text-sm">
          <strong>Error loading Google Maps.</strong>
          <br />
          Please check your API key configuration.
        </p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="bg-gray-100 rounded-md p-4 h-[400px] flex items-center justify-center">
        <div className="text-gray-600">
          <div className="animate-pulse">Loading map...</div>
        </div>
      </div>
    );
  }

  const center = markerPosition || defaultCenter;

  return (
    <div>
      <div className="mb-2 flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Click on the map to select the event location
        </p>
        {markerPosition && (
          <button
            type="button"
            onClick={handleClearLocation}
            className="text-sm text-red-600 hover:text-red-800 underline"
          >
            Clear location
          </button>
        )}
      </div>

      <div className="rounded-lg overflow-hidden border border-gray-300">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={markerPosition ? 15 : 13}
          onClick={handleMapClick}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
        >
          {markerPosition && <Marker position={markerPosition} />}
        </GoogleMap>
      </div>

      {markerPosition && (
        <div className="mt-2 p-3 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-800">
            <strong>Selected coordinates:</strong>
            <br />
            Latitude: {markerPosition.lat.toFixed(6)}
            <br />
            Longitude: {markerPosition.lng.toFixed(6)}
          </p>
        </div>
      )}
    </div>
  );
}
