import { BsGeoAltFill } from "react-icons/bs";
import { AddressSearch, ISuggestion } from "@/components/AddressSearch";
import { SelectedAddress } from "@/components/SelectedAddress";
import { todayISO } from "@/utils/date-validation";
import styles from "../styles.module.scss";

interface StepLocationPeriodProps {
  endereco: string;
  datainicio: string;
  datatermino: string;
  locationData: { suggestion: ISuggestion } | null;
  errors: { endereco?: string; datainicio?: string; datatermino?: string };
  onEnderecoChange: (value: string) => void;
  onSelectLocation: (suggestion: ISuggestion) => void;
  onClearLocation: () => void;
  onDatainicioChange: (value: string) => void;
  onDataterminoChange: (value: string) => void;
}

export function StepLocationPeriod({
  endereco,
  datainicio,
  datatermino,
  locationData,
  errors,
  onEnderecoChange,
  onSelectLocation,
  onClearLocation,
  onDatainicioChange,
  onDataterminoChange,
}: StepLocationPeriodProps) {
  return (
    <div className={styles.stepContent}>
      <h2 className={styles.stepHeading}>
        <BsGeoAltFill className={styles.headingIcon} />
        Local e Período
      </h2>
      <div className={styles.formGrid}>
        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
          <label htmlFor="endereco" className={styles.label}>
            Endereço para doação <span className={styles.required}>*</span>
          </label>
          <AddressSearch
            id="endereco"
            value={endereco}
            onChange={onEnderecoChange}
            onSelect={onSelectLocation}
            placeholder="Buscar hospital, clínica ou hemocentro..."
            required
            helpText="Informe o local onde a doação deve ser realizada"
          />
          {errors.endereco && (
            <span id="endereco-error" className={styles.error} role="alert">
              {errors.endereco}
            </span>
          )}
          {locationData?.suggestion && (
            <SelectedAddress suggestion={locationData.suggestion} onClear={onClearLocation} />
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="datainicio" className={styles.label}>
            Data de início
          </label>
          <input
            type="date"
            className={`${styles.input} ${errors.datainicio ? styles.inputError : ""}`}
            id="datainicio"
            value={datainicio}
            min={todayISO()}
            max={datatermino || undefined}
            onChange={(e) => onDatainicioChange(e.target.value)}
            aria-invalid={errors.datainicio ? "true" : "false"}
            aria-describedby={errors.datainicio ? "datainicio-error" : undefined}
          />
          {errors.datainicio && (
            <span id="datainicio-error" className={styles.error} role="alert">
              {errors.datainicio}
            </span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="datatermino" className={styles.label}>
            Data de término
          </label>
          <input
            type="date"
            className={`${styles.input} ${errors.datatermino ? styles.inputError : ""}`}
            id="datatermino"
            value={datatermino}
            min={datainicio || todayISO()}
            onChange={(e) => onDataterminoChange(e.target.value)}
            aria-invalid={errors.datatermino ? "true" : "false"}
            aria-describedby={errors.datatermino ? "datatermino-error" : undefined}
          />
          {errors.datatermino && (
            <span id="datatermino-error" className={styles.error} role="alert">
              {errors.datatermino}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
