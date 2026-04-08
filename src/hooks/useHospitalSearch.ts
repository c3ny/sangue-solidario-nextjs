import { useEffect, useState } from "react";
import { Coordinates } from "./useGeolocation";
import { calculateDistance } from "@/utils/distance";
import { logger } from "@/utils/logger";

export interface BloodCenter {
  id: string;
  name: string;
  address: string;
  coordinates: [number, number]; // [lng, lat]
  distance: number; // metros
}

const MAX_RESULTS = 10;
const MAX_DISTANCE_M = 30000; // 30km
const MIN_PIN_DISTANCE_M = 200; // deduplicação por proximidade

// Categorias Mapbox relacionadas a banco de sangue
const BLOOD_CATEGORY_IDS = new Set(["blood_bank", "hemocentro"]);

// Palavras no nome que confirmam ser um local de doação
const BLOOD_NAME_REGEX =
  /\b(hemocentro|hemonucleo|hemo|banco de sangue|blood bank|hemocenter|hemominas|hemorrede|hemosc|hemonorte|hemorio|hemsul|hemoal|hemoba|hemopa|hemope|hemopi|hemoes|hematol|colsan|fundação|doação de sangue)\b/i;

const HOSPITAL_NAME_REGEX = /\bhospital\b/i;

// Palavras que excluem o local
const EXCLUDE_REGEX =
  /\b(clínica|clinica|laboratório|laboratorio|farmácia|farmacia|upa|posto de saúde|consultório|odonto|dental|veterinár)\b/i;

function isBloodDonationCenter(props: Record<string, unknown>): boolean {
  const name = String(props.name ?? "");
  const categoryIds = Array.isArray(props.poi_category_ids)
    ? (props.poi_category_ids as string[])
    : [];

  if (EXCLUDE_REGEX.test(name)) return false;
  if (categoryIds.some((id) => BLOOD_CATEGORY_IDS.has(id))) return true;
  if (BLOOD_NAME_REGEX.test(name)) return true;

  return false;
}

function isHospitalWithBloodBank(props: Record<string, unknown>): boolean {
  const name = String(props.name ?? "");
  if (EXCLUDE_REGEX.test(name)) return false;
  return HOSPITAL_NAME_REGEX.test(name);
}

function tooClose(a: BloodCenter, b: BloodCenter): boolean {
  const dist = calculateDistance(
    { latitude: a.coordinates[1], longitude: a.coordinates[0] },
    { latitude: b.coordinates[1], longitude: b.coordinates[0] }
  );
  return dist * 1000 < MIN_PIN_DISTANCE_M;
}

function parseFeatures(
  features: Record<string, unknown>[],
  userPosition: Coordinates,
  strictBloodOnly: boolean
): BloodCenter[] {
  const seenIds = new Set<string>();

  return features
    .map((feature): BloodCenter | null => {
      const props = feature.properties as Record<string, unknown> | undefined;
      const geometry = feature.geometry as
        | { type: string; coordinates: [number, number] }
        | undefined;

      if (!props || !geometry?.coordinates) return null;

      const valid = strictBloodOnly
        ? isBloodDonationCenter(props)
        : isHospitalWithBloodBank(props);

      if (!valid) return null;

      const id = String(props.mapbox_id ?? props.id ?? "");
      if (id && seenIds.has(id)) return null;
      if (id) seenIds.add(id);

      const [lng, lat] = geometry.coordinates;
      const distKm = calculateDistance(
        { latitude: userPosition.latitude, longitude: userPosition.longitude },
        { latitude: lat, longitude: lng }
      );
      const distM = Math.round(distKm * 1000);

      if (distM > MAX_DISTANCE_M) return null;

      return {
        id: id || `${lat}-${lng}`,
        name: String(props.name ?? ""),
        address: String(
          props.full_address ?? props.place_formatted ?? props.address ?? ""
        ),
        coordinates: [lng, lat],
        distance: distM,
      };
    })
    .filter((h): h is BloodCenter => h !== null);
}

function mergeAndDeduplicate(
  lists: BloodCenter[][]
): BloodCenter[] {
  const seenIds = new Set<string>();
  const merged: BloodCenter[] = [];

  for (const list of lists) {
    for (const item of list) {
      if (seenIds.has(item.id)) continue;
      seenIds.add(item.id);
      merged.push(item);
    }
  }

  // Ordena por distância
  merged.sort((a, b) => a.distance - b.distance);

  // Remove sobreposição por proximidade geográfica
  const result: BloodCenter[] = [];
  for (const candidate of merged) {
    if (!result.some((existing) => tooClose(existing, candidate))) {
      result.push(candidate);
    }
  }

  return result.slice(0, MAX_RESULTS);
}

async function fetchCategory(
  category: string,
  userPosition: Coordinates
): Promise<Record<string, unknown>[]> {
  const res = await fetch("/api/mapbox-mcp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      tool: "category_search_tool",
      input: {
        category,
        proximity: {
          longitude: userPosition.longitude,
          latitude: userPosition.latitude,
        },
        limit: 25,
        language: "pt",
        format: "json_string",
      },
    }),
  });
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data?.features) ? data.features : [];
}

async function fetchTextSearch(
  query: string,
  userPosition: Coordinates
): Promise<Record<string, unknown>[]> {
  const res = await fetch("/api/mapbox-mcp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      tool: "search_and_geocode_tool",
      input: {
        q: query,
        proximity: {
          longitude: userPosition.longitude,
          latitude: userPosition.latitude,
        },
        types: ["poi"],
        language: "pt",
        poi_category: ["blood_bank"],
      },
    }),
  });
  if (!res.ok) return [];
  const data = await res.json();
  // search_and_geocode_tool pode retornar texto não-JSON — o proxy já trata retornando { features: [] }
  return Array.isArray(data?.features) ? data.features : [];
}

export function useBloodCenterSearch(userPosition: Coordinates | null) {
  const [bloodCenters, setBloodCenters] = useState<BloodCenter[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userPosition) return;

    let cancelled = false;

    async function search() {
      setLoading(true);
      setError(null);

      try {
        // Busca paralela: banco de sangue (categoria), hemonucleo (texto) e hospital (categoria)
        const [bloodBankFeatures, hemocentroFeatures, hospitalFeatures] =
          await Promise.all([
            fetchCategory("blood_bank", userPosition!),
            fetchTextSearch("hemonucleo banco de sangue colsan", userPosition!),
            fetchCategory("hospital", userPosition!),
          ]);

        if (cancelled) return;

        const bloodCenterResults = parseFeatures(
          [...bloodBankFeatures, ...hemocentroFeatures],
          userPosition!,
          true // strict: só hemocentros e bancos de sangue
        );

        const hospitalResults = parseFeatures(
          hospitalFeatures,
          userPosition!,
          false // aceita hospitais (geralmente têm banco de sangue)
        );

        setBloodCenters(mergeAndDeduplicate([bloodCenterResults, hospitalResults]));
      } catch (err) {
        if (!cancelled) {
          logger.error("Blood center search error:", err);
          setError("Não foi possível buscar locais de doação próximos.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    search();

    return () => { cancelled = true; };
  }, [userPosition?.latitude, userPosition?.longitude]);

  return { bloodCenters, loading, error };
}
