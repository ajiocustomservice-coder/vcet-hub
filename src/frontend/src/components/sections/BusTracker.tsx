import { useEffect, useState } from "react";

const routes = [
  {
    id: 1,
    name: "Route 1 – Madurai Central",
    color: "#00d4ff",
    coords: [
      [9.9195, 78.1198],
      [9.922, 78.1215],
      [9.9252, 78.1198],
    ] as [number, number][],
    stops: ["Madurai Central", "Town Hall", "VCET Campus"],
    busPos: [9.922, 78.1215] as [number, number],
  },
  {
    id: 2,
    name: "Route 2 – Anna Nagar",
    color: "#a855f7",
    coords: [
      [9.94, 78.105],
      [9.935, 78.112],
      [9.93, 78.116],
      [9.9252, 78.1198],
    ] as [number, number][],
    stops: ["Anna Nagar", "Bypass Road", "Kochadai", "VCET Campus"],
    busPos: [9.932, 78.114] as [number, number],
  },
  {
    id: 3,
    name: "Route 3 – Thirunagar",
    color: "#34d399",
    coords: [
      [9.91, 78.13],
      [9.915, 78.126],
      [9.92, 78.123],
      [9.9252, 78.1198],
    ] as [number, number][],
    stops: ["Thirunagar", "Iyer Bungalow", "Nagamalai", "VCET Campus"],
    busPos: [9.917, 78.1245] as [number, number],
  },
  {
    id: 4,
    name: "Route 4 – Mattuthavani",
    color: "#fbbf24",
    coords: [
      [9.89, 78.14],
      [9.9, 78.132],
      [9.913, 78.125],
      [9.9252, 78.1198],
    ] as [number, number][],
    stops: ["Mattuthavani", "Periyar Bus Stand", "Villapuram", "VCET Campus"],
    busPos: [9.905, 78.135] as [number, number],
  },
];

export default function BusTracker() {
  const [selectedRoute, setSelectedRoute] = useState<number | null>(null);
  const [MapComponents, setMapComponents] = useState<any>(null);

  useEffect(() => {
    import("react-leaflet").then((rl) => {
      import("leaflet").then((L) => {
        // Fix default icon
        (L.default.Icon.Default.prototype as any)._getIconUrl = undefined;
        L.default.Icon.Default.mergeOptions({
          iconRetinaUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          iconUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          shadowUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        });
        setMapComponents({ ...rl, L: L.default });
      });
    });
  }, []);

  const visible =
    selectedRoute === null
      ? routes
      : routes.filter((r) => r.id === selectedRoute);

  if (!MapComponents) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: 400,
          color: "#64748b",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🚌</div>
          <div>Loading map...</div>
        </div>
      </div>
    );
  }

  const { MapContainer, TileLayer, Polyline, Marker, Popup, CircleMarker } =
    MapComponents;

  return (
    <div style={{ animation: "fadeSlide 0.4s ease" }}>
      <h2
        style={{
          color: "#f1f5f9",
          fontSize: 22,
          fontWeight: 700,
          marginBottom: 16,
        }}
      >
        Bus Tracker
      </h2>

      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 16,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <select
          value={selectedRoute ?? "all"}
          onChange={(e) =>
            setSelectedRoute(
              e.target.value === "all" ? null : Number.parseInt(e.target.value),
            )
          }
          style={{
            padding: "10px 16px",
            background: "rgba(0,0,0,0.5)",
            border: "1px solid rgba(0,212,255,0.2)",
            borderRadius: 10,
            color: "#f1f5f9",
            fontSize: 13,
            outline: "none",
          }}
        >
          <option value="all">All Routes</option>
          {routes.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
        {routes.map((r) => (
          <div
            key={r.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 12px",
              borderRadius: 20,
              background: "rgba(0,0,0,0.3)",
              border: `1px solid ${r.color}44`,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: r.color,
                boxShadow: `0 0 8px ${r.color}`,
              }}
            />
            <span style={{ color: "#94a3b8", fontSize: 12 }}>
              {r.name.split("–")[1]?.trim()}
            </span>
          </div>
        ))}
      </div>

      <div
        style={{
          borderRadius: 16,
          overflow: "hidden",
          border: "1px solid rgba(0,212,255,0.2)",
          boxShadow: "0 0 30px rgba(0,212,255,0.1)",
        }}
      >
        <MapContainer
          center={[9.9252, 78.1198]}
          zoom={13}
          style={{ height: 480, width: "100%" }}
          zoomControl={true}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com">CARTO</a>'
          />
          {visible.map((r) => (
            <>
              <Polyline
                key={`poly-${r.id}`}
                positions={r.coords}
                color={r.color}
                weight={3}
                opacity={0.8}
              />
              <CircleMarker
                key={`bus-${r.id}`}
                center={r.busPos}
                radius={10}
                fillColor={r.color}
                color="#fff"
                weight={2}
                fillOpacity={0.9}
              >
                <Popup>
                  <div
                    style={{
                      background: "#0f172a",
                      color: "#f1f5f9",
                      padding: 8,
                      borderRadius: 8,
                    }}
                  >
                    <strong style={{ color: r.color }}>{r.name}</strong>
                    <br />
                    <span style={{ fontSize: 12, color: "#94a3b8" }}>
                      Stops: {r.stops.join(" → ")}
                    </span>
                  </div>
                </Popup>
              </CircleMarker>
              {r.stops.map((stop, i) => (
                <Marker
                  key={`stop-${r.id}-${i}`}
                  position={
                    r.coords[
                      Math.floor(
                        (i * (r.coords.length - 1)) / (r.stops.length - 1),
                      )
                    ] as [number, number]
                  }
                >
                  <Popup>
                    <div
                      style={{
                        background: "#0f172a",
                        color: "#f1f5f9",
                        padding: "6px 10px",
                        borderRadius: 8,
                      }}
                    >
                      <span style={{ color: r.color, fontWeight: 600 }}>
                        {stop}
                      </span>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </>
          ))}
        </MapContainer>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))",
          gap: 12,
          marginTop: 16,
        }}
      >
        {visible.map((r) => (
          <div
            key={r.id}
            style={{
              background: "rgba(15,23,42,0.7)",
              backdropFilter: "blur(12px)",
              border: `1px solid ${r.color}33`,
              borderRadius: 12,
              padding: 14,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 8,
              }}
            >
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: r.color,
                  boxShadow: `0 0 10px ${r.color}`,
                  flexShrink: 0,
                }}
              />
              <span style={{ color: "#f1f5f9", fontWeight: 600, fontSize: 14 }}>
                {r.name}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {r.stops.map((s, i) => (
                <div
                  key={i}
                  style={{ display: "flex", alignItems: "center", gap: 8 }}
                >
                  <span style={{ color: r.color, fontSize: 12 }}>
                    {i === r.stops.length - 1 ? "●" : "○"}
                  </span>
                  <span style={{ color: "#94a3b8", fontSize: 12 }}>{s}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <style>
        {
          "@keyframes fadeSlide { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }"
        }
      </style>
    </div>
  );
}
