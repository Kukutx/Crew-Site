"use client";

import Image from "next/image";
import Script from "next/script";
import { useEffect, useMemo, useRef, useState } from "react";

import styles from "./map.module.css";

type LatLng = { lat: number; lng: number };

type GoogleMapTypeId = "roadmap" | "satellite";

type GoogleLatLngBounds = {
  extend: (point: LatLng) => void;
};

type GoogleMap = {
  setMapTypeId: (type: GoogleMapTypeId) => void;
  fitBounds: (bounds: GoogleLatLngBounds, padding?: number) => void;
  setOptions: (options: {
    zoom?: number;
    center?: LatLng;
    disableDefaultUI?: boolean;
    gestureHandling?: "greedy" | "cooperative" | "none" | "auto";
    styles?: unknown;
  }) => void;
};

type GooglePolyline = {
  setMap: (map: GoogleMap | null) => void;
  setOptions: (options: {
    strokeColor?: string;
    strokeOpacity?: number;
    strokeWeight?: number;
  }) => void;
};

type GooglePolylineOptions = {
  path: LatLng[];
  geodesic?: boolean;
  strokeColor?: string;
  strokeOpacity?: number;
  strokeWeight?: number;
  map?: GoogleMap;
};

type GoogleMapOptions = {
  center: LatLng;
  zoom: number;
  disableDefaultUI?: boolean;
  gestureHandling?: "greedy" | "cooperative" | "none" | "auto";
  mapTypeControl?: boolean;
  streetViewControl?: boolean;
  fullscreenControl?: boolean;
  zoomControl?: boolean;
};

type GoogleMapsAPI = {
  Map: new (element: HTMLElement, options: GoogleMapOptions) => GoogleMap;
  Polyline: new (options: GooglePolylineOptions) => GooglePolyline;
  LatLngBounds: new () => GoogleLatLngBounds;
};

type GoogleGlobal = {
  maps: GoogleMapsAPI;
};

type Trail = {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviews: number;
  length: number;
  difficulty: "Facile" | "Moderato" | "Impegnativo";
  duration: string;
  coverImage: string;
  highlights: string[];
  path: LatLng[];
};

const TRAILS: Trail[] = [
  {
    id: "duomo-panorama",
    name: "Milano: Duomo → Torre Branca",
    location: "Milano, Lombardia",
    rating: 4.7,
    reviews: 523,
    length: 6.4,
    difficulty: "Facile",
    duration: "1 h 55 min",
    coverImage:
      "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?auto=format&fit=crop&w=800&q=80",
    highlights: ["Cultura", "Adatto alle famiglie", "Pavimentato"],
    path: [
      { lat: 45.464211, lng: 9.191383 },
      { lat: 45.46619, lng: 9.18637 },
      { lat: 45.469576, lng: 9.180672 },
      { lat: 45.472142, lng: 9.179128 },
      { lat: 45.475834, lng: 9.180286 },
      { lat: 45.478092, lng: 9.182054 },
      { lat: 45.478782, lng: 9.184889 },
      { lat: 45.476452, lng: 9.189881 },
      { lat: 45.472844, lng: 9.192772 },
      { lat: 45.469233, lng: 9.194134 },
      { lat: 45.466319, lng: 9.194538 },
      { lat: 45.464211, lng: 9.191383 },
    ],
  },
  {
    id: "navigli-serale",
    name: "Navigli serale e Darsena",
    location: "Milano, Lombardia",
    rating: 4.6,
    reviews: 312,
    length: 4.2,
    difficulty: "Moderato",
    duration: "1 h 20 min",
    coverImage:
      "https://images.unsplash.com/photo-1505150892987-424388e40f36?auto=format&fit=crop&w=800&q=80",
    highlights: ["Tramonto", "Pet friendly", "Canali"],
    path: [
      { lat: 45.451386, lng: 9.170231 },
      { lat: 45.45282, lng: 9.173615 },
      { lat: 45.454756, lng: 9.177909 },
      { lat: 45.456997, lng: 9.180926 },
      { lat: 45.458864, lng: 9.181757 },
      { lat: 45.460676, lng: 9.179718 },
      { lat: 45.460908, lng: 9.176393 },
      { lat: 45.459116, lng: 9.172626 },
      { lat: 45.456789, lng: 9.16906 },
      { lat: 45.454046, lng: 9.166602 },
      { lat: 45.451839, lng: 9.167169 },
      { lat: 45.451386, lng: 9.170231 },
    ],
  },
  {
    id: "parco-sempione-loop",
    name: "Loop Parco Sempione",
    location: "Milano, Lombardia",
    rating: 4.9,
    reviews: 671,
    length: 3.3,
    difficulty: "Facile",
    duration: "58 min",
    coverImage:
      "https://images.unsplash.com/photo-1548585742-1df49d0d35ad?auto=format&fit=crop&w=800&q=80",
    highlights: ["Ombreggiato", "Accessibile", "Area picnic"],
    path: [
      { lat: 45.472198, lng: 9.182464 },
      { lat: 45.472822, lng: 9.178356 },
      { lat: 45.474436, lng: 9.175206 },
      { lat: 45.476676, lng: 9.17572 },
      { lat: 45.478058, lng: 9.178784 },
      { lat: 45.478414, lng: 9.18279 },
      { lat: 45.477198, lng: 9.186355 },
      { lat: 45.475394, lng: 9.188592 },
      { lat: 45.47321, lng: 9.188022 },
      { lat: 45.471972, lng: 9.185198 },
      { lat: 45.472198, lng: 9.182464 },
    ],
  },
  {
    id: "martesana-greenway",
    name: "Greenway Martesana",
    location: "Crescenzago, Lombardia",
    rating: 4.5,
    reviews: 289,
    length: 12.1,
    difficulty: "Moderato",
    duration: "3 h 05 min",
    coverImage:
      "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=800&q=80",
    highlights: ["Fiume", "Bici", "Rientro in metro"],
    path: [
      { lat: 45.513368, lng: 9.238247 },
      { lat: 45.508052, lng: 9.22261 },
      { lat: 45.504497, lng: 9.211719 },
      { lat: 45.500106, lng: 9.204602 },
      { lat: 45.494787, lng: 9.200245 },
      { lat: 45.489327, lng: 9.198554 },
      { lat: 45.483922, lng: 9.199697 },
      { lat: 45.478701, lng: 9.204087 },
      { lat: 45.474712, lng: 9.209967 },
      { lat: 45.472399, lng: 9.215763 },
      { lat: 45.471612, lng: 9.221841 },
      { lat: 45.473884, lng: 9.228498 },
      { lat: 45.478654, lng: 9.233332 },
      { lat: 45.485317, lng: 9.236374 },
      { lat: 45.492404, lng: 9.238286 },
      { lat: 45.499228, lng: 9.239045 },
      { lat: 45.506984, lng: 9.23961 },
      { lat: 45.513368, lng: 9.238247 },
    ],
  },
];

