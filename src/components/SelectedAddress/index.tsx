"use client";

import { BsGeoAltFill, BsCheckCircleFill } from "react-icons/bs";
import styles from "./styles.module.scss";
import { ISuggestion } from "@/components/AddressSearch";

export interface ISelectedAddressProps {
  /**
   * The selected location suggestion
   */
  suggestion: ISuggestion;
  /**
   * Optional callback when the address should be cleared
   */
  onClear?: () => void;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Component to display the selected address information
 * Shows the name and full address of the selected location
 */
export const SelectedAddress = ({
  suggestion,
  onClear,
  className = "",
}: ISelectedAddressProps) => {
  return (
    <div className={`${styles.selectedAddress} ${className}`}>
      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          <BsCheckCircleFill className={styles.checkIcon} />
        </div>
        <div className={styles.addressInfo}>
          <h4 className={styles.name}>{suggestion.name}</h4>
          <div className={styles.addressContainer}>
            <BsGeoAltFill className={styles.addressIcon} />
            <p className={styles.address}>{suggestion.full_address}</p>
          </div>
        </div>
      </div>
      {onClear && (
        <button
          type="button"
          onClick={onClear}
          className={styles.clearButton}
          aria-label="Limpar endereço selecionado"
        >
          ×
        </button>
      )}
    </div>
  );
};
