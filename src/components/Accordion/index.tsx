"use client";

import { useState } from "react";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import styles from "./styles.module.scss";

export interface AccordionItem {
  id: string | number;
  title: string;
  content: string | React.ReactNode;
}

export interface IAccordionProps {
  items: AccordionItem[];
  /**
   * If true, allows multiple items to be open at once
   * @default false
   */
  allowMultiple?: boolean;
  /**
   * Custom className for the accordion container
   */
  className?: string;
  /**
   * Index of the item to be open by default
   */
  defaultOpenIndex?: number;
}

/**
 * Accordion Component
 * A reusable accordion component that can display collapsible content
 *
 * @example
 * ```tsx
 * const items = [
 *   { id: 1, title: "Question 1", content: "Answer 1" },
 *   { id: 2, title: "Question 2", content: "Answer 2" },
 * ];
 *
 * <Accordion items={items} />
 * ```
 */
export const Accordion = ({
  items,
  allowMultiple = false,
  className,
  defaultOpenIndex,
}: IAccordionProps) => {
  const [openIndices, setOpenIndices] = useState<number[]>(
    defaultOpenIndex !== undefined ? [defaultOpenIndex] : []
  );

  const toggleItem = (index: number) => {
    if (allowMultiple) {
      setOpenIndices((prev) =>
        prev.includes(index)
          ? prev.filter((i) => i !== index)
          : [...prev, index]
      );
    } else {
      setOpenIndices((prev) => (prev.includes(index) ? [] : [index]));
    }
  };

  const isOpen = (index: number) => openIndices.includes(index);

  return (
    <div className={`${styles.accordionContainer} ${className || ""}`}>
      {items.map((item, index) => (
        <div
          key={item.id}
          className={`${styles.accordionItem} ${
            isOpen(index) ? styles.accordionItemOpen : ""
          }`}
        >
          <button
            className={styles.accordionHeader}
            onClick={() => toggleItem(index)}
            aria-expanded={isOpen(index)}
            aria-controls={`accordion-content-${item.id}`}
          >
            <span className={styles.accordionTitle}>{item.title}</span>
            <span className={styles.iconWrapper}>
              {isOpen(index) ? (
                <BsChevronUp className={styles.icon} />
              ) : (
                <BsChevronDown className={styles.icon} />
              )}
            </span>
          </button>
          <div
            id={`accordion-content-${item.id}`}
            className={`${styles.accordionContent} ${
              isOpen(index) ? styles.accordionContentOpen : ""
            }`}
            role="region"
            aria-labelledby={`accordion-header-${item.id}`}
          >
            {typeof item.content === "string" ? (
              <p className={styles.accordionText}>{item.content}</p>
            ) : (
              item.content
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
