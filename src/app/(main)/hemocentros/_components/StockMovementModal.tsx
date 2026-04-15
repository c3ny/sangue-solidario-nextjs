"use client";

import { useState, useEffect } from "react";
import {
  BsDroplet,
  BsBoxArrowInDown,
  BsBoxArrowInUp,
  BsCalendar3,
  BsExclamationTriangle,
  BsCheckCircle,
} from "react-icons/bs";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Select } from "@/components/Select";
import { Modal } from "@/components/Modal";
import { BloodstockItem } from "@/lib/api";
import {
  batchEntryAction,
  batchExitAction,
  getAvailableBatchesAction,
} from "@/actions/bloodstock/bloodstock-actions";
import {
  BLOOD_TYPES,
  IAvailableBatch,
} from "@/features/BloodStock/interfaces/Bloodstock.interface";
import {
  isEndAfterStart,
  isPastOrToday,
  todayISO,
} from "@/utils/date-validation";
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

function toBackendDate(inputDate: string): string {
  if (!inputDate) return "";
  const [year, month, day] = inputDate.split("-");
  return `${day}/${month}/${year}`;
}

function todayInputValue(): string {
  return new Date().toISOString().split("T")[0];
}

function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("pt-BR");
  } catch {
    return dateStr;
  }
}

/**
 * Simula o consumo FEFO client-side para visualização.
 * Retorna quanto será retirado de cada lote.
 */
