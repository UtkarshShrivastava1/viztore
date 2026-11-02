import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapPin, Globe, Layers, ExternalLink } from 'lucide-react';

interface MapPickerProps {
  coordinates: [number, number]; // [longitude, latitude] or [latitude, longitude]
  onChange: (coords: [number, number]) => void;
  className?: string;
}

type MapLayerType = 'roadmap' | 'satellite';

const GOOGLE_TILE_LAYERS: Record<MapLayerType, { url: string; maxZoom: number; attribution: string }> = {
  roadmap: {
    url: 'https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    maxZoom: 20,
    attribution: '&copy; Google Maps',
  },
  satellite: {
    url: 'https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    maxZoom: 20,
    attribution: '&copy; Google Maps Satellite',
  },
};

export const MapPicker: React.FC<MapPickerProps> = ({
  coordinates,
  onChange,
  className = 'h-48 sm:h-56',
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const [mapType, setMapType] = useState<MapLayerType>('roadmap');

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
        zoom: 15,
        zoomControl: true,
        attributionControl: false,
      });

      const initialLayerConfig = GOOGLE_TILE_LAYERS[mapType];
      const tileLayer = L.tileLayer(initialLayerConfig.url, {
        subdomains: ['0', '1', '2', '3'],
        maxZoom: initialLayerConfig.maxZoom,
        attribution: initialLayerConfig.attribution,
      }).addTo(map);

      tileLayerRef.current = tileLayer;

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

  // Switch map layer when mapType changes (Roadmap vs Satellite)
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }
    const layerConfig = GOOGLE_TILE_LAYERS[mapType];
    const newTileLayer = L.tileLayer(layerConfig.url, {
      subdomains: ['0', '1', '2', '3'],
      maxZoom: layerConfig.maxZoom,
      attribution: layerConfig.attribution,
    }).addTo(mapInstanceRef.current);
    tileLayerRef.current = newTileLayer;
  }, [mapType]);

  // Update marker position if coordinates change externally (e.g. Current Location click)
  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current) {
      const currentMarkerPos = markerRef.current.getLatLng();
      if (
        Math.abs(currentMarkerPos.lat - lat) > 0.0001 ||
        Math.abs(currentMarkerPos.lng - lng) > 0.0001
      ) {
        markerRef.current.setLatLng([lat, lng]);
        mapInstanceRef.current.flyTo([lat, lng], 16, { duration: 1 });
      }
    }
  }, [lat, lng]);

  return (
    <div className={`relative rounded-2xl overflow-hidden border border-slate-200 ${className}`}>
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Map layer switcher controls (Roadmap vs Satellite) */}
      <div className="absolute top-2.5 right-2.5 z-[500] flex items-center bg-white/95 rounded-lg p-0.5 shadow-md border border-slate-200/90 text-xs backdrop-blur-xs">
        <button
          type="button"
          onClick={() => setMapType('roadmap')}
          className={`px-2.5 py-1 rounded-md font-medium text-[11px] transition-all flex items-center gap-1 ${
            mapType === 'roadmap'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title="Google Maps Street View"
        >
          <Globe className="w-3 h-3" />
          <span>Map</span>
        </button>
        <button
          type="button"
          onClick={() => setMapType('satellite')}
          className={`px-2.5 py-1 rounded-md font-medium text-[11px] transition-all flex items-center gap-1 ${
            mapType === 'satellite'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title="Google Maps Satellite Hybrid View"
        >
          <Layers className="w-3 h-3" />
          <span>Satellite</span>
        </button>
      </div>

      {/* Overlay badge with helper text and Google Maps direct link */}
      <div className="absolute bottom-2.5 left-3 right-3 z-[500] pointer-events-none flex items-center justify-between gap-2">
        <span className="bg-white/95 text-slate-700 text-[11px] font-semibold px-3 py-1 rounded-lg shadow-sm border border-slate-200/80 backdrop-blur-xs flex items-center gap-1.5 truncate">
          <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span className="truncate">Drag pin or click map to pinpoint pickup spot</span>
        </span>
        <div className="flex items-center gap-1.5 pointer-events-auto">
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/95 text-blue-700 hover:text-blue-800 text-[10px] font-medium px-2 py-1 rounded-md shadow-xs border border-blue-200 hover:bg-blue-50 transition-colors flex items-center gap-1"
            title="Verify location in Google Maps"
          >
            <span>Google Maps</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <span className="bg-slate-900/85 text-white text-[10px] font-mono px-2 py-1 rounded-md shadow-xs hidden sm:inline-block">
            {lat.toFixed(4)}, {lng.toFixed(4)}
          </span>
        </div>
      </div>
    </div>
  );
};
