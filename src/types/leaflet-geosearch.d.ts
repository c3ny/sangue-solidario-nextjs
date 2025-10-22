/**
 * Type declarations for leaflet-geosearch
 * https://github.com/smeijer/leaflet-geosearch
 */

declare module "leaflet-geosearch" {
  import { Control } from "leaflet";

  export interface SearchResult {
    x: number;
    y: number;
    label: string;
    bounds: [[number, number], [number, number]];
    raw: any;
  }

  export interface ProviderOptions {
    params?: Record<string, any>;
  }

  export interface SearchControlOptions {
    provider: any;
    style?: "bar" | "button";
    showMarker?: boolean;
    showPopup?: boolean;
    popupFormat?: (result: SearchResult) => string;
    maxMarkers?: number;
    retainZoomLevel?: boolean;
    animateZoom?: boolean;
    autoClose?: boolean;
    searchLabel?: string;
    keepResult?: boolean;
    updateMap?: boolean;
    marker?: any;
    maxSuggestions?: number;
    notFoundMessage?: string;
  }

  export class OpenStreetMapProvider {
    constructor(options?: ProviderOptions);
    search(options: { query: string }): Promise<SearchResult[]>;
  }

  export class EsriProvider {
    constructor(options?: ProviderOptions);
    search(options: { query: string }): Promise<SearchResult[]>;
  }

  export class GoogleProvider {
    constructor(options?: ProviderOptions & { apiKey: string });
    search(options: { query: string }): Promise<SearchResult[]>;
  }

  export class BingProvider {
    constructor(options?: ProviderOptions & { apiKey: string });
    search(options: { query: string }): Promise<SearchResult[]>;
  }

  export function GeoSearchControl(options: SearchControlOptions): Control;
}
