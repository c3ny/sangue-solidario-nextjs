"use client";

import { useEffect, useRef, useState } from "react";
import { useMap } from "@/contexts/Map/MapContext";
import mapboxgl from "mapbox-gl";
import styles from "./geosearch.module.scss";

export const SearchControl = () => {
  const { map } = useMap();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!map || !query.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    const searchAddress = async () => {
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            query
          )}.json?access_token=${
            mapboxgl.accessToken
          }&language=pt&country=br&limit=5`
        );

        const data = await response.json();
        setResults(data.features || []);
        setShowResults(true);
      } catch (error) {
        console.error("Geocoding error:", error);
        setResults([]);
      }
    };

    const timeoutId = setTimeout(searchAddress, 300);
    return () => clearTimeout(timeoutId);
  }, [query, map]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectResult = (result: any) => {
    if (!map) return;

    const [lng, lat] = result.center;
    map.flyTo({
      center: [lng, lat],
      zoom: 15,
      duration: 1000,
    });

    setQuery(result.place_name);
    setShowResults(false);
  };

  if (!map) return null;

  return (
    <div ref={searchRef} className={styles.searchContainer}>
      <input
        type="text"
        className={styles.searchInput}
        placeholder="Buscar endereço ou cidade..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query && setShowResults(true)}
      />
      {showResults && results.length > 0 && (
        <ul className={styles.resultsList}>
          {results.map((result) => (
            <li
              key={result.id}
              className={styles.resultItem}
              onClick={() => handleSelectResult(result)}
            >
              {result.place_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
