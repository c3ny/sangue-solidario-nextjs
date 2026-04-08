import { BsPersonFill } from "react-icons/bs";
import styles from "../styles.module.scss";

interface StepPatientDataProps {
  nome: string;
  error?: string;
  onChange: (value: string) => void;
}

export function StepPatientData({ nome, error, onChange }: StepPatientDataProps) {
  return (
    <div className={styles.stepContent}>
      <h2 className={styles.stepHeading}>
        <BsPersonFill className={styles.headingIcon} />
        Dados do Paciente
      </h2>
      <div className={styles.formSingleGrid}>
        <div className={styles.formGroup}>
          <label htmlFor="nome" className={styles.label}>
            Nome do paciente <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            className={`${styles.input} ${error ? styles.inputError : ""}`}
            id="nome"
            placeholder="Digite o nome completo"
            value={nome}
            onChange={(e) => onChange(e.target.value)}
            required
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? "nome-error" : undefined}
          />
          {error && (
            <span id="nome-error" className={styles.error} role="alert">
              {error}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
