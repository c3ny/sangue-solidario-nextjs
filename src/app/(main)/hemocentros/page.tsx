"use client";

import { useState, useEffect } from "react";
import {
  BsBuilding,
  BsPerson,
  BsEnvelope,
  BsCalendar3,
  BsClock,
  BsDroplet,
  BsPlusCircle,
  BsFileEarmarkArrowDown,
  BsArrowDownUp,
  BsBoxArrowInDown,
  BsBoxArrowInUp,
  BsSticky,
  BsCalendarCheck,
} from "react-icons/bs";
import { PiWarningOctagonFill } from "react-icons/pi";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { ToggleInput } from "@/components/ToggleInput";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
  TableCard,
} from "@/components/Table";
import Loading from "@/components/Loading";
import { Tooltip } from "@/components/Tooltip";
import { StockMovementModal } from "./_components/StockMovementModal";
import { CalendarView } from "./_components/CalendarView";
import {
  getStockByCompany,
  Bloodstock,
  generateStockReport,
  getCompanyByUserId,
  Company,
  getStockHistoryByCompany,
  BloodstockMovement,
  getAppointmentsByCompany,
} from "@/lib/api";
import { IAppointment } from "@/features/Institution/interfaces/Appointment.interface";
import styles from "./styles.module.scss";
import { getCurrentUserClient } from "@/utils/auth.client";
import { APIService } from "@/service/api/api";
import { maskEmail } from "@/utils/masks";
import { ProfileClient } from "../perfil/ProfileClient";
import {
  formatDate,
  formatTime,
  getStockStatus,
  calculatePercentage,
  formatMovement,
  getMovementColorClass,
} from "@/utils/stock.utils";

export const dynamic = "force-dynamic";

