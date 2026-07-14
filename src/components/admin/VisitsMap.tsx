import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import type { VisitRecord, LeadRecord } from "@/lib/admin";

type MapPoint = {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
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
    const exact = !!(v.browserGeo?.latitude && v.browserGeo?.longitude);
    const loc = exact ? v.browserGeo! : v.ipLocation;
    if (loc?.latitude && loc?.longitude) {
      points.push({
        latitude: loc.latitude,
        longitude: loc.longitude,
        city: "city" in loc ? loc.city : undefined,
        country: "country" in loc ? loc.country : undefined,
        kind: "visit",
        exact,
      });
    }
  }
  for (const l of leads) {
    const exact = !!(l.browserGeo?.latitude && l.browserGeo?.longitude);
    const loc = exact ? l.browserGeo! : l.ipLocation;
    if (loc?.latitude && loc?.longitude) {
      points.push({
        latitude: loc.latitude,
        longitude: loc.longitude,
        city: "city" in loc ? loc.city : undefined,
        country: "country" in loc ? loc.country : undefined,
        kind: "lead",
        exact,
      });
    }
  }
  return points;
}

// A perfectly-centred numbered bubble. Used for both cluster icons and single
// markers, so counts always sit dead-centre.
function bubbleHtml(count: number, color: string, exact: boolean) {
  const size = Math.round(Math.min(28 + Math.log2(count + 1) * 8, 56));
  const font = count >= 100 ? 11 : count >= 10 ? 13 : 14;
  return {
    html: `<div style="
      box-sizing:border-box;width:${size}px;height:${size}px;
      display:flex;align-items:center;justify-content:center;
      background:${color};color:#fff;border:2px solid #fff;border-radius:9999px;
      font:700 ${font}px sans-serif;box-shadow:0 4px 14px ${color}66;
      ${exact ? "outline:2px solid " + color + "44;outline-offset:2px;" : ""}
    ">${count}</div>`,
    size,
  };
}

// Interactive OpenStreetMap. Nearby points are clustered into one bubble whose
// number is the SUM of visits underneath; zooming in splits them apart
// (leaflet.markercluster). Bubble colour = magenta if the group contains any
// exact GPS location, else sky-blue for IP-only.
export function VisitsMap({ visits, leads }: { visits: VisitRecord[]; leads: LeadRecord[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const clusterRef = useRef<import("leaflet").LayerGroup | null>(null);
  const resizeObsRef = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      // markercluster augments Leaflet's DEFAULT export object; the ESM namespace
      // doesn't re-expose the added factory, so resolve to the default here.
      const leafletMod = await import("leaflet");
      const L = ((leafletMod as { default?: typeof import("leaflet") }).default ??
        leafletMod) as typeof import("leaflet");
      await import("leaflet.markercluster");
      if (cancelled || !containerRef.current) return;

      if (!mapRef.current) {
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

        const map = mapRef.current;
        requestAnimationFrame(() => map.invalidateSize());
        setTimeout(() => map.invalidateSize(), 300);
        if (typeof ResizeObserver !== "undefined") {
          resizeObsRef.current = new ResizeObserver(() => map.invalidateSize());
          resizeObsRef.current.observe(containerRef.current);
        }
      }
      const map = mapRef.current;

      // Rebuild the cluster layer on data change.
      if (clusterRef.current) {
        map.removeLayer(clusterRef.current);
        clusterRef.current = null;
      }

      const Lc = L as unknown as {
        markerClusterGroup: (opts: Record<string, unknown>) => import("leaflet").LayerGroup & {
          addLayer: (l: unknown) => void;
        };
      };

      const cluster = Lc.markerClusterGroup({
        maxClusterRadius: 45,
        showCoverageOnHover: false,
        spiderfyOnMaxZoom: true,
        // Cluster bubble = sum of child visits, coloured by whether any child is exact.
        iconCreateFunction: (c: {
          getChildCount: () => number;
          getAllChildMarkers: () => { options: { exact?: boolean } }[];
        }) => {
          const count = c.getChildCount();
          const anyExact = c.getAllChildMarkers().some((m) => m.options.exact);
          const { html, size } = bubbleHtml(count, anyExact ? COLOR_EXACT : COLOR_IP, anyExact);
          return L.divIcon({ html, className: "uis-cluster", iconSize: [size, size], iconAnchor: [size / 2, size / 2] });
        },
      });

      const points = toPoints(visits, leads);
      for (const p of points) {
        const color = p.exact ? COLOR_EXACT : COLOR_IP;
        const { html, size } = bubbleHtml(1, color, p.exact);
        const icon = L.divIcon({ html, className: "uis-point", iconSize: [size, size], iconAnchor: [size / 2, size / 2] });
        const marker = L.marker([p.latitude, p.longitude], {
          icon,
          // custom flag read back in iconCreateFunction
          ...({ exact: p.exact } as object),
        });
        marker.bindPopup(
          `<div style="font-family:sans-serif;font-size:12px;min-width:150px">
            <strong>${p.city ?? "Unknown city"}, ${p.country ?? "—"}</strong><br/>
            ${p.kind === "lead" ? "Form submission" : "Visit"}
            <br/><span style="color:${color};font-weight:700">${p.exact ? "📍 Exact (GPS allowed)" : "≈ Approx (by IP)"}</span>
          </div>`,
        );
        cluster.addLayer(marker);
      }

      map.addLayer(cluster);
      clusterRef.current = cluster;
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
