"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import {
  BsCalendar3,
  BsClock,
  BsDroplet,
  BsEnvelope,
  BsPerson,
  BsTelephone,
  BsCheckCircle,
  BsXCircle,
} from "react-icons/bs";
import {
  IAppointment,
  AppointmentStatus,
} from "@/features/Institution/interfaces/Appointment.interface";
import {
  cancelAppointmentAction,
  confirmAppointmentAction,
} from "@/actions/appointments/appointments-actions";
import { ConfirmActionModal } from "./ConfirmActionModal";
import styles from "./styles.module.scss";

interface AppointmentsListProps {
  appointments: IAppointment[];
}

type Filter = "ALL" | AppointmentStatus;

const STATUS_LABEL: Record<AppointmentStatus, string> = {
  [AppointmentStatus.PENDING]: "Pendente",
  [AppointmentStatus.CONFIRMED]: "Confirmado",
  [AppointmentStatus.COMPLETED]: "Concluído",
  [AppointmentStatus.CANCELLED]: "Cancelado",
  [AppointmentStatus.NO_SHOW]: "Não compareceu",
};

const STATUS_CLASS: Record<AppointmentStatus, string> = {
  [AppointmentStatus.PENDING]: styles.statusPending,
  [AppointmentStatus.CONFIRMED]: styles.statusConfirmed,
  [AppointmentStatus.COMPLETED]: styles.statusCompleted,
  [AppointmentStatus.CANCELLED]: styles.statusCancelled,
  [AppointmentStatus.NO_SHOW]: styles.statusNoShow,
};

const FILTERS: { key: Filter; label: string }[] = [
  { key: "ALL", label: "Todos" },
  { key: AppointmentStatus.PENDING, label: "Pendentes" },
  { key: AppointmentStatus.CONFIRMED, label: "Confirmados" },
  { key: AppointmentStatus.COMPLETED, label: "Concluídos" },
  { key: AppointmentStatus.CANCELLED, label: "Cancelados" },
  { key: AppointmentStatus.NO_SHOW, label: "Não compareceram" },
];

const PAGE_SIZE = 10;

