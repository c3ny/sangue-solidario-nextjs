"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { maskPhone, unmaskPhone, maskCEP, unmaskCEP } from "@/utils/masks";
import { updateProfile, IUpdateProfileData } from "./actions";
import styles from "./EditProfileModal.module.scss";

interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
  initialValues: {
    name: string;
    phone: string;
    city: string;
    uf: string;
    zipcode: string;
    description: string;
    gender?: "MALE" | "FEMALE" | null;
    lastDonationDate?: string | null;
  };
  /** true quando o usuario autenticado e DONOR (mostra campos gender/lastDonation). */
  showDonorFields?: boolean;
}

const MONTH_OPTIONS = [
  { value: "1", label: "Janeiro" },
  { value: "2", label: "Fevereiro" },
  { value: "3", label: "Março" },
  { value: "4", label: "Abril" },
  { value: "5", label: "Maio" },
  { value: "6", label: "Junho" },
  { value: "7", label: "Julho" },
  { value: "8", label: "Agosto" },
  { value: "9", label: "Setembro" },
  { value: "10", label: "Outubro" },
  { value: "11", label: "Novembro" },
  { value: "12", label: "Dezembro" },
];

function buildYearOptions(): { value: string; label: string }[] {
  const now = new Date().getFullYear();
  const years: { value: string; label: string }[] = [];
  for (let y = now; y >= now - 50; y--) {
    years.push({ value: String(y), label: String(y) });
  }
  return years;
}

function parseMonthYear(iso: string | null | undefined): {
  month: string;
  year: string;
} {
  if (!iso) return { month: "", year: "" };
  const m = iso.match(/^(\d{4})-(\d{2})-\d{2}$/);
  if (!m) return { month: "", year: "" };
  return { month: String(Number(m[2])), year: m[1] };
}

const UF_OPTIONS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
  "RS", "RO", "RR", "SC", "SP", "SE", "TO",
];

const PHONE_REGEX = /^\(\d{2}\) \d{4,5}-\d{4}$/;
const CEP_REGEX = /^\d{5}-\d{3}$/;
const MAX_DESCRIPTION = 2000;

