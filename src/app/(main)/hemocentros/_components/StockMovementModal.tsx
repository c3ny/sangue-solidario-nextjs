"use client";

import { useState } from "react";
import { BsDroplet } from "react-icons/bs";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Select, SelectOption } from "@/components/Select";
import { Modal } from "@/components/Modal";
import { moveStock, Bloodstock } from "@/lib/api";
import styles from "./StockMovementModal.module.scss";

export interface StockMovementModalProps {
  isOpen: boolean;
  onClose: () => void;
  stocks: Bloodstock[];
  companyId: string;
  onSuccess: () => void;
}

type MovementType = "input" | "output";

/**
 * Modal for adding input or output to blood stock
 */
export const StockMovementModal = ({
  isOpen,
  onClose,
  stocks,
  companyId,
  onSuccess,
}: StockMovementModalProps) => {
  const [movementType, setMovementType] = useState<MovementType>("input");
  const [selectedStockId, setSelectedStockId] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  console.log(stocks);
  const stockOptions: SelectOption[] = stocks.map((stock) => ({
    value: stock.id,
    label: `${stock.blood_type} (Atual: ${stock.quantity} unidades)`,
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!selectedStockId) {
      setError("Selecione um tipo sanguíneo");
      return;
    }

    const quantityNum = parseInt(quantity, 10);
    if (isNaN(quantityNum) || quantityNum <= 0) {
      setError("A quantidade deve ser um número positivo");
      return;
    }

    // Check if output would result in negative stock
    if (movementType === "output") {
      const selectedStock = stocks.find((s) => s.id === selectedStockId);
      if (selectedStock && selectedStock.quantity < quantityNum) {
        setError(
          `Estoque insuficiente. Disponível: ${selectedStock.quantity} unidades`
        );
        return;
      }
    }

    setIsLoading(true);

    try {
      // For output, make quantity negative
      const movementQuantity =
        movementType === "output" ? -quantityNum : quantityNum;

      await moveStock(companyId, {
        bloodstockId: selectedStockId,
        quantity: movementQuantity,
      });

      // Reset form
      setSelectedStockId("");
      setQuantity("");
      setMovementType("input");
      setError("");

      // Call success callback and close
      onSuccess();
      onClose();
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

  const handleClose = () => {
    if (!isLoading) {
      setError("");
      setSelectedStockId("");
      setQuantity("");
      setMovementType("input");
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Movimentação de Estoque"
      size="medium"
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.movementTypeSelector}>
          <button
            type="button"
            className={`${styles.movementButton} ${
              movementType === "input" ? styles.active : ""
            }`}
            onClick={() => {
              setMovementType("input");
              setError("");
            }}
            disabled={isLoading}
          >
            <BsDroplet />
            Entrada
          </button>
          <button
            type="button"
            className={`${styles.movementButton} ${
              movementType === "output" ? styles.active : ""
            }`}
            onClick={() => {
              setMovementType("output");
              setError("");
            }}
            disabled={isLoading}
          >
            <BsDroplet />
            Saída
          </button>
        </div>

        <div className={styles.formFields}>
          <Select
            label="Tipo Sanguíneo"
            options={stockOptions}
            placeholder="Selecione o tipo sanguíneo"
            value={selectedStockId}
            onChange={(e) => {
              setSelectedStockId(e.target.value);
              setError("");
            }}
            required
            disabled={isLoading}
            showRequired
          />

          <Input
            label="Quantidade"
            type="number"
            min="1"
            step="1"
            value={quantity}
            onChange={(e) => {
              setQuantity(e.target.value);
              setError("");
            }}
            placeholder="Digite a quantidade"
            required
            disabled={isLoading}
            showRequired
          />
        </div>

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
            {movementType === "input" ? "Adicionar" : "Remover"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