export default function HemocentrosPage() {
  const [stocks, setStocks] = useState<Bloodstock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [companyId, setCompanyId] = useState<string>("");
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [currentCompany, setCurrentCompany] = useState<Company | null>(null);
  const [stockHistory, setStockHistory] = useState<BloodstockMovement[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [visibleHistoryCount, setVisibleHistoryCount] = useState(10);
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(false);

  const user = getCurrentUserClient();
  const apiService = new APIService();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError("");

      try {
        const userId = user?.id;

        if (!userId) {
          setError(
            "ID do usuário não encontrado. Por favor, faça login novamente."
          );
          setIsLoading(false);
          return;
        }

        const companyData = await getCompanyByUserId(userId);

        setCompanyId(companyData.id);
        setCurrentCompany(companyData);
        const stockData = await getStockByCompany(companyData.id);

        setStocks(stockData);

        setIsLoadingHistory(true);
        try {
          const historyData = await getStockHistoryByCompany(companyData.id);
          setStockHistory(historyData);
        } catch (err) {
          console.error("Error fetching stock history:", err);
          setStockHistory([]);
        } finally {
          setIsLoadingHistory(false);
        }

        // Fetch appointments
        setIsLoadingAppointments(true);
        try {
          const appointmentsData = await getAppointmentsByCompany(
            companyData.id
          );

          setAppointments(appointmentsData);
        } catch (err) {
          console.error("Error fetching appointments:", err);
          setAppointments([]);
        } finally {
          setIsLoadingAppointments(false);
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Erro ao carregar dados. Tente novamente."
        );
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      fetchData();
    }
  }, [user?.id]);

  const handleStockUpdate = async () => {
    if (companyId) {
      try {
        const stockData = await getStockByCompany(companyId);
        setStocks(stockData);

        setIsLoadingHistory(true);
        try {
          const historyData = await getStockHistoryByCompany(companyId);
          setStockHistory(historyData);
          setVisibleHistoryCount(10); // Reset to initial count
        } catch (err) {
          console.error("Error refreshing stock history:", err);
        } finally {
          setIsLoadingHistory(false);
        }
      } catch (err) {
        console.error("Error refreshing stock data:", err);
      }
    }
  };

  const handleGenerateReport = async () => {
    if (!companyId) return;

    setIsGeneratingReport(true);
    setError("");

    try {
      await generateStockReport(companyId);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao gerar relatório. Tente novamente."
      );
      console.error("Error generating report:", err);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return styles.critical;
      case "low":
        return styles.low;
      case "good":
        return styles.good;
      default:
        return "";
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <div className={styles.headerSection}>
          <h1 className={styles.pageTitle}>Painel do Hemocentro</h1>
          <p className={styles.pageSubtitle}>
            Gerencie informações e acompanhe o estoque de sangue
          </p>
        </div>

        <div className={styles.mainGrid}>
          <aside className={styles.profileCard}>
            <div className={styles.profileHeader}>
              <div className={styles.avatarWrapper}>
                <ProfileClient
                  user={{
                    id: user?.id || "",
                    name: user?.name || "",
                    email: user?.email || "",
                    avatarPath: apiService.getUsersFileServiceUrl(
                      user?.avatarPath || ""
                    ),
                  }}
                />
              </div>
              <h2 className={styles.institutionName}>
                {currentCompany?.institutionName}
              </h2>
              <p className={styles.responsibleInfo}>
                Responsável: <span>{user?.name}</span>
              </p>
            </div>
            <div className={styles.profileActions}>
              <Button variant="primary" fullWidth>
                Criar Solicitação
              </Button>
            </div>
          </aside>

          <section className={styles.stockSection}>
            <div className={styles.sectionHeader}>
              <div className={styles.headerLeft}>
                <BsDroplet className={styles.sectionIcon} />
                <h2 className={styles.sectionTitle}>Estoque de Sangue</h2>
              </div>
              {companyId && (
                <div className={styles.headerActions}>
                  <Button
                    variant="outline"
                    size="small"
                    iconBefore={<BsFileEarmarkArrowDown />}
                    onClick={handleGenerateReport}
                    isLoading={isGeneratingReport}
                    className={styles.reportButton}
                  >
                    Gerar Relatório
                  </Button>
                  <Button
                    variant="primary"
                    size="small"
                    iconBefore={<BsPlusCircle />}
                    onClick={() => setIsModalOpen(true)}
                    className={styles.addStockButton}
                  >
                    Adicionar Movimentação
                  </Button>
                </div>
              )}
            </div>

            {error && (
              <div className={styles.errorMessage}>
                <p>{error}</p>
              </div>
            )}

            {stocks.length === 0 && !error && !isLoading && (
              <div className={styles.emptyState}>
                <p>Nenhum estoque encontrado.</p>
              </div>
            )}

            <div className={styles.stockGrid}>
              {stocks
                .sort((a, b) => b.quantity - a.quantity)
                .map((stock) => {
                  const status = getStockStatus(stock.quantity);
                  const percentage = calculatePercentage(stock.quantity);

                  return (
                    <div key={stock.id} className={styles.stockCard}>
                      <div className={styles.stockHeader}>
                        <div className={styles.titleStockSection}>
                          <span className={styles.bloodType}>
                            {stock.blood_type}
                          </span>
                          {stock.quantity <= 5 && (
                            <Tooltip
                              message="Estoque baixo! Este tipo sanguíneo está com quantidade crítica (5 unidades ou menos)."
                              position="bottom"
                            >
                              <PiWarningOctagonFill color="#dc3545" />
                            </Tooltip>
                          )}
                        </div>
                        <div className={styles.stockInfo}>
                          <span className={styles.stockQuantity}>
                            {stock.quantity} unidades
                          </span>
                          <span className={styles.stockPercentage}>
                            {percentage.toFixed(0)}%
                          </span>
                        </div>
                      </div>
                      <div className={styles.progressBar}>
                        <div
                          className={`${styles.progressFill} ${getStatusColor(
                            status
                          )}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </section>
        </div>

        <section className={styles.infoSection}>
          <div className={styles.sectionHeaderTitle}>
            <BsBuilding className={styles.sectionIcon} />
            <h2 className={styles.sectionTitle}>Suas Informações</h2>
          </div>
          <div className={styles.formCard}>
            <form className={styles.form}>
              <div className={styles.formGrid}>
                <Input
                  label="Nome da Instituição"
                  icon={BsBuilding}
                  type="text"
                  id="nomeInstituicao"
                  name="nomeInstituicao"
                  defaultValue={currentCompany?.institutionName}
                  required
                />
                <Input
                  label="Responsável pela conta"
                  icon={BsPerson}
                  type="text"
                  id="nomeResponsavel"
                  name="nomeResponsavel"
                  defaultValue={user?.name}
                  required
                />
              </div>

              <div className={styles.formGrid}>
                <Input
                  label="CNPJ"
                  icon={BsEnvelope}
                  type="text"
                  id="cnpj"
                  name="cnpj"
                  defaultValue={currentCompany?.cnpj}
                  required
                />
                <Input
                  label="CNES"
                  icon={BsBuilding}
                  type="text"
                  id="cnes"
                  name="cnes"
                  defaultValue={currentCompany?.cnes}
                  required
                />
              </div>

              <div className={styles.divider} />

              <div className={styles.formGrid}>
                <ToggleInput
                  label="Email de login"
                  icon={BsEnvelope}
                  type="email"
                  id="email"
                  name="email"
                  value={user?.email || ""}
                  maskFn={maskEmail}
                  showRequired
                  readOnly
                  toggleAriaLabel={{
                    show: "Mostrar email",
                    hide: "Ocultar email",
                  }}
                />
              </div>

              <div className={styles.formActions}>
                <Button variant="primary" type="submit" fullWidth>
                  Salvar Alterações
                </Button>
              </div>
            </form>
          </div>
        </section>

        <section className={styles.appointmentsSection}>
          <div className={styles.sectionHeaderTitle}>
            <BsCalendarCheck className={styles.sectionIcon} />
            <h2 className={styles.sectionTitle}>Agendamentos</h2>
          </div>

          {isLoadingAppointments ? (
            <div className={styles.loadingContainer}>
              <Loading />
            </div>
          ) : appointments.length === 0 ? (
            <div className={styles.emptyState}>
              <p>Nenhum agendamento encontrado.</p>
            </div>
          ) : (
            <CalendarView appointments={appointments} />
          )}
        </section>

        <TableCard
          title="Histórico de Movimentações"
          icon={<BsCalendar3 />}
          className={styles.donationsSection}
        >
          {isLoadingHistory ? (
            <div className={styles.loadingContainer}>
              <Loading />
            </div>
          ) : stockHistory.length === 0 ? (
            <div className={styles.emptyState}>
              <p>Nenhuma movimentação encontrada.</p>
            </div>
          ) : (
            <Table hoverable>
              <TableHeader>
                <TableRow>
                  <TableHeaderCell icon={<BsPerson />}>
                    Responsável
                  </TableHeaderCell>
                  <TableHeaderCell icon={<BsCalendar3 />}>Data</TableHeaderCell>
                  <TableHeaderCell icon={<BsClock />}>Hora</TableHeaderCell>
                  <TableHeaderCell icon={<BsDroplet />}>
                    Tipo Sanguíneo
                  </TableHeaderCell>
                  <TableHeaderCell icon={<BsArrowDownUp />}>
                    Movimentação
                  </TableHeaderCell>
                  <TableHeaderCell icon={<BsBoxArrowInDown />}>
                    Qtd. Antes
                  </TableHeaderCell>
                  <TableHeaderCell icon={<BsBoxArrowInUp />}>
                    Qtd. Depois
                  </TableHeaderCell>
                  <TableHeaderCell icon={<BsSticky />}>
                    Observações
                  </TableHeaderCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stockHistory.slice(0, visibleHistoryCount).map((movement) => (
                  <TableRow key={movement.id}>
                    <TableCell bold>{movement.actionBy || "Sistema"}</TableCell>
                    <TableCell>
                      {formatDate(movement.actionDate || movement.updateDate)}
                    </TableCell>
                    <TableCell>
                      {formatTime(movement.actionDate || movement.updateDate)}
                    </TableCell>
                    <TableCell>
                      <span className={styles.bloodTypeBadge}>
                        {movement.bloodstock?.blood_type || "N/A"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`${styles.movementValue} ${
                          styles[getMovementColorClass(movement.movement)] || ""
                        }`}
                      >
                        {formatMovement(movement.movement)}
                      </span>
                    </TableCell>
                    <TableCell>{movement.quantityBefore}</TableCell>
                    <TableCell>
                      <span className={styles.quantityAfter}>
                        {movement.quantityAfter}
                      </span>
                    </TableCell>
                    <TableCell>
                      {movement.notes ? (
                        <span className={styles.notes}>{movement.notes}</span>
                      ) : (
                        <span className={styles.noNotes}>—</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {stockHistory.length > visibleHistoryCount && (
            <div className={styles.seeMoreContainer}>
              <Button
                variant="outline"
                onClick={() => setVisibleHistoryCount((prev) => prev + 10)}
                className={styles.seeMoreButton}
              >
                Ver mais ({stockHistory.length - visibleHistoryCount} restantes)
              </Button>
            </div>
          )}
        </TableCard>
      </div>

      {companyId && (
        <StockMovementModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          stocks={stocks}
          companyId={companyId}
          onSuccess={handleStockUpdate}
        />
      )}
    </main>
  );
}