declare global {
  interface Window {
    google?: GoogleGlobal;
  }
}

export default function MapPage() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const polylinesRef = useRef<Map<string, GooglePolyline>>(new Map());
  const [mapInstance, setMapInstance] = useState<GoogleMap | null>(null);
  const [isGoogleReady, setIsGoogleReady] = useState(false);
  const [activeTrailId, setActiveTrailId] = useState(TRAILS[0]?.id);
  const [scriptError, setScriptError] = useState<string | null>(null);
  const [mapType, setMapType] = useState<GoogleMapTypeId>("roadmap");

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (!isGoogleReady || mapInstance || !mapContainerRef.current) {
      return;
    }

    const { google } = window;
    if (!google) {
      return;
    }

    const map = new google.maps.Map(mapContainerRef.current, {
      center: TRAILS[0]?.path[0] ?? { lat: 45.464211, lng: 9.191383 },
      zoom: 13,
      disableDefaultUI: true,
      gestureHandling: "greedy",
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      zoomControl: true,
    });

    setMapInstance(map);
  }, [isGoogleReady, mapInstance]);

  useEffect(() => {
    if (!mapInstance || !isGoogleReady || !window.google) {
      return;
    }

    const { google } = window;
    const bounds = new google.maps.LatLngBounds();
    const polylines = polylinesRef.current;

    TRAILS.forEach((trail) => {
      let polyline = polylines.get(trail.id);

      if (!polyline) {
        polyline = new google.maps.Polyline({
          path: trail.path,
          geodesic: true,
          strokeColor: "#2d3848",
          strokeOpacity: 0.95,
          strokeWeight: 3,
          map: mapInstance,
        });
        polylines.set(trail.id, polyline);
      } else {
        polyline.setMap(mapInstance);
        polyline.setOptions({ path: trail.path });
      }

      trail.path.forEach((point) => bounds.extend(point));
    });

    mapInstance.fitBounds(bounds, 64);

    return () => {
      polylines.forEach((polyline) => {
        polyline.setMap(null);
      });
    };
  }, [isGoogleReady, mapInstance]);

  useEffect(() => {
    if (!mapInstance) {
      return;
    }

    mapInstance.setMapTypeId(mapType);
  }, [mapInstance, mapType]);

  useEffect(() => {
    polylinesRef.current.forEach((polyline, id) => {
      const isActive = id === activeTrailId;
      polyline.setOptions({
        strokeColor: isActive ? "#ff6a00" : "#2d3848",
        strokeOpacity: isActive ? 1 : 0.65,
        strokeWeight: isActive ? 5 : 3,
      });
    });

    const activeCard = document.getElementById(`trail-${activeTrailId}`);
    activeCard?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [activeTrailId]);

  const activeTrail = useMemo(
    () => TRAILS.find((trail) => trail.id === activeTrailId) ?? TRAILS[0],
    [activeTrailId]
  );

  useEffect(() => {
    if (!mapInstance || !activeTrail || !window.google) {
      return;
    }

    const bounds = new window.google.maps.LatLngBounds();
    activeTrail.path.forEach((point) => bounds.extend(point));
    mapInstance.fitBounds(bounds, 80);
  }, [activeTrail, mapInstance]);

  const handleTrailSelect = (trail: Trail) => {
    setActiveTrailId(trail.id);
  };

  const handleScriptReady = () => {
    if (!window.google) {
      setScriptError("Impossibile caricare Google Maps in questo momento.");
      return;
    }

    setIsGoogleReady(true);
  };

  const handleScriptError = () => {
    setScriptError("Impossibile caricare Google Maps in questo momento.");
  };

  return (
    <div className={styles.page}>
      <div ref={mapContainerRef} className={styles.mapCanvas} aria-hidden />

      <header className={styles.topBar}>
        <div className={styles.brand}>
          <div className={styles.brandBadge} aria-hidden>
            <span />
          </div>
          <span className={styles.brandName}>AllTrails</span>
        </div>

        <div className={styles.searchBar}>
          <span className={styles.searchIcon} aria-hidden>
            🔍
          </span>
          <input
            type="search"
            placeholder="Cerca sentieri, parchi o città"
            aria-label="Cerca"
          />
        </div>

        <nav className={styles.navLinks} aria-label="Principale">
          <button type="button" className={styles.navLink}>
            Esplora
          </button>
          <button type="button" className={styles.navLink}>
            Piani
          </button>
          <button type="button" className={styles.navLink}>
            Community
          </button>
          <button type="button" className={styles.navLink}>
            Crea mappa
          </button>
        </nav>

        <div className={styles.accountActions}>
          <button type="button" className={styles.secondaryButton}>
            Accedi
          </button>
          <button type="button" className={styles.primaryButton}>
            Registrati
          </button>
        </div>
      </header>

      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div>
            <p className={styles.kicker}>Esplora sentieri</p>
            <h1>Milano, Lombardia</h1>
            <p className={styles.subtle}>{TRAILS.length} sentieri</p>
          </div>
          <button type="button" className={styles.shareButton}>
            Condividi
          </button>
        </div>

        <label className={styles.toggleRow}>
          <input type="checkbox" checked readOnly />
          <span>Contemplazione religiosa</span>
        </label>

        <div className={styles.filterRow}>
          {[
            "Distanza",
            "Difficoltà",
            "Lunghezza",
            "Tempo",
            "Altitudine",
          ].map((label) => (
            <button key={label} type="button" className={styles.filterButton}>
              {label}
            </button>
          ))}
          <button type="button" className={styles.moreFilters}>
            Altri filtri
          </button>
        </div>

        <div className={styles.cards}>
          {TRAILS.map((trail) => {
            const isActive = trail.id === activeTrailId;
            return (
              <article
                key={trail.id}
                id={`trail-${trail.id}`}
                className={isActive ? styles.cardActive : styles.card}
                onMouseEnter={() => handleTrailSelect(trail)}
                onFocus={() => handleTrailSelect(trail)}
                onClick={() => handleTrailSelect(trail)}
                role="button"
                tabIndex={0}
              >
                <div className={styles.cardMedia}>
                  <Image
                    src={trail.coverImage}
                    alt={trail.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 320px"
                    priority={trail.id === TRAILS[0].id}
                  />
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.cardTitleRow}>
                    <h2>{trail.name}</h2>
                    <span className={styles.rating}>
                      ⭐ {trail.rating.toFixed(1)}
                      <span className={styles.reviewCount}>({trail.reviews})</span>
                    </span>
                  </div>
                  <p className={styles.cardMeta}>{trail.location}</p>
                  <div className={styles.cardChips}>
                    <span>{trail.length.toFixed(1)} km</span>
                    <span>{trail.difficulty}</span>
                    <span>{trail.duration}</span>
                  </div>
                  <ul className={styles.cardHighlights}>
                    {trail.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>
      </aside>

      <div className={styles.mapControls}>
        <div className={styles.mapControlGroup}>
          {(
            [
              { id: "roadmap" as GoogleMapTypeId, label: "Mappa" },
              { id: "satellite" as GoogleMapTypeId, label: "Satellite" },
            ] as const
          ).map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setMapType(id)}
              className={
                mapType === id ? styles.mapControlActive : styles.mapControl
              }
            >
              {label}
            </button>
          ))}
        </div>
        <button type="button" className={styles.roundControl}>
          ⊕
        </button>
      </div>

      {!apiKey && !scriptError ? (
        <div className={styles.mapStatus} role="status">
          Fornisci una Google Maps API key per visualizzare la mappa.
        </div>
      ) : null}

      {scriptError ? (
        <div className={styles.mapStatus} role="alert">
          {scriptError}
        </div>
      ) : null}

      {apiKey ? (
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${apiKey}`}
          onReady={handleScriptReady}
          onError={handleScriptError}
          strategy="lazyOnload"
        />
      ) : null}
    </div>
  );
}
