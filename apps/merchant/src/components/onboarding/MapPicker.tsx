import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { MapPin } from 'lucide-react';

interface MapPickerProps {
  coordinates: [number, number]; // [longitude, latitude] or [latitude, longitude]
  onChange: (coords: [number, number]) => void;
  className?: string;
}

export const MapPicker: React.FC<MapPickerProps> = ({
  coordinates,
  onChange,
  className = 'h-48 sm:h-56',
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  // coordinates are [lng, lat] to follow GeoJSON format in store
  const lng = coordinates[0];
  const lat = coordinates[1];

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Custom modern pin marker
    const customIcon = L.divIcon({
      className: 'custom-map-marker',
      html: `
        <div style="
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #2563eb;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.4), 0 4px 6px -4px rgba(37, 99, 235, 0.2);
          border: 2px solid #ffffff;
          cursor: grab;
          transform: translate(-18px, -18px);
        ">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [lat, lng],
        zoom: 14,
        zoomControl: true,
        attributionControl: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);

      const marker = L.marker([lat, lng], {
        icon: customIcon,
        draggable: true,
      }).addTo(map);

      marker.on('dragend', () => {
        const position = marker.getLatLng();
        onChange([position.lng, position.lat]);
      });

      map.on('click', (e: L.LeafletMouseEvent) => {
        marker.setLatLng(e.latlng);
        onChange([e.latlng.lng, e.latlng.lat]);
      });

      mapInstanceRef.current = map;
      markerRef.current = marker;
    } else {
      const map = mapInstanceRef.current;
      const marker = markerRef.current;
      if (marker) {
        marker.setLatLng([lat, lng]);
      }
      map.setView([lat, lng], map.getZoom());
    }

    return () => {
      // Don't necessarily destroy on every small state tick unless unmounting
    };
  }, []);

  // Update marker position if coordinates change externally (e.g. Current Location click)
  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current) {
      const currentMarkerPos = markerRef.current.getLatLng();
      if (
        Math.abs(currentMarkerPos.lat - lat) > 0.0001 ||
        Math.abs(currentMarkerPos.lng - lng) > 0.0001
      ) {
        markerRef.current.setLatLng([lat, lng]);
        mapInstanceRef.current.flyTo([lat, lng], 15, { duration: 1 });
      }
    }
  }, [lat, lng]);

  return (
    <div className={`relative rounded-2xl overflow-hidden border border-slate-200 ${className}`}>
      <div ref={mapContainerRef} className="w-full h-full z-0" />
      {/* Overlay badge with helper text */}
      <div className="absolute bottom-2.5 left-3 right-3 z-10 pointer-events-none flex items-center justify-between">
        <span className="bg-white/95 text-slate-700 text-[11px] font-semibold px-3 py-1 rounded-lg shadow-sm border border-slate-200/80 backdrop-blur-xs flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-blue-600" />
          Click on map or drag pin to adjust pickup location
        </span>
        <span className="bg-slate-900/80 text-white text-[10px] font-mono px-2.5 py-1 rounded-md shadow-xs hidden sm:inline-block">
          {lat.toFixed(4)}, {lng.toFixed(4)}
        </span>
      </div>
    </div>
  );
};
