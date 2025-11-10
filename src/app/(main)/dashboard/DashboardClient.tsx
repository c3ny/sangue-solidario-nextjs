"use client";

import { useState, useEffect } from "react";
import { BsCalendar3, BsDroplet, BsPersonCheck, BsClock } from "react-icons/bs";
import { AppointmentCalendar } from "@/features/Dashboard/components/AppointmentCalendar";
import { AppointmentTable } from "@/features/Dashboard/components/AppointmentTable";
import { BloodStockCard } from "@/features/Dashboard/components/BloodStockCard";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/Button";
import Loading from "@/components/Loading";
import {
  dashboardService,
  IAppointment,
  IDashboardStats,
} from "@/features/Dashboard/services/dashboard.service";
import { Bloodstock } from "@/lib/api";
import styles from "./styles.module.scss";

interface IDashboardClientProps {
  userId: string;
}

/**
 * Client component for Dashboard
 * Handles all client-side logic and state management
 */
export const DashboardClient = ({ userId }: IDashboardClientProps) => {
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [bloodStock, setBloodStock] = useState<Bloodstock[]>([]);
  const [stats, setStats] = useState<IDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [selectedAppointment, setSelectedAppointment] =
    useState<IAppointment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError("");

      try {
        const [appointmentsData, stockData, statsData] = await Promise.all([
          dashboardService.getAppointmentsByCompany(userId),
          dashboardService.getBloodStock(userId),
          dashboardService.getDashboardStats(userId),
        ]);

        setAppointments(appointmentsData);
        setBloodStock(stockData);
        setStats(statsData);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Erro ao carregar dados do dashboard"
        );
        console.error("Error fetching dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const [appointmentsData, stockData, statsData] = await Promise.all([
        dashboardService.getAppointmentsByCompany(userId),
        dashboardService.getBloodStock(userId),
        dashboardService.getDashboardStats(userId),
      ]);

      setAppointments(appointmentsData);
      setBloodStock(stockData);
      setStats(statsData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao atualizar dados do dashboard"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmAppointment = async (appointment: IAppointment) => {
    setIsProcessing(true);
    try {
      const success = await dashboardService.updateAppointmentStatus(
        appointment.registrationId,
        "CONFIRMED"
      );

      if (success) {
        await handleRefresh();
        setIsModalOpen(false);
        setSelectedAppointment(null);
      } else {
        setError("Erro ao confirmar agendamento");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao confirmar agendamento"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelAppointment = async (appointment: IAppointment) => {
    if (
      !confirm(
        "Tem certeza que deseja cancelar este agendamento? Esta ação não pode ser desfeita."
      )
    ) {
      return;
    }

    setIsProcessing(true);
    try {
      const success = await dashboardService.cancelAppointment(
        appointment.registrationId
      );

      if (success) {
        await handleRefresh();
        setIsModalOpen(false);
        setSelectedAppointment(null);
      } else {
        setError("Erro ao cancelar agendamento");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao cancelar agendamento"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleViewDetails = (appointment: IAppointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleAppointmentClick = (appointment: IAppointment) => {
    handleViewDetails(appointment);
  };

  if (isLoading) {
    return (
      <main className={styles.container}>
        <div className={styles.content}>
          <Loading />
        </div>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <div className={styles.headerSection}>
          <h1 className={styles.pageTitle}>Dashboard</h1>
          <p className={styles.pageSubtitle}>
            Gerencie agendamentos e acompanhe o estoque de sangue
          </p>
        </div>

        {error && (
          <div className={styles.errorMessage}>
            <p>{error}</p>
            <Button variant="outline" size="small" onClick={handleRefresh}>
              Tentar novamente
            </Button>
          </div>
        )}

        {/* Statistics Cards */}
        {stats && (
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <BsCalendar3 className={styles.statIcon} />
              <div className={styles.statContent}>
                <h3 className={styles.statValue}>{stats.totalAppointments}</h3>
                <p className={styles.statLabel}>Total de Agendamentos</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <BsClock className={styles.statIcon} />
              <div className={styles.statContent}>
                <h3 className={styles.statValue}>
                  {stats.pendingAppointments}
                </h3>
                <p className={styles.statLabel}>Pendentes</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <BsPersonCheck className={styles.statIcon} />
              <div className={styles.statContent}>
                <h3 className={styles.statValue}>
                  {stats.confirmedAppointments}
                </h3>
                <p className={styles.statLabel}>Confirmados</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <BsDroplet className={styles.statIcon} />
              <div className={styles.statContent}>
                <h3 className={styles.statValue}>{stats.totalBloodStock}</h3>
                <p className={styles.statLabel}>Total de Estoque</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className={styles.mainGrid}>
          {/* Blood Stock Section */}
          <div className={styles.bloodStockSection}>
            <BloodStockCard stocks={bloodStock} isLoading={isLoading} />
          </div>

          {/* Calendar Section */}
          <div className={styles.calendarSection}>
            <AppointmentCalendar
              appointments={appointments}
              onAppointmentClick={handleAppointmentClick}
            />
          </div>
        </div>

        {/* Appointments Table */}
        <AppointmentTable
          appointments={appointments}
          onConfirm={handleConfirmAppointment}
          onCancel={handleCancelAppointment}
          onViewDetails={handleViewDetails}
          isLoading={isLoading}
        />
      </div>

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedAppointment(null);
          }}
          title="Detalhes do Agendamento"
        >
          <div className={styles.modalContent}>
            <div className={styles.modalRow}>
              <strong>Doador:</strong>
              <span>
                {selectedAppointment.donorName ||
                  `Usuário ${selectedAppointment.userId.slice(0, 8)}`}
              </span>
            </div>
            <div className={styles.modalRow}>
              <strong>Data:</strong>
              <span>
                {selectedAppointment.appointmentDate || "Não agendado"}
              </span>
            </div>
            <div className={styles.modalRow}>
              <strong>Hora:</strong>
              <span>{selectedAppointment.appointmentTime || "-"}</span>
            </div>
            <div className={styles.modalRow}>
              <strong>Tipo Sanguíneo:</strong>
              <span className={styles.bloodTypeBadge}>
                {selectedAppointment.bloodType}
              </span>
            </div>
            <div className={styles.modalRow}>
              <strong>Status:</strong>
              <span>{selectedAppointment.status}</span>
            </div>
            {selectedAppointment.notes && (
              <div className={styles.modalRow}>
                <strong>Observações:</strong>
                <span>{selectedAppointment.notes}</span>
              </div>
            )}
            {selectedAppointment.donationContent && (
              <div className={styles.modalRow}>
                <strong>Descrição da Solicitação:</strong>
                <span>{selectedAppointment.donationContent}</span>
              </div>
            )}
            <div className={styles.modalActions}>
              {selectedAppointment.status === "PENDING" && (
                <>
                  <Button
                    variant="success"
                    onClick={() =>
                      handleConfirmAppointment(selectedAppointment)
                    }
                    isLoading={isProcessing}
                  >
                    Confirmar
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleCancelAppointment(selectedAppointment)}
                    isLoading={isProcessing}
                  >
                    Cancelar
                  </Button>
                </>
              )}
              <Button
                variant="outline"
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedAppointment(null);
                }}
              >
                Fechar
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </main>
  );
};
