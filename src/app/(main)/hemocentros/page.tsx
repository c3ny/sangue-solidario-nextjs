"use client";

import { useState, useEffect } from "react";
import {
  BsBuilding,
  BsPerson,
  BsEnvelope,
  BsCalendar3,
  BsClock,
  BsDroplet,
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
  getCompanyByUserId,
  getStock,
  getStockHistory,
  generateStockReport,
  getAppointmentsByCompany,
  BloodstockItem,
  BloodstockMovement,
  Company,
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
  const [stocks, setStocks] = useState<BloodstockItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [currentCompany, setCurrentCompany] = useState<Company | null>(null);
  const [stockHistory, setStockHistory] = useState<BloodstockMovement[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [visibleHistoryCount, setVisibleHistoryCount] = useState(10);
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(false);

  const user = getCurrentUserClient();
  const apiService = new APIService();

  // ---------------------------------------------------------------------------
  // Carregamento inicial
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (!user?.id) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError("");

      try {
        // 1. Empresa (user-service)
        const companyData = await getCompanyByUserId(user.id);
        setCurrentCompany(companyData);

        // 2. Estoque atual — companyId vem do JWT no back
        const stockData = await getStock();
        setStocks(stockData);

        // 3. Histórico
        setIsLoadingHistory(true);
        getStockHistory()
          .then(setStockHistory)
          .catch((err) => {
            console.error("Erro ao buscar histórico:", err);
            setStockHistory([]);
          })
          .finally(() => setIsLoadingHistory(false));

        // 4. Agendamentos (mock por enquanto)
        setIsLoadingAppointments(true);
        getAppointmentsByCompany(companyData.id)
          .then(setAppointments)
          .catch((err) => {
            console.error("Erro ao buscar agendamentos:", err);
            setAppointments([]);
          })
          .finally(() => setIsLoadingAppointments(false));
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Erro ao carregar dados. Tente novamente."
        );
        console.error("Erro ao carregar dados:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  // ---------------------------------------------------------------------------
  // Callback de sucesso do modal — recebe o estoque já atualizado da resposta
  // ---------------------------------------------------------------------------

  const handleStockUpdateSuccess = async (updatedStocks: BloodstockItem[]) => {
    // O back retorna o estoque atualizado diretamente no response do batchEntry/batchExit
    setStocks(updatedStocks);

    // Recarrega histórico em paralelo
    setIsLoadingHistory(true);
    try {
      const history = await getStockHistory();
      setStockHistory(history);
      setVisibleHistoryCount(10);
    } catch (err) {
      console.error("Erro ao recarregar histórico:", err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Relatório
  // ---------------------------------------------------------------------------

  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    setError("");
    try {
      await generateStockReport();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao gerar relatório."
      );
    } finally {
      setIsGeneratingReport(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Helpers de UI
  // ---------------------------------------------------------------------------

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical": return styles.critical;
      case "low":      return styles.low;
      case "good":     return styles.good;
      default:         return "";
    }
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

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
          {/* ---------------------------------------------------------------- */}
          {/* Card de perfil */}
          {/* ---------------------------------------------------------------- */}
          <aside className={styles.profileCard}>
            <div className={styles.profileHeader}>
              <div className={styles.avatarWrapper}>
                <ProfileClient
                  user={{
                    id: user?.id || "",
                    name: user?.name || "",
                    email: user?.email || "",
                    avatarPath: user?.avatarPath
                    ? apiService.getUsersFileServiceUrl(user.avatarPath)
                    : "",
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

          {/* ---------------------------------------------------------------- */}
          {/* Estoque */}
          {/* ---------------------------------------------------------------- */}
          <section className={styles.stockSection}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionHeaderTitle}>
                <BsDroplet className={styles.sectionIcon} />
                <h2 className={styles.sectionTitle}>Estoque de Sangue</h2>
              </div>
              <div className={styles.stockActions}>
                <Button
                  variant="outline"
                  onClick={handleGenerateReport}
                  isLoading={isGeneratingReport}
                  iconBefore={<BsFileEarmarkArrowDown />}
                >
                  Exportar CSV
                </Button>
                <Button
                  variant="primary"
                  onClick={() => setIsModalOpen(true)}
                  iconBefore={<BsArrowDownUp />}
                >
                  Movimentar Estoque
                </Button>
              </div>
            </div>

            {error && (
              <div className={styles.errorMessage}>{error}</div>
            )}

            {isLoading ? (
              <div className={styles.loadingContainer}>
                <Loading />
              </div>
            ) : (
              <div className={styles.stockGrid}>
                {stocks.map((stock) => {
                  const status = getStockStatus(stock.quantity);
                  const percentage = calculatePercentage(stock.quantity);
                  return (
                    <div key={stock.id} className={styles.stockCard}>
                      <div className={styles.stockHeader}>
                        <div className={styles.stockType}>
                          <BsDroplet className={styles.dropletIcon} />
                          <span className={styles.bloodType}>
                            {stock.bloodType}
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
                          className={`${styles.progressFill} ${getStatusColor(status)}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Informações da instituição */}
        {/* ------------------------------------------------------------------ */}
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
                  toggleAriaLabel={{ show: "Mostrar email", hide: "Ocultar email" }}
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

        {/* ------------------------------------------------------------------ */}
        {/* Agendamentos */}
        {/* ------------------------------------------------------------------ */}
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

        {/* ------------------------------------------------------------------ */}
        {/* Histórico de movimentações */}
        {/* ------------------------------------------------------------------ */}
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
                  <TableHeaderCell icon={<BsPerson />}>Responsável</TableHeaderCell>
                  <TableHeaderCell icon={<BsCalendar3 />}>Data</TableHeaderCell>
                  <TableHeaderCell icon={<BsClock />}>Hora</TableHeaderCell>
                  <TableHeaderCell icon={<BsDroplet />}>Tipo Sanguíneo</TableHeaderCell>
                  <TableHeaderCell icon={<BsArrowDownUp />}>Movimentação</TableHeaderCell>
                  <TableHeaderCell icon={<BsBoxArrowInDown />}>Qtd. Antes</TableHeaderCell>
                  <TableHeaderCell icon={<BsBoxArrowInUp />}>Qtd. Depois</TableHeaderCell>
                  <TableHeaderCell icon={<BsSticky />}>Lote</TableHeaderCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stockHistory.slice(0, visibleHistoryCount).map((movement) => (
                  <TableRow key={movement.id}>
                    <TableCell bold>{movement.actionBy || "Sistema"}</TableCell>
                    <TableCell>{formatDate(movement.actionDate)}</TableCell>
                    <TableCell>{formatTime(movement.actionDate)}</TableCell>
                    <TableCell>
                      <span className={styles.bloodTypeBadge}>
                        {movement.bloodstock?.bloodType || "N/A"}
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
                      {movement.batch?.batchCode ? (
                        <span className={styles.notes}>
                          {movement.batch.batchCode}
                        </span>
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

      {/* -------------------------------------------------------------------- */}
      {/* Modal de movimentação */}
      {/* -------------------------------------------------------------------- */}
      <StockMovementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        stocks={stocks}
        onSuccess={handleStockUpdateSuccess}
      />
    </main>
  );
}