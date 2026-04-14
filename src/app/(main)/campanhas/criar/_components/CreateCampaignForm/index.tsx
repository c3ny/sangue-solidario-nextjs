"use client";

import {
  useState,
  useEffect,
  useRef,
  ChangeEvent,
  FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { BsImage, BsCalendar3, BsDroplet, BsTrophy } from "react-icons/bs";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { AddressSearch, ISuggestion } from "@/components/AddressSearch";
import {
  createCampaignAction,
  uploadCampaignBannerAction,
  ICreateCampaignInput,
} from "@/actions/campaign/campaign-actions";
import { geocodeAddress } from "@/utils/geocode";
import { lookupCep } from "@/utils/cep";
import { maskCEP } from "@/utils/masks";
import { scrollToFirstError } from "@/utils/form";
import { logger } from "@/utils/logger";
import styles from "./styles.module.scss";

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // strip "data:<mime>;base64," prefix
      const comma = result.indexOf(",");
      resolve(comma >= 0 ? result.slice(comma + 1) : result);
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

interface CreateCampaignFormProps {
  organizerId: string;
  organizerName: string;
  organizerUsername?: string;
}

interface FormState {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  bloodType: string;
  targetDonations: string;
  locationName: string;
  locationAddress: string;
  locationNeighborhood: string;
  locationQuery: string;
  locationCity: string;
  locationUf: string;
  locationZipcode: string;
}

type FormErrors = Partial<Record<keyof FormState | "banner", string>>;

const INITIAL_STATE: FormState = {
  title: "",
  description: "",
  startDate: "",
  endDate: "",
  bloodType: "",
  targetDonations: "",
  locationName: "",
  locationAddress: "",
  locationNeighborhood: "",
  locationQuery: "",
  locationCity: "",
  locationUf: "",
  locationZipcode: "",
};

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const MAX_BANNER_SIZE = 3.5 * 1024 * 1024; // 3.5 MB

function extractCityUfFromSuggestion(suggestion: ISuggestion): { city: string; uf: string } {
  const parts = suggestion.full_address.split(",").map((p) => p.trim());
  // full_address typically: "Name, Street, City, UF, CEP, Country"
  // Search for a 2-letter UF near the end.
  const ufIndex = parts.findIndex((p) => /^[A-Z]{2}$/.test(p));
  const uf = ufIndex >= 0 ? parts[ufIndex] : "";
  const city = ufIndex > 0 ? parts[ufIndex - 1] : "";
  return { city, uf };
}

export function CreateCampaignForm({
  organizerId,
  organizerName,
  organizerUsername,
}: CreateCampaignFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [locationData, setLocationData] = useState<ISuggestion | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState("");
  const [showAddressFallback, setShowAddressFallback] = useState(false);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (bannerPreview && bannerPreview.startsWith("blob:")) {
        URL.revokeObjectURL(bannerPreview);
      }
    };
  }, [bannerPreview]);

  const handleChange = (field: keyof FormState) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const handleLocationSelect = async (suggestion: ISuggestion) => {
    setLocationData(suggestion);
    const { city: parsedCity, uf: parsedUf } = extractCityUfFromSuggestion(suggestion);

    setForm((prev) => ({
      ...prev,
      locationQuery: suggestion.full_address,
      locationName: prev.locationName || suggestion.name,
      locationAddress: prev.locationAddress || suggestion.address,
      locationCity: prev.locationCity || parsedCity,
      locationUf: prev.locationUf || parsedUf,
    }));
    if (errors.locationAddress) setErrors((prev) => ({ ...prev, locationAddress: undefined }));

    // Enrich with structured context from Mapbox (city/UF/zipcode/neighborhood)
    const enriched = await geocodeAddress(suggestion.full_address);
    if (!enriched) return;

    setLocationData({
      ...suggestion,
      latitude: enriched.latitude,
      longitude: enriched.longitude,
    });
    setForm((prev) => ({
      ...prev,
      locationCity: prev.locationCity || enriched.city || "",
      locationUf: prev.locationUf || enriched.uf || "",
      locationZipcode: prev.locationZipcode || enriched.zipcode || "",
      locationNeighborhood: prev.locationNeighborhood || enriched.neighborhood || "",
      locationAddress: prev.locationAddress || enriched.address || "",
    }));
    setErrors((prev) => ({
      ...prev,
      locationCity: undefined,
      locationUf: undefined,
      locationAddress: undefined,
    }));
  };

  const handleCepChange = (e: ChangeEvent<HTMLInputElement>) => {
    const masked = maskCEP(e.target.value);
    setForm((prev) => ({ ...prev, locationZipcode: masked }));
    setCepError("");
    if (errors.locationZipcode) setErrors((prev) => ({ ...prev, locationZipcode: undefined }));
  };

  const handleCepBlur = async () => {
    const digits = form.locationZipcode.replace(/\D/g, "");
    if (digits.length !== 8) return;

    setCepLoading(true);
    setCepError("");
    try {
      const result = await lookupCep(digits);
      if (!result) {
        setCepError("CEP não encontrado.");
        return;
      }
      // Reset locationData since manual fields take precedence now
      setLocationData(null);
      setForm((prev) => ({
        ...prev,
        locationZipcode: result.zipcode || prev.locationZipcode,
        locationAddress: result.address || prev.locationAddress,
        locationNeighborhood: result.neighborhood || prev.locationNeighborhood,
        locationCity: result.city || prev.locationCity,
        locationUf: result.uf || prev.locationUf,
      }));
      setErrors((prev) => ({
        ...prev,
        locationAddress: undefined,
        locationCity: undefined,
        locationUf: undefined,
      }));
    } catch (err) {
      logger.error("CEP lookup error:", err);
      setCepError("Falha ao consultar CEP.");
    } finally {
      setCepLoading(false);
    }
  };

  const handleLocationQueryChange = (value: string) => {
    setForm((prev) => ({ ...prev, locationQuery: value }));
    // If user clears the search, require re-selection for lat/lng integrity.
    if (!value) setLocationData(null);
  };

  const handleBannerChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, banner: "Arquivo precisa ser uma imagem." }));
      return;
    }
    if (file.size > MAX_BANNER_SIZE) {
      setErrors((prev) => ({ ...prev, banner: "Imagem deve ter no máximo 3.5MB." }));
      return;
    }

    if (bannerPreview && bannerPreview.startsWith("blob:")) {
      URL.revokeObjectURL(bannerPreview);
    }
    setBannerFile(file);
    setBannerPreview(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, banner: undefined }));
  };

  const removeBanner = () => {
    if (bannerPreview && bannerPreview.startsWith("blob:")) {
      URL.revokeObjectURL(bannerPreview);
    }
    setBannerFile(null);
    setBannerPreview(null);
    if (bannerInputRef.current) bannerInputRef.current.value = "";
  };

  const FIELD_ORDER = [
    "title",
    "description",
    "startDate",
    "endDate",
    "targetDonations",
    "locationZipcode",
    "locationName",
    "locationAddress",
    "locationCity",
    "locationUf",
  ];

  const computeErrors = (): FormErrors => {
    const next: FormErrors = {};
    if (form.title.trim().length < 3) next.title = "Título deve ter ao menos 3 caracteres.";
    if (form.description.trim().length < 10) next.description = "Descrição deve ter ao menos 10 caracteres.";
    if (!form.startDate) next.startDate = "Data de início obrigatória.";
    if (!form.endDate) next.endDate = "Data de término obrigatória.";
    if (form.startDate && form.endDate && form.endDate < form.startDate) {
      next.endDate = "Término deve ser igual ou posterior ao início.";
    }
    if (!form.locationName.trim()) next.locationName = "Nome do local obrigatório.";
    if (!form.locationAddress.trim()) next.locationAddress = "Endereço (rua/avenida) obrigatório.";
    if (!form.locationCity.trim()) next.locationCity = "Cidade obrigatória.";
    if (!form.locationUf.trim() || form.locationUf.trim().length !== 2) {
      next.locationUf = "UF deve ter 2 letras (ex: SP).";
    }
    if (form.targetDonations && Number.isNaN(Number(form.targetDonations))) {
      next.targetDonations = "Deve ser um número.";
    }
    return next;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError("");

    const nextErrors = computeErrors();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      scrollToFirstError(nextErrors, FIELD_ORDER);
      return;
    }

    setIsSubmitting(true);
    try {
      let latitude: number | undefined = locationData?.latitude;
      let longitude: number | undefined = locationData?.longitude;

      if (typeof latitude !== "number" || typeof longitude !== "number") {
        const fullAddress = [
          form.locationAddress.trim(),
          form.locationNeighborhood.trim(),
          `${form.locationCity.trim()} - ${form.locationUf.trim().toUpperCase()}`,
          form.locationZipcode.trim(),
        ]
          .filter(Boolean)
          .join(", ");

        const geo = await geocodeAddress(fullAddress);
        if (!geo) {
          setSubmitError("Não foi possível obter coordenadas para o endereço. Verifique os campos.");
          return;
        }
        latitude = geo.latitude;
        longitude = geo.longitude;
      }

      let bannerImageUrl: string | undefined;
      if (bannerFile) {
        const base64 = await fileToBase64(bannerFile);
        const uploaded = await uploadCampaignBannerAction(
          base64,
          bannerFile.name,
          bannerFile.type
        );
        bannerImageUrl = uploaded.url;
      }

      const payload: ICreateCampaignInput = {
        title: form.title.trim(),
        description: form.description.trim(),
        bannerImage: bannerImageUrl,
        startDate: form.startDate,
        endDate: form.endDate,
        bloodType: form.bloodType || undefined,
        targetDonations: form.targetDonations ? Number(form.targetDonations) : undefined,
        organizerId,
        organizerName,
        organizerUsername,
        location: {
          name: form.locationName.trim(),
          address: form.locationAddress.trim(),
          city: form.locationCity.trim(),
          uf: form.locationUf.trim().toUpperCase(),
          zipcode: form.locationZipcode.trim() || undefined,
          latitude: latitude!,
          longitude: longitude!,
        },
      };

      const created = await createCampaignAction(payload);

      window.location.href = `/campanha/${created.id}`;
    } catch (err) {
      logger.error("Erro ao criar campanha:", err);
      const msg = err instanceof Error ? err.message : "Erro inesperado.";
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <header className={styles.header}>
          <h1 className={styles.title}>Criar Campanha</h1>
          <p className={styles.subtitle}>
            Preencha as informações para organizar uma nova campanha de doação.
          </p>
        </header>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {/* Informações gerais */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Informações gerais</h2>

            <Input
              label="Título da campanha"
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange("title")}
              error={errors.title}
              showRequired
              required
            />

            <div className={styles.formGroup}>
              <label htmlFor="description" className={styles.label}>
                Descrição <span className={styles.required}>*</span>
              </label>
              <textarea
                id="description"
                name="description"
                className={`${styles.textarea} ${errors.description ? styles.inputError : ""}`}
                value={form.description}
                onChange={handleChange("description")}
                rows={4}
                required
              />
              {errors.description && (
                <span className={styles.errorMessage}>{errors.description}</span>
              )}
            </div>

            <div className={styles.formGrid}>
              <Input
                label="Data de início"
                type="date"
                id="startDate"
                name="startDate"
                icon={BsCalendar3}
                value={form.startDate}
                onChange={handleChange("startDate")}
                error={errors.startDate}
                showRequired
                required
              />
              <Input
                label="Data de término"
                type="date"
                id="endDate"
                name="endDate"
                icon={BsCalendar3}
                value={form.endDate}
                onChange={handleChange("endDate")}
                error={errors.endDate}
                showRequired
                required
              />
            </div>

            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="bloodType" className={styles.label}>
                  Tipo sanguíneo (opcional)
                </label>
                <div className={styles.selectWrapper}>
                  <BsDroplet className={styles.selectIcon} />
                  <select
                    id="bloodType"
                    name="bloodType"
                    className={styles.select}
                    value={form.bloodType}
                    onChange={handleChange("bloodType")}
                  >
                    <option value="">Todos os tipos</option>
                    {BLOOD_TYPES.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <Input
                label="Meta de doações (opcional)"
                type="number"
                id="targetDonations"
                name="targetDonations"
                icon={BsTrophy}
                min="1"
                value={form.targetDonations}
                onChange={handleChange("targetDonations")}
                error={errors.targetDonations}
              />
            </div>
          </section>

          {/* Banner */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Imagem da campanha (opcional)</h2>

            {bannerPreview ? (
              <div className={styles.bannerPreview}>
                <Image
                  src={bannerPreview}
                  alt="Prévia da imagem"
                  fill
                  sizes="(max-width: 768px) 100vw, 640px"
                  className={styles.bannerImage}
                  unoptimized
                />
                <button
                  type="button"
                  onClick={removeBanner}
                  className={styles.removeBannerButton}
                >
                  Remover
                </button>
              </div>
            ) : (
              <label htmlFor="banner" className={styles.bannerUpload}>
                <BsImage className={styles.bannerIcon} />
                <span>Clique para selecionar uma imagem</span>
                <small>JPG ou PNG, até 3.5MB</small>
              </label>
            )}
            <input
              ref={bannerInputRef}
              type="file"
              id="banner"
              name="banner"
              accept="image/*"
              onChange={handleBannerChange}
              className={styles.hiddenFileInput}
            />
            {errors.banner && (
              <span className={styles.errorMessage}>{errors.banner}</span>
            )}
          </section>

          {/* Localização */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Localização</h2>

            <Input
              label="CEP"
              id="locationZipcode"
              name="locationZipcode"
              placeholder="00000-000"
              maxLength={9}
              value={form.locationZipcode}
              onChange={handleCepChange}
              onBlur={handleCepBlur}
              error={errors.locationZipcode || cepError}
            />
            {cepLoading && (
              <span className={styles.cepLoading}>Consultando CEP...</span>
            )}

            <Input
              label="Nome do local"
              id="locationName"
              name="locationName"
              placeholder="Ex: Praça Central, Hemocentro Regional"
              value={form.locationName}
              onChange={handleChange("locationName")}
              error={errors.locationName}
              showRequired
              required
            />

            <Input
              label="Endereço (rua, número)"
              id="locationAddress"
              name="locationAddress"
              placeholder="Av. Paulista, 1578"
              value={form.locationAddress}
              onChange={handleChange("locationAddress")}
              error={errors.locationAddress}
              showRequired
              required
            />

            <Input
              label="Bairro (opcional)"
              id="locationNeighborhood"
              name="locationNeighborhood"
              value={form.locationNeighborhood}
              onChange={handleChange("locationNeighborhood")}
            />

            <div className={styles.formGrid}>
              <Input
                label="Cidade"
                id="locationCity"
                name="locationCity"
                value={form.locationCity}
                onChange={handleChange("locationCity")}
                error={errors.locationCity}
                showRequired
                required
              />
              <Input
                label="UF"
                id="locationUf"
                name="locationUf"
                maxLength={2}
                value={form.locationUf}
                onChange={handleChange("locationUf")}
                error={errors.locationUf}
                showRequired
                required
              />
            </div>

            <div className={styles.fallbackToggle}>
              <button
                type="button"
                className={styles.fallbackButton}
                onClick={() => setShowAddressFallback((v) => !v)}
              >
                {showAddressFallback ? "Ocultar" : "Não sei o CEP — buscar por endereço"}
              </button>
            </div>

            {showAddressFallback && (
              <div className={styles.formGroup}>
                <label htmlFor="locationQuery" className={styles.label}>
                  Buscar endereço (Mapbox)
                </label>
                <AddressSearch
                  value={form.locationQuery}
                  onChange={handleLocationQueryChange}
                  onSelect={handleLocationSelect}
                  healthcareOnly={false}
                  placeholder="Digite o endereço ou nome do local..."
                  id="locationQuery"
                  name="locationQuery"
                  helpText="Selecione uma sugestão para preencher os campos automaticamente."
                />
              </div>
            )}
          </section>

          {submitError && (
            <div className={styles.submitError} role="alert">
              {submitError}
            </div>
          )}

          <div className={styles.actions}>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/hemocentros")}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              Criar campanha
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
