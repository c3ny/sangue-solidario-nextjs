"use client";

import { useEffect, useRef, useState } from "react";
import { useMap } from "@/contexts/Map/MapContext";
import mapboxgl from "mapbox-gl";
import styles from "./geosearch.module.scss";

interface IGeocodingFeature {
  id: string;
  type: string;
  place_name: string;
  center: [number, number];
  geometry: {
    type: string;
    coordinates: [number, number];
  };
  properties: {
    [key: string]: unknown;
    category?: string;
    maki?: string;
  };
  text?: string;
  place_type?: string[];
}

interface IGeocodingResponse {
  features: IGeocodingFeature[];
  [key: string]: unknown;
}

export interface ISearchControlProps {
  /**
   * Filter search results to healthcare facilities only
   * When true, searches for hospitals, clinics, blood centers, etc.
   */
  healthcareOnly?: boolean;
  /**
   * Placeholder text for the search input
   */
  placeholder?: string;
  /**
   * Callback when a location is selected
   */
  onSelect?: (result: IGeocodingFeature) => void;
  /**
   * Whether to fly to the selected location on the map
   */
  flyToLocation?: boolean;
}

export const SearchControl = ({
  healthcareOnly = false,
  placeholder = "Buscar endereço ou cidade...",
  onSelect,
  flyToLocation = true,
}: ISearchControlProps = {}) => {
  const { map } = useMap();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<IGeocodingFeature[]>([]);
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
        // Build search query with healthcare keywords if needed
        let searchQuery = query;
        if (healthcareOnly) {
          // Add healthcare-related keywords to improve results
          const healthcareKeywords = [
            "hospital",
            "clínica",
            "hemocentro",
            "centro de saúde",
            "laboratório",
            "farmácia",
            "posto de saúde",
          ];
          // Check if query already contains healthcare keywords
          const hasHealthcareKeyword = healthcareKeywords.some((keyword) =>
            query.toLowerCase().includes(keyword)
          );
          if (!hasHealthcareKeyword) {
            // Prepend healthcare context to improve results
            searchQuery = `hospital ${query}`;
          }
        }

        // Build API URL with appropriate filters
        const baseUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          searchQuery
        )}.json`;

        const accessToken = mapboxgl.accessToken || "";

        if (!accessToken) {
          console.error("Mapbox access token is not configured");
          return;
        }

        const params = new URLSearchParams({
          access_token: accessToken,
          language: "pt",
          country: "br",
          limit: "10", // Get more results to filter
        });

        // Add type filter for healthcare facilities
        if (healthcareOnly) {
          // Use POI (Point of Interest) type and filter by category
          params.append("types", "poi");
        }

        const response = await fetch(`${baseUrl}?${params.toString()}`);

        if (!response.ok) {
          throw new Error(`Geocoding API error: ${response.status}`);
        }

        const data = (await response.json()) as IGeocodingResponse;

        // Limit to top 5 results
        setResults(data.features.slice(0, 5));
        setShowResults(true);
      } catch (error) {
        console.error("Geocoding error:", error);
        setResults([]);
      }
    };

    const timeoutId = setTimeout(searchAddress, 300);
    return () => clearTimeout(timeoutId);
  }, [query, map, healthcareOnly]);

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

  const handleSelectResult = (result: IGeocodingFeature) => {
    if (!map) return;

    const [lng, lat] = result.center;

    // Fly to location if enabled
    if (flyToLocation) {
      map.flyTo({
        center: [lng, lat],
        zoom: 12,
        duration: 1000,
      });
    }

    setQuery(result.place_name);
    setShowResults(false);

    // Call custom onSelect callback if provided
    if (onSelect) {
      onSelect(result);
    }
  };

  if (!map) return null;

  return (
    <div ref={searchRef} className={styles.searchContainer}>
      <input
        type="text"
        className={styles.searchInput}
        placeholder={
          healthcareOnly
            ? "Buscar hospital, clínica ou hemocentro..."
            : placeholder
        }
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query && setShowResults(true)}
        aria-label={
          healthcareOnly
            ? "Buscar hospital, clínica ou hemocentro"
            : "Buscar endereço ou cidade"
        }
      />
      {showResults && results.length > 0 && (
        <ul className={styles.resultsList} role="listbox">
          {results.map((result) => (
            <li
              key={result.id}
              className={styles.resultItem}
              onClick={() => handleSelectResult(result)}
              role="option"
              aria-selected="false"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleSelectResult(result);
                }
              }}
            >
              {result.place_name}
            </li>
          ))}
        </ul>
      )}
      {showResults && query && results.length === 0 && (
        <div className={styles.noResults}>
          {healthcareOnly
            ? "Nenhum hospital ou clínica encontrado"
            : "Nenhum resultado encontrado"}
        </div>
      )}
    </div>
  );
};
