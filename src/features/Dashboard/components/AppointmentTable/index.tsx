"use client";

import { useState } from "react";
import {
  BsPerson,
  BsCalendar3,
  BsClock,
  BsDroplet,
  BsCheckCircle,
  BsXCircle,
  BsEye,
} from "react-icons/bs";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
  TableCard,
} from "@/components/Table";
import { Button } from "@/components/Button";
import { Badge } from "@/components/Badge";
import { IAppointment } from "../../services/dashboard.service";
import styles from "./styles.module.scss";

interface IAppointmentTableProps {
  appointments: IAppointment[];
  onConfirm?: (appointment: IAppointment) => void;
  onCancel?: (appointment: IAppointment) => void;
  onViewDetails?: (appointment: IAppointment) => void;
  isLoading?: boolean;
}

/**
 * Table component to display and manage appointments
 */
export const AppointmentTable = ({
  appointments,
  onConfirm,
  onCancel,
  onViewDetails,
  isLoading = false,
}: IAppointmentTableProps) => {
  const [filterStatus, setFilterStatus] = useState<
    "ALL" | "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELED"
  >("ALL");

  const filteredAppointments = appointments.filter((appointment) => {
    if (filterStatus === "ALL") return true;
    return appointment.status === filterStatus;
  });

  const getStatusBadgeVariant = (
    status: IAppointment["status"]
  ): "success" | "warning" | "danger" | "info" => {
    switch (status) {
      case "CONFIRMED":
        return "info";
      case "COMPLETED":
        return "success";
      case "CANCELED":
        return "danger";
      case "PENDING":
      default:
        return "warning";
    }
  };

  const getStatusLabel = (status: IAppointment["status"]): string => {
    switch (status) {
      case "PENDING":
        return "Pendente";
      case "CONFIRMED":
        return "Confirmado";
      case "COMPLETED":
        return "Concluído";
      case "CANCELED":
        return "Cancelado";
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <TableCard title="Agendamentos" icon={<BsCalendar3 />}>
        <div className={styles.loading}>
          <p>Carregando agendamentos...</p>
        </div>
      </TableCard>
    );
  }

  return (
    <TableCard
      title="Agendamentos"
      icon={<BsCalendar3 />}
      className={styles.appointmentTableCard}
    >
      <div className={styles.filters}>
        <Button
          variant={filterStatus === "ALL" ? "primary" : "outline"}
          size="small"
          onClick={() => setFilterStatus("ALL")}
        >
          Todos ({appointments.length})
        </Button>
        <Button
          variant={filterStatus === "PENDING" ? "primary" : "outline"}
          size="small"
          onClick={() => setFilterStatus("PENDING")}
        >
          Pendentes ({appointments.filter((a) => a.status === "PENDING").length}
          )
        </Button>
        <Button
          variant={filterStatus === "CONFIRMED" ? "primary" : "outline"}
          size="small"
          onClick={() => setFilterStatus("CONFIRMED")}
        >
          Confirmados (
          {appointments.filter((a) => a.status === "CONFIRMED").length})
        </Button>
        <Button
          variant={filterStatus === "COMPLETED" ? "primary" : "outline"}
          size="small"
          onClick={() => setFilterStatus("COMPLETED")}
        >
          Concluídos (
          {appointments.filter((a) => a.status === "COMPLETED").length})
        </Button>
      </div>

      {filteredAppointments.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Nenhum agendamento encontrado.</p>
        </div>
      ) : (
        <Table hoverable>
          <TableHeader>
            <TableRow>
              <TableHeaderCell icon={<BsPerson />}>Doador</TableHeaderCell>
              <TableHeaderCell icon={<BsCalendar3 />}>Data</TableHeaderCell>
              <TableHeaderCell icon={<BsClock />}>Hora</TableHeaderCell>
              <TableHeaderCell icon={<BsDroplet />}>
                Tipo Sanguíneo
              </TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Ações</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAppointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell bold>
                  {appointment.donorName ||
                    `Usuário ${appointment.userId.slice(0, 8)}`}
                </TableCell>
                <TableCell>
                  {appointment.appointmentDate || "Não agendado"}
                </TableCell>
                <TableCell>{appointment.appointmentTime || "-"}</TableCell>
                <TableCell>
                  <span className={styles.bloodTypeBadge}>
                    {appointment.bloodType}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(appointment.status)}>
                    {getStatusLabel(appointment.status)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className={styles.actions}>
                    {appointment.status === "PENDING" && (
                      <>
                        {onConfirm && (
                          <Button
                            variant="success"
                            size="small"
                            iconBefore={<BsCheckCircle />}
                            onClick={() => onConfirm(appointment)}
                            title="Confirmar agendamento"
                          >
                            Confirmar
                          </Button>
                        )}
                        {onCancel && (
                          <Button
                            variant="danger"
                            size="small"
                            iconBefore={<BsXCircle />}
                            onClick={() => onCancel(appointment)}
                            title="Cancelar agendamento"
                          >
                            Cancelar
                          </Button>
                        )}
                      </>
                    )}
                    {onViewDetails && (
                      <Button
                        variant="outline"
                        size="small"
                        iconBefore={<BsEye />}
                        onClick={() => onViewDetails(appointment)}
                        title="Ver detalhes"
                      >
                        Detalhes
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </TableCard>
  );
};
