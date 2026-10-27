import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { RivalryRecord } from '../data/rivalriesData';

interface StadiumMapProps {
  rivalries: RivalryRecord[];
  darkMode: boolean;
  lang: 'it' | 'en';
  selectedRivalryId: string | null;
  onSelectRivalry: (id: string) => void;
}

export const StadiumMap: React.FC<StadiumMapProps> = ({
  rivalries,
  darkMode,
  lang,
  selectedRivalryId,
  onSelectRivalry,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [28, 12],
      zoom: 2,
      minZoom: 2,
      scrollWheelZoom: true,
    });

    const tileUrl = darkMode
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

    const tileLayer = L.tileLayer(tileUrl, {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO · Wikidata P625',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;
    tileLayerRef.current = tileLayer;
    layerGroupRef.current = layerGroup;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update tiles when dark mode toggles
  useEffect(() => {
    if (!tileLayerRef.current) return;
    const tileUrl = darkMode
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
    tileLayerRef.current.setUrl(tileUrl);
  }, [darkMode]);

  // Render stadium markers and connecting rivalry lines
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    rivalries.forEach((r) => {
      const isSelected = r.id === selectedRivalryId;
      const coordsA: [number, number] = [r.clubA.lat, r.clubA.lng];
      const coordsB: [number, number] = [r.clubB.lat, r.clubB.lng];

      // Draw geodesic/vector line connecting the two rival stadiums
      const line = L.polyline([coordsA, coordsB], {
        color: isSelected ? '#C5A059' : '#9E1B1B',
        weight: isSelected ? 3.5 : 2,
        opacity: isSelected ? 0.95 : 0.65,
        dashArray: r.type === 'city' ? undefined : '4, 4',
      });
      line.addTo(layerGroup);

      // Marker Club A
      const markerA = L.circleMarker(coordsA, {
        radius: isSelected ? 8 : 6,
        fillColor: r.clubA.primaryColor === '#FFFFFF' ? '#9E1B1B' : r.clubA.primaryColor,
        color: '#C5A059',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.9,
      });

      const popupContentA = `
        <div style="background:#0D0C0B;color:#F7F4EE;padding:12px 14px;min-width:220px;font-family:'Plus Jakarta Sans',sans-serif;">
          <div style="font-size:10px;color:#C5A059;letter-spacing:0.08em;text-transform:uppercase;">${r.name[lang]} · Opta #${r.leagueRank}</div>
          <div style="font-size:15px;font-weight:700;margin-top:2px;">${r.clubA.stadiumName}</div>
          <div style="font-size:12px;color:#D6CEBE;margin-top:2px;">${r.clubA.name} (${r.clubA.city})</div>
          <div style="font-size:11px;font-family:'IBM Plex Mono',monospace;margin-top:6px;color:#C5A059;">
            Cap: ${r.clubA.capacity.toLocaleString()} · P: ${r.pRaw} match
          </div>
        </div>
      `;
      markerA.bindPopup(popupContentA);
      markerA.on('click', () => onSelectRivalry(r.id));
      markerA.addTo(layerGroup);

      // Marker Club B
      const markerB = L.circleMarker(coordsB, {
        radius: isSelected ? 8 : 6,
        fillColor: r.clubB.primaryColor === '#FFFFFF' ? '#1B365D' : r.clubB.primaryColor,
        color: '#C5A059',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.9,
      });

      const popupContentB = `
        <div style="background:#0D0C0B;color:#F7F4EE;padding:12px 14px;min-width:220px;font-family:'Plus Jakarta Sans',sans-serif;">
          <div style="font-size:10px;color:#C5A059;letter-spacing:0.08em;text-transform:uppercase;">${r.name[lang]} · Opta #${r.leagueRank}</div>
          <div style="font-size:15px;font-weight:700;margin-top:2px;">${r.clubB.stadiumName}</div>
          <div style="font-size:12px;color:#D6CEBE;margin-top:2px;">${r.clubB.name} (${r.clubB.city})</div>
          <div style="font-size:11px;font-family:'IBM Plex Mono',monospace;margin-top:6px;color:#C5A059;">
            Cap: ${r.clubB.capacity.toLocaleString()} · P: ${r.pRaw} match
          </div>
        </div>
      `;
      markerB.bindPopup(popupContentB);
      markerB.on('click', () => onSelectRivalry(r.id));
      markerB.addTo(layerGroup);

      if (isSelected) {
        const bounds = L.latLngBounds([coordsA, coordsB]);
        map.fitBounds(bounds.pad(0.6), { maxZoom: 12 });
      }
    });
  }, [rivalries, selectedRivalryId, lang]);

  return (
    <div className="relative w-full h-[520px] border border-stone-300 dark:border-stone-800 overflow-hidden">
      <div ref={mapContainerRef} className="w-full h-full z-0" />
    </div>
  );
};
