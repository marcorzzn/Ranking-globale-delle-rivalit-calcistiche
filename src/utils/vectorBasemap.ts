import L from 'leaflet';
import { feature } from 'topojson-client';
import countries110m from 'world-atlas/countries-110m.json';

let cachedGeoJson: GeoJSON.FeatureCollection | null = null;

function getCountriesGeoJson(): GeoJSON.FeatureCollection {
  if (cachedGeoJson) return cachedGeoJson;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const topology = countries110m as any;
  cachedGeoJson = feature(
    topology,
    topology.objects.countries
  ) as unknown as GeoJSON.FeatureCollection;
  return cachedGeoJson;
}

/**
 * Mounts a 100% self-contained Natural Earth Vector World Basemap inside Leaflet.
 * Zero external API keys required, zero watermarks, works offline and in strict sandboxes.
 */
export function mountVectorWorldBasemap(
  map: L.Map,
  darkMode: boolean
): {
  updateTheme: (isDark: boolean) => void;
} {
  const container = map.getContainer();
  container.style.backgroundColor = darkMode ? '#0D0C0B' : '#EAE4D7';

  if (!map.getPane('vectorLandPane')) {
    const pane = map.createPane('vectorLandPane');
    pane.style.zIndex = '200';
    pane.style.pointerEvents = 'none';
  }

  // Latitude & Longitude Graticule Grid (1920s Italian Futurist Cartography aesthetic)
  const graticuleLines: L.LatLngExpression[][] = [];
  for (let lat = -60; lat <= 75; lat += 15) {
    graticuleLines.push([
      [lat, -180],
      [lat, 180],
    ]);
  }
  for (let lng = -180; lng <= 180; lng += 30) {
    graticuleLines.push([
      [-80, lng],
      [85, lng],
    ]);
  }

  const graticuleLayer = L.polyline(graticuleLines, {
    pane: 'vectorLandPane',
    color: darkMode ? '#262320' : '#D5CEC0',
    weight: 0.7,
    opacity: 0.75,
    dashArray: '3, 3',
    interactive: false,
  }).addTo(map);

  const geoData = getCountriesGeoJson();
  const geoJsonLayer = L.geoJSON(geoData, {
    pane: 'vectorLandPane',
    interactive: false,
    style: () => ({
      fillColor: darkMode ? '#1C1917' : '#F7F4EE',
      fillOpacity: 1,
      color: darkMode ? '#57534E' : '#8C857B',
      weight: 1.1,
      opacity: 0.95,
    }),
  }).addTo(map);

  const updateTheme = (isDark: boolean) => {
    container.style.backgroundColor = isDark ? '#0D0C0B' : '#EAE4D7';
    graticuleLayer.setStyle({
      color: isDark ? '#262320' : '#D5CEC0',
    });
    geoJsonLayer.setStyle({
      fillColor: isDark ? '#1C1917' : '#F7F4EE',
      color: isDark ? '#57534E' : '#8C857B',
    });
  };

  return { updateTheme };
}
