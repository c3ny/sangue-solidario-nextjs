import { BsDropletFill } from "react-icons/bs";
import styles from "../styles.module.scss";

interface StepDonationInfoProps {
  tipoSanguineo: string;
  quantidade: number;
  errors: { tipoSanguineo?: string; quantidade?: string };
  onChange: (field: "tipoSanguineo" | "quantidade", value: string) => void;
}

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;

export function StepDonationInfo({
  tipoSanguineo,
  quantidade,
  errors,
  onChange,
}: StepDonationInfoProps) {
  return (
    <div className={styles.stepContent}>
      <h2 className={styles.stepHeading}>
        <BsDropletFill className={styles.headingIcon} />
        Informações sobre a Doação
      </h2>
      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label htmlFor="tipoSanguineo" className={styles.label}>
            Tipo sanguíneo <span className={styles.required}>*</span>
          </label>
          <select
            className={`${styles.select} ${errors.tipoSanguineo ? styles.inputError : ""}`}
            id="tipoSanguineo"
            value={tipoSanguineo}
            onChange={(e) => onChange("tipoSanguineo", e.target.value)}
            required
            aria-invalid={errors.tipoSanguineo ? "true" : "false"}
            aria-describedby={errors.tipoSanguineo ? "tipoSanguineo-error" : undefined}
          >
            <option value="" disabled>
              Selecione o tipo sanguíneo
            </option>
            {BLOOD_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.tipoSanguineo && (
            <span id="tipoSanguineo-error" className={styles.error} role="alert">
              {errors.tipoSanguineo}
            </span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="quantidade" className={styles.label}>
            Quantidade de bolsas <span className={styles.required}>*</span>
          </label>
          <input
            type="number"
            className={`${styles.input} ${errors.quantidade ? styles.inputError : ""}`}
            id="quantidade"
            placeholder="Ex: 2"
            min="1"
            value={quantidade}
            onChange={(e) => onChange("quantidade", e.target.value)}
            required
            aria-invalid={errors.quantidade ? "true" : "false"}
            aria-describedby={errors.quantidade ? "quantidade-error" : undefined}
          />
          {errors.quantidade && (
            <span id="quantidade-error" className={styles.error} role="alert">
              {errors.quantidade}
            </span>
          )}
          <span className={styles.helpText}>Quantidade necessária para a transfusão</span>
        </div>
      </div>
    </div>
  );
}
