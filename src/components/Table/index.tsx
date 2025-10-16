import {
  ReactNode,
  HTMLAttributes,
  ThHTMLAttributes,
  TdHTMLAttributes,
} from "react";
import styles from "./styles.module.scss";

/**
 * Table Container Component
 * Wrapper for the entire table with responsive behavior
 */
export interface ITableProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /**
   * Show striped rows
   * @default false
   */
  striped?: boolean;
  /**
   * Show hover effect on rows
   * @default true
   */
  hoverable?: boolean;
  /**
   * Add border to table
   * @default false
   */
  bordered?: boolean;
}

export const Table = ({
  children,
  striped = false,
  hoverable = true,
  bordered = false,
  className = "",
  ...props
}: ITableProps) => {
  const tableClasses = `
    ${styles.tableWrapper}
    ${className}
  `.trim();

  const innerTableClasses = `
    ${styles.table}
    ${striped ? styles.striped : ""}
    ${hoverable ? styles.hoverable : ""}
    ${bordered ? styles.bordered : ""}
  `.trim();

  return (
    <div className={tableClasses} {...props}>
      <table className={innerTableClasses}>{children}</table>
    </div>
  );
};

/**
 * Table Header Component
 * Container for table header rows
 */
export interface ITableHeaderProps
  extends HTMLAttributes<HTMLTableSectionElement> {
  children: ReactNode;
}

export const TableHeader = ({
  children,
  className = "",
  ...props
}: ITableHeaderProps) => {
  return (
    <thead className={`${styles.tableHeader} ${className}`} {...props}>
      {children}
    </thead>
  );
};

/**
 * Table Body Component
 * Container for table body rows
 */
export interface ITableBodyProps
  extends HTMLAttributes<HTMLTableSectionElement> {
  children: ReactNode;
}

export const TableBody = ({
  children,
  className = "",
  ...props
}: ITableBodyProps) => {
  return (
    <tbody className={`${styles.tableBody} ${className}`} {...props}>
      {children}
    </tbody>
  );
};

/**
 * Table Row Component
 * Row container for table cells
 */
export interface ITableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  children: ReactNode;
  /**
   * Highlight this row
   */
  highlighted?: boolean;
}

export const TableRow = ({
  children,
  highlighted = false,
  className = "",
  ...props
}: ITableRowProps) => {
  const rowClasses = `
    ${styles.tableRow}
    ${highlighted ? styles.highlighted : ""}
    ${className}
  `.trim();

  return (
    <tr className={rowClasses} {...props}>
      {children}
    </tr>
  );
};

/**
 * Table Header Cell Component
 * Header cell with sorting and alignment options
 */
export interface ITableHeaderCellProps
  extends ThHTMLAttributes<HTMLTableCellElement> {
  children: ReactNode;
  /**
   * Icon to display before text
   */
  icon?: ReactNode;
  /**
   * Make this column sortable
   */
  sortable?: boolean;
  /**
   * Current sort direction
   */
  sortDirection?: "asc" | "desc" | null;
  /**
   * Callback when header is clicked (for sorting)
   */
  onSort?: () => void;
  /**
   * Text alignment
   */
  align?: "left" | "center" | "right";
}

export const TableHeaderCell = ({
  children,
  icon,
  sortable = false,
  sortDirection = null,
  onSort,
  align = "left",
  className = "",
  ...props
}: ITableHeaderCellProps) => {
  const cellClasses = `
    ${styles.tableHeaderCell}
    ${styles[`align-${align}`]}
    ${sortable ? styles.sortable : ""}
    ${className}
  `.trim();

  const content = (
    <>
      {icon && <span className={styles.headerIcon}>{icon}</span>}
      <span>{children}</span>
      {sortable && (
        <span className={styles.sortIcon}>
          {sortDirection === "asc" ? "↑" : sortDirection === "desc" ? "↓" : "↕"}
        </span>
      )}
    </>
  );

  return (
    <th
      className={cellClasses}
      onClick={sortable ? onSort : undefined}
      role={sortable ? "button" : undefined}
      tabIndex={sortable ? 0 : undefined}
      {...props}
    >
      {content}
    </th>
  );
};

/**
 * Table Cell Component
 * Data cell with alignment options
 */
export interface ITableCellProps
  extends TdHTMLAttributes<HTMLTableCellElement> {
  children: ReactNode;
  /**
   * Text alignment
   */
  align?: "left" | "center" | "right";
  /**
   * Make text bold
   */
  bold?: boolean;
}

export const TableCell = ({
  children,
  align = "left",
  bold = false,
  className = "",
  ...props
}: ITableCellProps) => {
  const cellClasses = `
    ${styles.tableCell}
    ${styles[`align-${align}`]}
    ${bold ? styles.bold : ""}
    ${className}
  `.trim();

  return (
    <td className={cellClasses} {...props}>
      {children}
    </td>
  );
};

/**
 * Table Empty State Component
 * Display when table has no data
 */
export interface ITableEmptyProps {
  message?: string;
  icon?: ReactNode;
  colSpan?: number;
}

export const TableEmpty = ({
  message = "Nenhum dado disponível",
  icon,
  colSpan = 1,
}: ITableEmptyProps) => {
  return (
    <tr className={styles.emptyRow}>
      <td colSpan={colSpan} className={styles.emptyCell}>
        <div className={styles.emptyContent}>
          {icon && <div className={styles.emptyIcon}>{icon}</div>}
          <p className={styles.emptyMessage}>{message}</p>
        </div>
      </td>
    </tr>
  );
};

/**
 * Table Card Component
 * Wrapper card for tables with title
 */
export interface ITableCardProps {
  children: ReactNode;
  title?: string;
  icon?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export const TableCard = ({
  children,
  title,
  icon,
  actions,
  className = "",
}: ITableCardProps) => {
  return (
    <div className={`${styles.tableCard} ${className}`}>
      {(title || icon || actions) && (
        <div className={styles.tableCardHeader}>
          <div className={styles.tableCardTitle}>
            {icon && <span className={styles.tableCardIcon}>{icon}</span>}
            {title && <h3>{title}</h3>}
          </div>
          {actions && <div className={styles.tableCardActions}>{actions}</div>}
        </div>
      )}
      <div className={styles.tableCardContent}>{children}</div>
    </div>
  );
};
