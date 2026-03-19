"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { BsSearch, BsGeoAltFill } from "react-icons/bs";
import styles from "./styles.module.scss";
import { useGeolocation } from "@/hooks/useGeolocation";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

export interface ISuggestion {
  id: string;
  name: string;
  address: string;
  full_address: string;
  latitude: number;
  longitude: number;
  poi_category?: string[];
  feature_type?: string;
}

export interface IGeocodingResponse {
  suggestions: ISuggestion[];
  [key: string]: unknown;
}

export interface IAddressSearchProps {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (result: ISuggestion) => void;
  healthcareOnly?: boolean;
  placeholder?: string;
  id?: string;
  name?: string;
  required?: boolean;
  className?: string;
  error?: string;
  helpText?: string;
}

export const AddressSearch = ({
  value,
  onChange,
  onSelect,
  healthcareOnly = true,
  placeholder = "Buscar hospital, clínica ou hemocentro...",
  id,
  name,
  required = false,
  className = "",
  error,
  helpText,
}: IAddressSearchProps) => {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<ISuggestion[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const nearbyLoadedRef = useRef(false);

  const { currentPosition } = useGeolocation();

  useEffect(() => {
    setQuery(value);
  }, [value]);

  const deduplicateResults = (results: ISuggestion[]) => {
    return results.filter(
      (result, index, self) =>
        index === self.findIndex((t) => t.full_address === result.full_address)
    );
  };

  const fetchSuggestions = async (
    searchQuery: string,
    signal: AbortSignal
  ): Promise<ISuggestion[]> => {
    const accessToken = mapboxgl.accessToken || "";
    if (!accessToken) {
      console.error("Mapbox access token is not configured");
      return [];
    }

    const baseUrl = `https://api.mapbox.com/search/searchbox/v1/suggest`;
    const params = new URLSearchParams({
      access_token: accessToken,
      session_token: process.env.NEXT_PUBLIC_MAPBOX_SESSION_TOKEN || "",
      language: "pt",
      country: "br",
      limit: "10",
      types: "poi,address",
      q: searchQuery,
    });

    // só adiciona proximity se a posição estiver disponível
    if (currentPosition?.latitude && currentPosition?.longitude) {
      params.append(
        "proximity",
        `${currentPosition.longitude},${currentPosition.latitude}`
      );
    }

    const response = await fetch(`${baseUrl}?${params.toString()}`, { signal });

    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status}`);
    }

    const data = (await response.json()) as IGeocodingResponse;
    return deduplicateResults(data.suggestions?.slice(0, 5) || []);
  };

  // Busca automática de hospitais próximos quando a geolocalização fica disponível
  useEffect(() => {
    if (!currentPosition || nearbyLoadedRef.current || query.trim()) return;

    nearbyLoadedRef.current = true;

    const controller = new AbortController();

    (async () => {
      setIsSearching(true);
      try {
        const suggestions = await fetchSuggestions(
          "hospital hemocentro clínica",
          controller.signal
        );
        if (!controller.signal.aborted) {
          setResults(suggestions);
          setShowResults(suggestions.length > 0);
        }
      } catch (e) {
        if (e instanceof Error && e.name !== "AbortError") {
          console.error("Nearby search error:", e);
        }
      } finally {
        if (!controller.signal.aborted) setIsSearching(false);
      }
    })();

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPosition]);

  // Busca por digitação
  useEffect(() => {
    if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    if (abortControllerRef.current) abortControllerRef.current.abort();

    if (!query.trim() || query.length < 3) {
      // se limpou o campo, mostra os resultados próximos novamente se existirem
      if (!query.trim() && results.length > 0) {
        setShowResults(true);
      } else {
        setShowResults(false);
      }
      setIsSearching(false);
      return;
    }

    abortControllerRef.current = new AbortController();
    const controller = abortControllerRef.current;

    debounceTimeoutRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        let searchQuery = query.trim();
        if (healthcareOnly) {
          const healthcareKeywords = [
            "hospital", "clínica", "hemocentro", "centro de saúde",
            "laboratório", "farmácia", "posto de saúde",
          ];
          const hasKeyword = healthcareKeywords.some((k) =>
            query.toLowerCase().includes(k)
          );
          if (!hasKeyword) searchQuery = `hospital ${searchQuery}`;
        }

        const suggestions = await fetchSuggestions(searchQuery, controller.signal);

        if (!controller.signal.aborted) {
          setResults(suggestions);
          setShowResults(true);
        }
      } catch (e) {
        if (e instanceof Error && e.name === "AbortError") return;
        console.error("Geocoding error:", e);
        if (!controller.signal.aborted) setResults([]);
      } finally {
        if (!controller.signal.aborted) setIsSearching(false);
      }
    }, 500);

    return () => {
      if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, healthcareOnly, currentPosition]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setQuery(newValue);
    onChange(newValue);
  };

  const handleSelectResult = (result: ISuggestion) => {
    setQuery(result.full_address);
    onChange(result.full_address);
    setShowResults(false);
    if (onSelect) onSelect(result);
  };

  const handleInputFocus = () => {
    if (results.length > 0) setShowResults(true);
  };

  return (
    <div
      ref={searchRef}
      className={`${styles.addressSearchContainer} ${className}`}
    >
      <div className={styles.inputWrapper}>
        <BsSearch className={styles.searchIcon} />
        <input
          ref={inputRef}
          type="text"
          id={id}
          name={name}
          className={`${styles.input} ${error ? styles.inputError : ""}`}
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          required={required}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={
            error ? `${id}-error` : helpText ? `${id}-help` : undefined
          }
          autoComplete="off"
        />
        {isSearching && (
          <div className={styles.loadingSpinner} aria-label="Buscando...">
            <div className={styles.spinner}></div>
          </div>
        )}
      </div>

      {showResults && results.length > 0 && (
        <ul className={styles.resultsList} role="listbox">
          {results.map((result) => (
            <li
              key={`${result.name}-${result.id}`}
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
              <BsGeoAltFill className={styles.resultIcon} />
              <div className={styles.resultTextContainer}>
                <span className={styles.resultTextTitle}>{result.name}</span>
                <span className={styles.resultTextAddress}>
                  {result.full_address}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}

      {showResults && query && results.length === 0 && !isSearching && (
        <div className={styles.noResults}>
          {healthcareOnly
            ? "Nenhum hospital ou clínica encontrado"
            : "Nenhum resultado encontrado"}
        </div>
      )}

      {error && (
        <span id={`${id}-error`} className={styles.error} role="alert">
          {error}
        </span>
      )}

      {helpText && !error && (
        <span id={`${id}-help`} className={styles.helpText}>
          {helpText}
        </span>
      )}
    </div>
  );
};