function formatDate(value: string): string {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return value;
  return new Date(year, month - 1, day).toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function sortByScheduledDesc(items: IAppointment[]): IAppointment[] {
  return [...items].sort((a, b) => {
    const dateCmp = b.scheduledDate.localeCompare(a.scheduledDate);
    if (dateCmp !== 0) return dateCmp;
    return b.scheduledTime.localeCompare(a.scheduledTime);
  });
}

interface PendingAction {
  id: string;
  kind: "confirm" | "cancel";
}

export function AppointmentsList({ appointments }: AppointmentsListProps) {
  const [items, setItems] = useState<IAppointment[]>(() =>
    sortByScheduledDesc(appointments),
  );
  const [filter, setFilter] = useState<Filter>("ALL");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(
    null,
  );
  const [isProcessing, startTransition] = useTransition();
  const [actionError, setActionError] = useState<string>("");

  // Re-sync when parent reloads (useHemocentroData refetch).
  useEffect(() => {
    setItems(sortByScheduledDesc(appointments));
  }, [appointments]);

  const counts = useMemo(() => {
    const base: Record<Filter, number> = {
      ALL: items.length,
      [AppointmentStatus.PENDING]: 0,
      [AppointmentStatus.CONFIRMED]: 0,
      [AppointmentStatus.COMPLETED]: 0,
      [AppointmentStatus.CANCELLED]: 0,
      [AppointmentStatus.NO_SHOW]: 0,
    };
    for (const item of items) {
      base[item.status]++;
    }
    return base;
  }, [items]);

  const filtered = useMemo(() => {
    if (filter === "ALL") return items;
    return items.filter((a) => a.status === filter);
  }, [items, filter]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = filtered.length > visible.length;

  const target = pendingAction
    ? items.find((a) => a.id === pendingAction.id)
    : null;

  const handleAction = () => {
    if (!pendingAction) return;
    setActionError("");
    startTransition(async () => {
      const result =
        pendingAction.kind === "confirm"
          ? await confirmAppointmentAction(pendingAction.id)
          : await cancelAppointmentAction(pendingAction.id);
      if (!result.ok) {
        setActionError(result.error.message);
        return;
      }
      const updated = result.appointment;
      setItems((prev) =>
        prev.map((a) => (a.id === updated.id ? { ...a, ...updated } : a)),
      );
      setPendingAction(null);
    });
  };

  if (items.length === 0) {
    return (
      <div className={styles.section}>
        <div className={styles.empty}>
          Nenhum agendamento detalhado para listar ainda.
        </div>
      </div>
    );
  }

  return (
    <div className={styles.section}>
      <h3 className={styles.heading}>Agendamentos detalhados</h3>

      <div className={styles.filters}>
        {FILTERS.map((f) => {
          const isActive = filter === f.key;
          return (
            <button
              key={f.key}
              type="button"
              className={`${styles.chip} ${isActive ? styles.chipActive : ""}`}
              onClick={() => {
                setFilter(f.key);
                setVisibleCount(PAGE_SIZE);
              }}
            >
              {f.label}
              <span className={styles.chipCount}>({counts[f.key]})</span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className={styles.empty}>
          Nenhum agendamento neste filtro.
        </div>
      ) : (
        <>
          <div className={styles.list}>
            {visible.map((appointment) => {
              const canConfirm =
                appointment.status === AppointmentStatus.PENDING;
              const canCancel =
                appointment.status === AppointmentStatus.PENDING ||
                appointment.status === AppointmentStatus.CONFIRMED;
              const hasActions = canConfirm || canCancel;

              return (
                <article key={appointment.id} className={styles.card}>
                  <div className={styles.info}>
                    <div className={styles.cardHeader}>
                      <h4 className={styles.donorName}>
                        <BsPerson /> {appointment.donorName || "Doador"}
                      </h4>
                      <span
                        className={`${styles.statusBadge} ${STATUS_CLASS[appointment.status]}`}
                      >
                        {STATUS_LABEL[appointment.status]}
                      </span>
                    </div>

                    <div className={styles.cardMeta}>
                      <span className={styles.metaItem}>
                        <BsDroplet />{" "}
                        <span className={styles.bloodType}>
                          {appointment.bloodType}
                        </span>
                      </span>
                      <span className={styles.metaItem}>
                        <BsCalendar3 /> {formatDate(appointment.scheduledDate)}
                      </span>
                      <span className={styles.metaItem}>
                        <BsClock /> {appointment.scheduledTime}
                      </span>
                    </div>

                    <div className={styles.cardContact}>
                      {appointment.donorEmail && (
                        <a
                          className={styles.contactLink}
                          href={`mailto:${appointment.donorEmail}`}
                        >
                          <BsEnvelope /> {appointment.donorEmail}
                        </a>
                      )}
                      {appointment.donorPhone && (
                        <a
                          className={styles.contactLink}
                          href={`tel:${appointment.donorPhone}`}
                        >
                          <BsTelephone /> {appointment.donorPhone}
                        </a>
                      )}
                    </div>

                    {appointment.notes && (
                      <p className={styles.notes}>{appointment.notes}</p>
                    )}
                  </div>

                  {hasActions && (
                    <div className={styles.cardActions}>
                      {canConfirm && (
                        <button
                          type="button"
                          className={`${styles.actionButton} ${styles.confirm}`}
                          onClick={() =>
                            setPendingAction({
                              id: appointment.id,
                              kind: "confirm",
                            })
                          }
                        >
                          <BsCheckCircle /> Confirmar
                        </button>
                      )}
                      {canCancel && (
                        <button
                          type="button"
                          className={`${styles.actionButton} ${styles.cancel}`}
                          onClick={() =>
                            setPendingAction({
                              id: appointment.id,
                              kind: "cancel",
                            })
                          }
                        >
                          <BsXCircle /> Cancelar
                        </button>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>

          {hasMore && (
            <button
              type="button"
              className={styles.loadMore}
              onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
            >
              Carregar mais
            </button>
          )}
        </>
      )}

      <ConfirmActionModal
        isOpen={pendingAction !== null}
        title={
          pendingAction?.kind === "confirm"
            ? "Confirmar agendamento"
            : "Cancelar agendamento"
        }
        message={
          target
            ? pendingAction?.kind === "confirm"
              ? `Confirmar comparecimento de ${target.donorName} em ${formatDate(target.scheduledDate)} às ${target.scheduledTime}?`
              : `Cancelar o agendamento de ${target.donorName} em ${formatDate(target.scheduledDate)} às ${target.scheduledTime}? Esta ação não pode ser desfeita.`
            : ""
        }
        confirmLabel={
          pendingAction?.kind === "confirm"
            ? "Sim, confirmar"
            : "Sim, cancelar"
        }
        variant={pendingAction?.kind === "confirm" ? "primary" : "danger"}
        isLoading={isProcessing}
        error={actionError}
        onConfirm={handleAction}
        onClose={() => {
          setPendingAction(null);
          setActionError("");
        }}
      />
    </div>
  );
}