export function EditProfileModal({
  open,
  onClose,
  initialValues,
  showDonorFields = false,
}: EditProfileModalProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string>("");

  const [name, setName] = useState(initialValues.name);
  const [phone, setPhone] = useState(maskPhone(initialValues.phone || ""));
  const [city, setCity] = useState(initialValues.city);
  const [uf, setUf] = useState(initialValues.uf);
  const [zipcode, setZipcode] = useState(maskCEP(initialValues.zipcode || ""));
  const [description, setDescription] = useState(initialValues.description);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Donor-only fields
  const initialMonthYear = parseMonthYear(initialValues.lastDonationDate);
  const [gender, setGender] = useState<"MALE" | "FEMALE" | "">(
    initialValues.gender ?? ""
  );
  const [lastDonationMonth, setLastDonationMonth] = useState(
    initialMonthYear.month
  );
  const [lastDonationYear, setLastDonationYear] = useState(
    initialMonthYear.year
  );
  const [neverDonated, setNeverDonated] = useState(
    showDonorFields && initialValues.lastDonationDate === null
  );
  const yearOptions = buildYearOptions();

  if (!open) return null;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim() || name.trim().length < 3) {
      newErrors.name = "Nome deve ter pelo menos 3 caracteres";
    }
    if (phone && !PHONE_REGEX.test(phone)) {
      newErrors.phone = "Formato (XX) XXXXX-XXXX";
    }
    if (zipcode && !CEP_REGEX.test(zipcode)) {
      newErrors.zipcode = "CEP inválido";
    }
    if (uf && !UF_OPTIONS.includes(uf)) {
      newErrors.uf = "UF inválida";
    }
    if (description.length > MAX_DESCRIPTION) {
      newErrors.description = `Máximo ${MAX_DESCRIPTION} caracteres`;
    }
    if (showDonorFields) {
      if (!gender) {
        newErrors.gender = "Selecione o sexo biológico";
      }
      if (!neverDonated && (lastDonationMonth === "" || lastDonationYear === "")) {
        newErrors.lastDonationDate =
          "Informe mês e ano ou marque \"Nunca doei\"";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    const payload: IUpdateProfileData = {
      name: name.trim(),
      phone: phone ? unmaskPhone(phone) : undefined,
      city: city.trim() || undefined,
      uf: uf || undefined,
      zipcode: zipcode ? unmaskCEP(zipcode) : undefined,
      description: description.trim(),
    };

    if (showDonorFields) {
      if (gender) payload.gender = gender;
      if (neverDonated) {
        payload.lastDonationDate = null;
      } else if (lastDonationMonth && lastDonationYear) {
        const m = String(Number(lastDonationMonth)).padStart(2, "0");
        payload.lastDonationDate = `${lastDonationYear}-${m}-01`;
      }
    }

    startTransition(async () => {
      const result = await updateProfile(payload);
      if (result.success) {
        onClose();
        router.refresh();
      } else {
        setServerError(result.message);
      }
    });
  };

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-profile-title"
      onClick={onClose}
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <h2 id="edit-profile-title">Editar perfil</h2>
          <button
            type="button"
            onClick={onClose}
            className={styles.closeBtn}
            aria-label="Fechar"
          >
            ×
          </button>
        </header>

        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.field}>
            <span>Nome completo</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={120}
            />
            {errors.name && <em className={styles.error}>{errors.name}</em>}
          </label>

          <label className={styles.field}>
            <span>Telefone</span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(maskPhone(e.target.value))}
              placeholder="(00) 00000-0000"
              maxLength={15}
            />
            {errors.phone && <em className={styles.error}>{errors.phone}</em>}
          </label>

          <div className={styles.row}>
            <label className={styles.field}>
              <span>Cidade</span>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                maxLength={120}
              />
              {errors.city && <em className={styles.error}>{errors.city}</em>}
            </label>
            <label className={styles.field}>
              <span>UF</span>
              <select
                value={uf}
                onChange={(e) => setUf(e.target.value.toUpperCase())}
              >
                <option value="">--</option>
                {UF_OPTIONS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
              {errors.uf && <em className={styles.error}>{errors.uf}</em>}
            </label>
            <label className={styles.field}>
              <span>CEP</span>
              <input
                type="text"
                value={zipcode}
                onChange={(e) => setZipcode(maskCEP(e.target.value))}
                placeholder="00000-000"
                maxLength={9}
              />
              {errors.zipcode && (
                <em className={styles.error}>{errors.zipcode}</em>
              )}
            </label>
          </div>

          <label className={styles.field}>
            <span>
              Descrição / História{" "}
              <small>
                ({description.length}/{MAX_DESCRIPTION})
              </small>
            </span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              maxLength={MAX_DESCRIPTION}
              placeholder="Conte sua história como doador. Esse texto será usado por uma futura busca inteligente para sugerir solicitações compatíveis."
            />
            {errors.description && (
              <em className={styles.error}>{errors.description}</em>
            )}
          </label>

          {showDonorFields && (
            <>
              <div className={styles.field}>
                <span>Sexo biológico</span>
                <div className={styles.genderButtons}>
                  <button
                    type="button"
                    onClick={() => setGender("MALE")}
                    className={`${styles.genderButton} ${
                      gender === "MALE" ? styles.genderButtonActive : ""
                    }`}
                  >
                    Homem
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender("FEMALE")}
                    className={`${styles.genderButton} ${
                      gender === "FEMALE" ? styles.genderButtonActive : ""
                    }`}
                  >
                    Mulher
                  </button>
                </div>
                {errors.gender && (
                  <em className={styles.error}>{errors.gender}</em>
                )}
              </div>

              <div className={styles.field}>
                <span>Última doação de sangue</span>
                <div className={styles.rowTwo}>
                  <select
                    value={lastDonationMonth}
                    onChange={(e) => setLastDonationMonth(e.target.value)}
                    disabled={neverDonated}
                  >
                    <option value="">Mês</option>
                    {MONTH_OPTIONS.map((m) => (
                      <option key={m.value} value={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                  <select
                    value={lastDonationYear}
                    onChange={(e) => setLastDonationYear(e.target.value)}
                    disabled={neverDonated}
                  >
                    <option value="">Ano</option>
                    {yearOptions.map((y) => (
                      <option key={y.value} value={y.value}>
                        {y.label}
                      </option>
                    ))}
                  </select>
                </div>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={neverDonated}
                    onChange={(e) => {
                      setNeverDonated(e.target.checked);
                      if (e.target.checked) {
                        setLastDonationMonth("");
                        setLastDonationYear("");
                      }
                    }}
                  />
                  Nunca doei sangue
                </label>
                {errors.lastDonationDate && (
                  <em className={styles.error}>{errors.lastDonationDate}</em>
                )}
              </div>
            </>
          )}

          {serverError && <div className={styles.serverError}>{serverError}</div>}

          <footer className={styles.footer}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelBtn}
              disabled={isPending}
            >
              Cancelar
            </button>
            <button type="submit" className={styles.saveBtn} disabled={isPending}>
              {isPending ? "Salvando..." : "Salvar"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