function simulateFEFO(
  batches: IAvailableBatch[],
  totalQty: number
): { batchCode: string; expiryDate: string; available: number; toConsume: number }[] {
  let remaining = totalQty;
  return batches.map((b) => {
    const consume = Math.min(b.quantity, remaining);
    remaining -= consume;
    return {
      batchCode: b.batch.batchCode,
      expiryDate: b.expiryDate,
      available: b.quantity,
      toConsume: consume,
    };
  });
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

  // ---- ENTRADA ----
  const [batchCode, setBatchCode] = useState("");
  const [entryDate, setEntryDate] = useState(todayInputValue());
  const [expiryDate, setExpiryDate] = useState("");
  const [entryQuantities, setEntryQuantities] = useState<Record<string, string>>(
    () => Object.fromEntries(BLOOD_TYPES.map((t) => [t, ""]))
  );

  // ---- SAÍDA ----
  const [exitDate, setExitDate] = useState(todayInputValue());
  const [selectedBloodType, setSelectedBloodType] = useState<string>("");
  const [exitQuantity, setExitQuantity] = useState<string>("");
  const [availableBatches, setAvailableBatches] = useState<IAvailableBatch[]>([]);
  const [isLoadingBatches, setIsLoadingBatches] = useState(false);
  // Acumulador: tipos já adicionados para saída
  const [exitItems, setExitItems] = useState<
    { bloodType: string; quantity: number }[]
  >([]);

  // ---------------------------------------------------------------------------
  // Busca lotes quando tipo sanguíneo é selecionado
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (!selectedBloodType || movementType !== "exit") {
      setAvailableBatches([]);
      setExitQuantity("");
      return;
    }

    setIsLoadingBatches(true);
    setError("");

    getAvailableBatchesAction(selectedBloodType)
      .then(setAvailableBatches)
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Erro ao buscar lotes.");
        setAvailableBatches([]);
      })
      .finally(() => setIsLoadingBatches(false));
  }, [selectedBloodType, movementType]);

  // ---------------------------------------------------------------------------
  // Cálculos derivados para saída
  // ---------------------------------------------------------------------------

  const totalAvailable = availableBatches.reduce((sum, b) => sum + b.quantity, 0);
  const exitQtyNum = parseInt(exitQuantity || "0", 10);
  const fefoPreview =
    availableBatches.length > 0 && exitQtyNum > 0
      ? simulateFEFO(availableBatches, exitQtyNum)
      : [];

  // Tipos que ainda têm estoque e não foram adicionados
  const stockOptions = BLOOD_TYPES
    .filter((t) => {
      const hasStock = (stocks.find((s) => s.bloodType === t)?.quantity ?? 0) > 0;
      const alreadyAdded = exitItems.some((i) => i.bloodType === t);
      return hasStock && !alreadyAdded;
    })
    .map((t) => ({ value: t, label: t }));

  // ---------------------------------------------------------------------------
  // Adicionar tipo à lista de saída
  // ---------------------------------------------------------------------------

  const handleAddExitItem = () => {
    if (!selectedBloodType) { setError("Selecione um tipo sanguíneo."); return; }
    if (!exitQtyNum || exitQtyNum <= 0) { setError("Informe uma quantidade válida."); return; }
    if (exitQtyNum > totalAvailable) {
      setError(`Quantidade insuficiente para ${selectedBloodType}. Disponível: ${totalAvailable}.`);
      return;
    }

    setExitItems((prev) => [...prev, { bloodType: selectedBloodType, quantity: exitQtyNum }]);
    setSelectedBloodType("");
    setExitQuantity("");
    setAvailableBatches([]);
    setError("");
  };

  const handleRemoveExitItem = (bloodType: string) => {
    setExitItems((prev) => prev.filter((i) => i.bloodType !== bloodType));
  };

  // ---------------------------------------------------------------------------
  // Validações
  // ---------------------------------------------------------------------------

  function validateEntry(): string | null {
    if (!batchCode.trim()) return "Informe o código do lote.";
    if (!entryDate) return "Informe a data de entrada.";
    if (!expiryDate) return "Informe a data de validade.";
    if (!isPastOrToday(entryDate)) return "A data de entrada não pode ser no futuro.";
    if (!isEndAfterStart(entryDate, expiryDate))
      return "A data de validade deve ser posterior à data de entrada.";
    const hasAny = BLOOD_TYPES.some((t) => parseInt(entryQuantities[t] || "0", 10) > 0);
    if (!hasAny) return "Informe a quantidade de ao menos um tipo sanguíneo.";
    return null;
  }

  function validateExit(): string | null {
    if (!exitDate) return "Informe a data de saída.";
    if (exitItems.length === 0) return "Adicione ao menos um tipo sanguíneo para saída.";
    return null;
  }

  // ---------------------------------------------------------------------------
  // Submit
  // ---------------------------------------------------------------------------

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const validationError = movementType === "entry" ? validateEntry() : validateExit();
    if (validationError) { setError(validationError); return; }

    setIsLoading(true);

    try {
      let updatedStocks: BloodstockItem[];

      if (movementType === "entry") {
        const bloodQuantities: Record<string, number> = {};
        for (const t of BLOOD_TYPES) {
          const qty = parseInt(entryQuantities[t] || "0", 10);
          if (qty > 0) bloodQuantities[t] = qty;
        }
        updatedStocks = await batchEntryAction({
          batchCode: batchCode.trim(),
          entryDate: toBackendDate(entryDate),
          expiryDate: toBackendDate(expiryDate),
          bloodQuantities,
        });
      } else {
        const quantities: Record<string, number> = {};
        for (const item of exitItems) {
          quantities[item.bloodType] = item.quantity;
        }
        updatedStocks = await batchExitAction({
          exitDate: toBackendDate(exitDate),
          quantities,
        });
      }

      onSuccess(updatedStocks);
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao registrar movimentação.");
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
    setEntryQuantities(Object.fromEntries(BLOOD_TYPES.map((t) => [t, ""])));
    setExitDate(todayInputValue());
    setSelectedBloodType("");
    setExitQuantity("");
    setAvailableBatches([]);
    setExitItems([]);
    setError("");
    onClose();
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Movimentação de Estoque" size="medium">
      <form onSubmit={handleSubmit} className={styles.form}>

        {/* Seletor entrada / saída */}
        <div className={styles.movementTypeSelector}>
          <button type="button" disabled={isLoading}
            className={`${styles.movementButton} ${movementType === "entry" ? styles.active : ""}`}
            onClick={() => { setMovementType("entry"); setError(""); }}>
            <BsBoxArrowInDown /> Entrada de Lote
          </button>
          <button type="button" disabled={isLoading}
            className={`${styles.movementButton} ${movementType === "exit" ? styles.active : ""}`}
            onClick={() => { setMovementType("exit"); setError(""); }}>
            <BsBoxArrowInUp /> Saída de Estoque
          </button>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* ENTRADA                                                             */}
        {/* ------------------------------------------------------------------ */}
        {movementType === "entry" && (
          <div className={styles.formFields}>
            <div className={styles.formGrid}>
              <Input label="Código do Lote" type="text" value={batchCode}
                onChange={(e) => { setBatchCode(e.target.value); setError(""); }}
                placeholder="Ex: LOTE-2025-001" required showRequired disabled={isLoading} />
            </div>
            <div className={styles.formGrid}>
              <Input label="Data de Entrada" type="date" value={entryDate}
                max={todayISO()}
                onChange={(e) => { setEntryDate(e.target.value); setError(""); }}
                required showRequired disabled={isLoading} />
              <Input label="Data de Validade" type="date" value={expiryDate}
                min={entryDate || todayISO()}
                onChange={(e) => { setExpiryDate(e.target.value); setError(""); }}
                required showRequired disabled={isLoading} />
            </div>
            <div className={styles.bloodQuantitiesSection}>
              <p className={styles.bloodQuantitiesLabel}>Quantidades por tipo sanguíneo</p>
              <div className={styles.bloodGrid}>
                {BLOOD_TYPES.map((bloodType) => (
                  <div key={bloodType} className={styles.bloodTypeRow}>
                    <span className={styles.bloodTypeBadge}>{bloodType}</span>
                    <Input type="number" min="0" step="1" placeholder="0"
                      value={entryQuantities[bloodType]}
                      onChange={(e) => {
                        setEntryQuantities((prev) => ({ ...prev, [bloodType]: e.target.value }));
                        setError("");
                      }}
                      disabled={isLoading} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* SAÍDA                                                               */}
        {/* ------------------------------------------------------------------ */}
        {movementType === "exit" && (
          <div className={styles.formFields}>

            {/* Data de saída */}
            <div className={styles.formGrid}>
              <Input label="Data de Saída" type="date" value={exitDate}
                onChange={(e) => { setExitDate(e.target.value); setError(""); }}
                required showRequired disabled={isLoading} />
            </div>

            {/* Seletor de tipo sanguíneo + quantidade */}
            <div className={styles.exitSelectorSection}>
              <p className={styles.bloodQuantitiesLabel}>Adicionar tipo sanguíneo</p>
              <div className={styles.exitSelectorRow}>
                <Select
                  label="Tipo Sanguíneo"
                  options={stockOptions}
                  placeholder="Selecione..."
                  value={selectedBloodType}
                  onChange={(e) => { setSelectedBloodType(e.target.value); setError(""); }}
                  disabled={isLoading || stockOptions.length === 0}
                />
                <Input
                  label="Quantidade"
                  type="number"
                  min="1"
                  max={totalAvailable || undefined}
                  step="1"
                  placeholder="0"
                  value={exitQuantity}
                  onChange={(e) => { setExitQuantity(e.target.value); setError(""); }}
                  disabled={isLoading || !selectedBloodType}
                />
                <div className={styles.addButtonWrapper}>
                  <Button type="button" variant="outline"
                    onClick={handleAddExitItem}
                    disabled={isLoading || !selectedBloodType || !exitQuantity}>
                    Adicionar
                  </Button>
                </div>
              </div>
            </div>

            {/* Lotes disponíveis para o tipo selecionado */}
            {selectedBloodType && (
              <div className={styles.batchesSection}>
                <p className={styles.batchesSectionTitle}>
                  <BsCalendar3 />
                  Lotes disponíveis para {selectedBloodType}
                  {isLoadingBatches && <span className={styles.loadingHint}> carregando...</span>}
                </p>

                {!isLoadingBatches && availableBatches.length === 0 && (
                  <p className={styles.emptyBatches}>Nenhum lote disponível para este tipo.</p>
                )}

                {availableBatches.length > 0 && (
                  <div className={styles.batchesList}>
                    {/* Cabeçalho */}
                    <div className={`${styles.batchRow} ${styles.batchHeader}`}>
                      <span>Lote</span>
                      <span>Validade</span>
                      <span>Disponível</span>
                      <span>Saída prevista</span>
                    </div>

                    {/* Linhas FEFO */}
                    {availableBatches.map((batch) => {
                      const preview = fefoPreview.find(
                        (p) => p.batchCode === batch.batch.batchCode
                      );
                      const willConsume = preview?.toConsume ?? 0;

                      return (
                        <div key={batch.id}
                          className={`${styles.batchRow} ${willConsume > 0 ? styles.batchWillConsume : ""}`}>
                          <span className={styles.batchCode}>{batch.batch.batchCode}</span>
                          <span className={styles.batchExpiry}>
                            {formatDisplayDate(batch.expiryDate)}
                          </span>
                          <span className={styles.batchAvailable}>{batch.quantity} un.</span>
                          <span className={styles.batchConsume}>
                            {willConsume > 0 ? (
                              <span className={styles.consumeValue}>
                                <BsCheckCircle /> {willConsume} un.
                              </span>
                            ) : (
                              <span className={styles.consumeEmpty}>—</span>
                            )}
                          </span>
                        </div>
                      );
                    })}

                    {/* Aviso se quantidade solicitada excede disponível */}
                    {exitQtyNum > totalAvailable && (
                      <div className={styles.stockWarning}>
                        <BsExclamationTriangle />
                        Quantidade solicitada ({exitQtyNum}) excede o disponível ({totalAvailable}).
                      </div>
                    )}

                    {/* Total disponível */}
                    <div className={styles.batchTotal}>
                      <span>Total disponível:</span>
                      <span>{totalAvailable} unidades</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Lista de itens já adicionados para saída */}
            {exitItems.length > 0 && (
              <div className={styles.exitItemsSection}>
                <p className={styles.bloodQuantitiesLabel}>Resumo da saída</p>
                <div className={styles.exitItemsList}>
                  {exitItems.map((item) => (
                    <div key={item.bloodType} className={styles.exitItemRow}>
                      <span className={styles.bloodTypeBadge}>{item.bloodType}</span>
                      <span className={styles.exitItemQty}>{item.quantity} unidades</span>
                      <button type="button" className={styles.removeItemButton}
                        onClick={() => handleRemoveExitItem(item.bloodType)}
                        disabled={isLoading}>
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {error && <div className={styles.errorMessage}>{error}</div>}

        <div className={styles.formActions}>
          <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading} iconBefore={<BsDroplet />}>
            {movementType === "entry" ? "Registrar Entrada" : "Confirmar Saída"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};