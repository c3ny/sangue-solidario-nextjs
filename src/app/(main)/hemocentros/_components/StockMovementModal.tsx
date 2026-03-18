"use client";

import { useState } from "react";
import { BsDroplet, BsBoxArrowInDown, BsBoxArrowInUp } from "react-icons/bs";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Modal } from "@/components/Modal";
import { batchEntry, batchExit, BloodstockItem } from "@/lib/api";
import { BLOOD_TYPES } from "@/features/BloodStock/interfaces/Bloodstock.interface";
import styles from "./StockMovementModal.module.scss";

export interface StockMovementModalProps {
  isOpen: boolean;
  onClose: () => void;
  stocks: BloodstockItem[];
  onSuccess: (updatedStocks: BloodstockItem[]) => void;
}

type MovementType = "entry" | "exit";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Formata Date para DD/MM/YYYY que o back espera */
function toBackendDate(isoOrInput: string): string {
  if (!isoOrInput) return "";
  // input[type=date] retorna YYYY-MM-DD
  const [year, month, day] = isoOrInput.split("-");
  return `${day}/${month}/${year}`;
}

function todayInputValue(): string {
  return new Date().toISOString().split("T")[0];
}

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export const StockMovementModal = ({
  isOpen,
  onClose,
  stocks,
  onSuccess,
}: StockMovementModalProps) => {
  const [movementType, setMovementType] = useState<MovementType>("entry");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // Campos de entrada de lote
  const [batchCode, setBatchCode] = useState("");
  const [entryDate, setEntryDate] = useState(todayInputValue());
  const [expiryDate, setExpiryDate] = useState("");
  // Mapa de tipo → quantidade para entrada
  const [entryQuantities, setEntryQuantities] = useState<Record<string, string>>(
    () => Object.fromEntries(BLOOD_TYPES.map((t) => [t, ""]))
  );

  // Campos de saída
  const [exitDate, setExitDate] = useState(todayInputValue());
  // Mapa de tipo → quantidade para saída
  const [exitQuantities, setExitQuantities] = useState<Record<string, string>>(
    () => Object.fromEntries(BLOOD_TYPES.map((t) => [t, ""]))
  );

  // ---------------------------------------------------------------------------
  // Validação
  // ---------------------------------------------------------------------------

  function validateEntry(): string | null {
    if (!batchCode.trim()) return "Informe o código do lote.";
    if (!entryDate) return "Informe a data de entrada.";
    if (!expiryDate) return "Informe a data de validade.";
    if (entryDate >= expiryDate)
      return "A data de validade deve ser posterior à data de entrada.";

    const hasAny = BLOOD_TYPES.some((t) => {
      const v = parseInt(entryQuantities[t] || "0", 10);
      return v > 0;
    });
    if (!hasAny) return "Informe a quantidade de ao menos um tipo sanguíneo.";

    return null;
  }

  function validateExit(): string | null {
    if (!exitDate) return "Informe a data de saída.";

    const hasAny = BLOOD_TYPES.some((t) => {
      const v = parseInt(exitQuantities[t] || "0", 10);
      return v > 0;
    });
    if (!hasAny) return "Informe a quantidade de ao menos um tipo sanguíneo.";

    // Verifica se há estoque suficiente para cada tipo
    for (const t of BLOOD_TYPES) {
      const requested = parseInt(exitQuantities[t] || "0", 10);
      if (requested <= 0) continue;
      const available =
        stocks.find((s) => s.bloodType === t)?.quantity ?? 0;
      if (requested > available) {
        return `Estoque insuficiente para ${t}. Disponível: ${available} unidade(s).`;
      }
    }

    return null;
  }

  // ---------------------------------------------------------------------------
  // Submit
  // ---------------------------------------------------------------------------

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const validationError =
      movementType === "entry" ? validateEntry() : validateExit();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      let updatedStocks: BloodstockItem[];

      if (movementType === "entry") {
        const bloodQuantities: Record<string, number> = {};
        for (const t of BLOOD_TYPES) {
          const qty = parseInt(entryQuantities[t] || "0", 10);
          if (qty > 0) bloodQuantities[t] = qty;
        }

        updatedStocks = await batchEntry({
          batchCode: batchCode.trim(),
          entryDate: toBackendDate(entryDate),
          expiryDate: toBackendDate(expiryDate),
          bloodQuantities,
        });
      } else {
        const quantities: Record<string, number> = {};
        for (const t of BLOOD_TYPES) {
          const qty = parseInt(exitQuantities[t] || "0", 10);
          if (qty > 0) quantities[t] = qty;
        }

        updatedStocks = await batchExit({
          exitDate: toBackendDate(exitDate),
          quantities,
        });
      }

      onSuccess(updatedStocks);
      handleClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao registrar movimentação. Tente novamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Reset / Fechar
  // ---------------------------------------------------------------------------

  const handleClose = () => {
    if (isLoading) return;
    setBatchCode("");
    setEntryDate(todayInputValue());
    setExpiryDate("");
    setExitDate(todayInputValue());
    setEntryQuantities(Object.fromEntries(BLOOD_TYPES.map((t) => [t, ""])));
    setExitQuantities(Object.fromEntries(BLOOD_TYPES.map((t) => [t, ""])));
    setError("");
    onClose();
  };

  const handleTypeToggle = (type: MovementType) => {
    setMovementType(type);
    setError("");
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Movimentação de Estoque"
      size="medium"
    >
      <form onSubmit={handleSubmit} className={styles.form}>

        {/* Seletor de tipo */}
        <div className={styles.movementTypeSelector}>
          <button
            type="button"
            className={`${styles.movementButton} ${
              movementType === "entry" ? styles.active : ""
            }`}
            onClick={() => handleTypeToggle("entry")}
            disabled={isLoading}
          >
            <BsBoxArrowInDown />
            Entrada de Lote
          </button>
          <button
            type="button"
            className={`${styles.movementButton} ${
              movementType === "exit" ? styles.active : ""
            }`}
            onClick={() => handleTypeToggle("exit")}
            disabled={isLoading}
          >
            <BsBoxArrowInUp />
            Saída de Estoque
          </button>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* ENTRADA */}
        {/* ------------------------------------------------------------------ */}
        {movementType === "entry" && (
          <div className={styles.formFields}>
            <div className={styles.formGrid}>
              <Input
                label="Código do Lote"
                type="text"
                value={batchCode}
                onChange={(e) => { setBatchCode(e.target.value); setError(""); }}
                placeholder="Ex: LOTE-2025-001"
                required
                showRequired
                disabled={isLoading}
              />
            </div>

            <div className={styles.formGrid}>
              <Input
                label="Data de Entrada"
                type="date"
                value={entryDate}
                onChange={(e) => { setEntryDate(e.target.value); setError(""); }}
                required
                showRequired
                disabled={isLoading}
              />
              <Input
                label="Data de Validade"
                type="date"
                value={expiryDate}
                onChange={(e) => { setExpiryDate(e.target.value); setError(""); }}
                required
                showRequired
                disabled={isLoading}
              />
            </div>

            <div className={styles.bloodQuantitiesSection}>
              <p className={styles.bloodQuantitiesLabel}>
                Quantidades por tipo sanguíneo
              </p>
              <div className={styles.bloodGrid}>
                {BLOOD_TYPES.map((bloodType) => (
                  <div key={bloodType} className={styles.bloodTypeRow}>
                    <span className={styles.bloodTypeBadge}>{bloodType}</span>
                    <Input
                      type="number"
                      min="0"
                      step="1"
                      placeholder="0"
                      value={entryQuantities[bloodType]}
                      onChange={(e) => {
                        setEntryQuantities((prev) => ({
                          ...prev,
                          [bloodType]: e.target.value,
                        }));
                        setError("");
                      }}
                      disabled={isLoading}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* SAÍDA */}
        {/* ------------------------------------------------------------------ */}
        {movementType === "exit" && (
          <div className={styles.formFields}>
            <div className={styles.formGrid}>
              <Input
                label="Data de Saída"
                type="date"
                value={exitDate}
                onChange={(e) => { setExitDate(e.target.value); setError(""); }}
                required
                showRequired
                disabled={isLoading}
              />
            </div>

            <div className={styles.bloodQuantitiesSection}>
              <p className={styles.bloodQuantitiesLabel}>
                Quantidades a retirar por tipo sanguíneo
              </p>
              <div className={styles.bloodGrid}>
                {BLOOD_TYPES.map((bloodType) => {
                  const available =
                    stocks.find((s) => s.bloodType === bloodType)?.quantity ?? 0;
                  return (
                    <div key={bloodType} className={styles.bloodTypeRow}>
                      <span className={styles.bloodTypeBadge}>{bloodType}</span>
                      <Input
                        type="number"
                        min="0"
                        max={available}
                        step="1"
                        placeholder="0"
                        value={exitQuantities[bloodType]}
                        onChange={(e) => {
                          setExitQuantities((prev) => ({
                            ...prev,
                            [bloodType]: e.target.value,
                          }));
                          setError("");
                        }}
                        disabled={isLoading || available === 0}
                      />
                      <span className={styles.availableHint}>
                        {available} disp.
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {error && <div className={styles.errorMessage}>{error}</div>}

        <div className={styles.formActions}>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            iconBefore={<BsDroplet />}
          >
            {movementType === "entry" ? "Registrar Entrada" : "Registrar Saída"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};