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
  /**
   * Current value of the address field
   */
  value: string;
  /**
   * Callback when address value changes
   */
  onChange: (value: string) => void;
  /**
   * Callback when a location is selected from search results
   */
  onSelect?: (result: ISuggestion) => void;
  /**
   * Filter search results to healthcare facilities only
   */
  healthcareOnly?: boolean;
  /**
   * Placeholder text
   */
  placeholder?: string;
  /**
   * Input field ID
   */
  id?: string;
  /**
   * Input field name
   */
  name?: string;
  /**
   * Whether the field is required
   */
  required?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Error message to display
   */
  error?: string;
  /**
   * Help text to display below input
   */
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

  const { currentPosition } = useGeolocation();

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (!query.trim() || query.length < 3) {
      setResults([]);
      setShowResults(false);
      setIsSearching(false);
      return;
    }

    abortControllerRef.current = new AbortController();

    debounceTimeoutRef.current = setTimeout(async () => {
      setIsSearching(true);

      try {
        let searchQuery = query.trim();
        if (healthcareOnly) {
          const healthcareKeywords = [
            "hospital",
            "clínica",
            "hemocentro",
            "centro de saúde",
            "laboratório",
            "farmácia",
            "posto de saúde",
          ];
          const hasHealthcareKeyword = healthcareKeywords.some((keyword) =>
            query.toLowerCase().includes(keyword)
          );
          if (!hasHealthcareKeyword) {
            searchQuery = `hospital ${searchQuery}`;
          }
        }

        const baseUrl = `https://api.mapbox.com/search/searchbox/v1/suggest`;

        const accessToken = mapboxgl.accessToken || "";

        if (!accessToken) {
          console.error("Mapbox access token is not configured");
          setIsSearching(false);
          return;
        }

        const params = new URLSearchParams({
          access_token: accessToken,
          session_token: process.env.NEXT_PUBLIC_MAPBOX_SESSION_TOKEN || "",
          language: "pt",
          country: "br",
          limit: "10",
          types: "poi,address",
          q: searchQuery,
          proximity: `${currentPosition?.longitude},${currentPosition?.latitude}`,
        });

        const currentAbortController = abortControllerRef.current;
        if (!currentAbortController) {
          return;
        }

        const response = await fetch(`${baseUrl}?${params.toString()}`, {
          signal: currentAbortController.signal,
        });

        if (!response.ok) {
          throw new Error(`Geocoding API error: ${response.status}`);
        }

        const data = (await response.json()) as IGeocodingResponse;

        if (!currentAbortController.signal.aborted) {
          setResults(data.suggestions?.slice(0, 5) || []);
          setShowResults(true);
        }
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }
        console.error("Geocoding error:", error);
        const currentAbortController = abortControllerRef.current;
        if (currentAbortController && !currentAbortController.signal.aborted) {
          setResults([]);
        }
      } finally {
        const currentAbortController = abortControllerRef.current;
        if (currentAbortController && !currentAbortController.signal.aborted) {
          setIsSearching(false);
        }
      }
    }, 500);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [query, healthcareOnly, currentPosition]);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setQuery(newValue);
    onChange(newValue);
  };

  const handleSelectResult = (result: ISuggestion) => {
    const address = result.full_address;

    setQuery(address);
    onChange(address);

    setShowResults(false);

    if (onSelect) {
      onSelect(result);
    }
  };

  const handleInputFocus = () => {
    if (query && results.length > 0) {
      setShowResults(true);
    }
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
              key={`${result.name}-${result.id}-${Math.random() * 1000}`}
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
