import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import type { VisitRecord, LeadRecord } from "@/lib/admin";

type MapPoint = {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
  when: Date | null;
  kind: "visit" | "lead";
  // exact = pinpointed by the browser's GPS (a form submitter who allowed it),
  // as opposed to an approximate IP-based location.
  exact: boolean;
};

// Marker colours: exact GPS-submitted locations vs approximate IP locations.
const COLOR_EXACT = "#E61C83"; // magenta — a real submitted/allowed location
const COLOR_IP = "#16A7E0"; // sky blue — approximate, from IP

function toPoints(visits: VisitRecord[], leads: LeadRecord[]): MapPoint[] {
  const points: MapPoint[] = [];
  for (const v of visits) {
    // A visit is "exact" only if the visitor granted GPS on their visit.
    const exact = !!(v.browserGeo?.latitude && v.browserGeo?.longitude);
    const loc = exact ? v.browserGeo! : v.ipLocation;
    if (loc?.latitude && loc?.longitude) {
      points.push({
        latitude: loc.latitude,
        longitude: loc.longitude,
        city: "city" in loc ? loc.city : undefined,
        country: "country" in loc ? loc.country : undefined,
        when: v.createdAt,
        kind: "visit",
        exact,
      });
    }
  }
  for (const l of leads) {
    // Prefer the browser's exact GPS pin for leads when they granted it.
    const exact = !!(l.browserGeo?.latitude && l.browserGeo?.longitude);
    const loc = exact ? l.browserGeo! : l.ipLocation;
    if (loc?.latitude && loc?.longitude) {
      points.push({
        latitude: loc.latitude,
        longitude: loc.longitude,
        city: "city" in loc ? loc.city : undefined,
        country: "country" in loc ? loc.country : undefined,
        when: l.createdAt,
        kind: "lead",
        exact,
      });
    }
  }
  return points;
}

// Interactive OpenStreetMap (no API key required) showing every visit/lead that
// has a resolvable location. Nearby points within ~1km are grouped into a
// single marker sized by count, so dense cities don't turn into marker soup.
export function VisitsMap({ visits, leads }: { visits: VisitRecord[]; leads: LeadRecord[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const resizeObsRef = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const L = await import("leaflet");
      if (cancelled || !containerRef.current) return;

      // Fix default marker icon URLs, which break under bundlers otherwise.
      delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
      L.Icon.Default.mergeOptions({ iconRetinaUrl: markerIcon2x, iconUrl: markerIcon, shadowUrl: markerShadow });

      if (!mapRef.current) {
        // Fully interactive: scroll-wheel + pinch zoom, drag, double-click zoom.
        mapRef.current = L.map(containerRef.current, {
          scrollWheelZoom: true,
          touchZoom: true,
          doubleClickZoom: true,
          dragging: true,
          zoomControl: true,
        }).setView([20, 20], 2);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 18,
        }).addTo(mapRef.current);

        // Leaflet caches the container's pixel size at init. On mobile the
        // container is often narrower/settling when that happens, so the map
        // renders too wide and spills off-screen. Recompute after paint and on
        // every container resize so it always fits the phone viewport.
        const map = mapRef.current;
        requestAnimationFrame(() => map.invalidateSize());
        setTimeout(() => map.invalidateSize(), 300);
        if (typeof ResizeObserver !== "undefined") {
          resizeObsRef.current = new ResizeObserver(() => map.invalidateSize());
          resizeObsRef.current.observe(containerRef.current);
        }
      }
      const map = mapRef.current;

      // Clear previous markers (re-render on data change) without recreating the map.
      map.eachLayer((layer) => {
        if ((layer as unknown as { _isVisitMarker?: boolean })._isVisitMarker) map.removeLayer(layer);
      });

      const points = toPoints(visits, leads);
      const groups = new Map<string, MapPoint[]>();
      for (const p of points) {
        // Group by city+country so IP-geolocation jitter (which returns slightly
        // different coords per lookup) doesn't split one city into many markers.
        // Exact GPS points stay on their own precise coordinate.
        const key = p.exact
          ? `gps:${p.latitude.toFixed(4)},${p.longitude.toFixed(4)}`
          : p.city || p.country
            ? `place:${(p.city ?? "").toLowerCase()}|${(p.country ?? "").toLowerCase()}`
            : `coord:${p.latitude.toFixed(1)},${p.longitude.toFixed(1)}`;
        const arr = groups.get(key) ?? [];
        arr.push(p);
        groups.set(key, arr);
      }

      for (const [, group] of groups) {
        const [first] = group;
        const visitCount = group.filter((g) => g.kind === "visit").length;
        const leadCount = group.filter((g) => g.kind === "lead").length;
        const total = group.length;
        // Colour by location precision: magenta if this spot has any exact
        // GPS-submitted location, sky-blue if it's only approximate (IP).
        const isExact = group.some((g) => g.exact);
        const color = isExact ? COLOR_EXACT : COLOR_IP;
        // Bubble grows with count; the number sits inside it.
        const size = Math.round(Math.min(24 + Math.log2(total + 1) * 8, 52));
        const fontSize = total >= 100 ? 10 : total >= 10 ? 12 : 13;

        const icon = L.divIcon({
          className: "uis-visit-marker",
          html: `<div style="
            width:${size}px;height:${size}px;line-height:${size}px;
            background:${color};color:#fff;border:2px solid #fff;border-radius:9999px;
            text-align:center;font:700 ${fontSize}px sans-serif;
            box-shadow:0 4px 12px ${color}66;">${total}</div>`,
          iconSize: [size, size],
          iconAnchor: [size / 2, size / 2],
        });

        const marker = L.marker([first.latitude, first.longitude], { icon });
        (marker as unknown as { _isVisitMarker: boolean })._isVisitMarker = true;

        marker.bindPopup(
          `<div style="font-family:sans-serif;font-size:12px;min-width:150px">
            <strong>${first.city ?? "Unknown city"}, ${first.country ?? "—"}</strong><br/>
            ${visitCount} visit${visitCount === 1 ? "" : "s"}${leadCount ? `, ${leadCount} form submission${leadCount === 1 ? "" : "s"}` : ""}
            <br/><span style="color:${color};font-weight:700">${isExact ? "📍 Exact (GPS allowed)" : "≈ Approx (by IP)"}</span>
          </div>`,
        );
        marker.addTo(map);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [visits, leads]);

  useEffect(
    () => () => {
      resizeObsRef.current?.disconnect();
      resizeObsRef.current = null;
      mapRef.current?.remove();
      mapRef.current = null;
    },
    [],
  );

  // `isolate` + `z-0` keep Leaflet's high internal z-indexes from painting over
  // the admin sidebar / mobile menu (which sit above this in the shell).
  return <div ref={containerRef} className="relative z-0 h-full w-full overflow-hidden rounded-2xl [isolation:isolate]" />;
}
