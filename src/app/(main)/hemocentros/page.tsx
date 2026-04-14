"use client";

import Link from "next/link";
import {
  BsBuilding, BsPerson, BsEnvelope, BsCalendar3, BsClock,
  BsDroplet, BsFileEarmarkArrowDown, BsArrowDownUp,
  BsBoxArrowInDown, BsBoxArrowInUp, BsSticky, BsCalendarCheck,
  BsPencilSquare, BsMegaphone, BsPlusLg, BsArchive,
} from "react-icons/bs";
import { isFeatureEnabled } from "@/service/featureFlags/featureFlags.config";
import { CampaignDashboardCard } from "./_components/CampaignDashboardCard";
import { PiWarningOctagonFill } from "react-icons/pi";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { ToggleInput } from "@/components/ToggleInput";
import {
  Table, TableHeader, TableBody, TableRow,
  TableHeaderCell, TableCell, TableCard,
} from "@/components/Table";
import Loading from "@/components/Loading";
import { Tooltip } from "@/components/Tooltip";
import { StockMovementModal } from "./_components/StockMovementModal";
import { CalendarView } from "./_components/CalendarView";
import { generateStockReportAction } from "@/actions/bloodstock/bloodstock-actions";
import { useState } from "react";
import { ProfileClient } from "../perfil/ProfileClient";
import {
  formatDate, formatTime, getStockStatus,
  calculatePercentage, formatMovement, getMovementColorClass,
} from "@/utils/stock.utils";
import { getClientUrl } from "@/config/microservices";
import { maskEmail } from "@/utils/masks";
import { useHemocentroData } from "@/hooks/useHemocentroData";
import styles from "./styles.module.scss";

export default function HemocentrosPage() {
  const {
    stocks, stockHistory, currentCompany, appointments, campaigns, historicalCampaigns, user,
    isLoading, isLoadingHistory, isLoadingAppointments, isLoadingCampaigns, error,
    visibleHistoryCount, setVisibleHistoryCount, refreshAfterStockUpdate,
  } = useHemocentroData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportError, setReportError] = useState("");

  const getStatusColor = (status: string) => {
    if (status === "critical") return styles.critical;
    if (status === "low") return styles.low;
    if (status === "good") return styles.good;
    return "";
  };

  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    setReportError("");
    try {
      const csvContent = await generateStockReportAction();
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `estoque-report-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setReportError(err instanceof Error ? err.message : "Erro ao gerar relatório.");
    } finally {
      setIsGeneratingReport(false);
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.content}>

        <div className={styles.headerSection}>
          <h1 className={styles.pageTitle}>Painel do Hemocentro</h1>
          <p className={styles.pageSubtitle}>Gerencie informações e acompanhe o estoque de sangue</p>
        </div>

        <div className={styles.mainGrid}>

          {/* Card de perfil */}
          <aside className={styles.profileCard}>
            <div className={styles.profileHeader}>
              <div className={styles.avatarWrapper}>
                <ProfileClient
                  user={{
                    id: user?.id || "",
                    name: user?.name || "",
                    email: user?.email || "",
                    avatarPath: user?.avatarPath
                      ? (user.avatarPath.startsWith("http") ? user.avatarPath : getClientUrl("users", user.avatarPath))
                      : "",
                  }}
                />
              </div>
              <h2 className={styles.institutionName}>{currentCompany?.institutionName}</h2>
              <p className={styles.responsibleInfo}>Responsável: <span>{user?.name}</span></p>
            </div>
            <div className={styles.profileActions}>
              <Button variant="primary" fullWidth>Criar Solicitação</Button>
              <Link href="/hemocentros/perfil" className={styles.editProfileLink}>
                <BsPencilSquare />
                Editar Perfil Público
              </Link>
            </div>
          </aside>

          {/* Estoque */}
          <section className={styles.stockSection}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionHeaderTitle}>
                <BsDroplet className={styles.sectionIcon} />
                <h2 className={styles.sectionTitle}>Estoque de Sangue</h2>
              </div>
              <div className={styles.stockActions}>
                <Button variant="outline" onClick={handleGenerateReport}
                  isLoading={isGeneratingReport} iconBefore={<BsFileEarmarkArrowDown />}>
                  Exportar CSV
                </Button>
                <Button variant="primary" onClick={() => setIsModalOpen(true)}
                  iconBefore={<BsArrowDownUp />}>
                  Movimentar Estoque
                </Button>
              </div>
            </div>

            {(error || reportError) && (
              <div className={styles.errorMessage}>{error || reportError}</div>
            )}

            {isLoading ? (
              <div className={styles.loadingContainer}><Loading /></div>
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
                          <span className={styles.bloodType}>{stock.bloodType}</span>
                          {stock.quantity <= 5 && (
                            <Tooltip message="Estoque crítico (5 ou menos unidades)." position="bottom">
                              <PiWarningOctagonFill color="#dc3545" />
                            </Tooltip>
                          )}
                        </div>
                        <div className={styles.stockInfo}>
                          <span className={styles.stockQuantity}>{stock.quantity} unidades</span>
                          <span className={styles.stockPercentage}>{percentage.toFixed(0)}%</span>
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

        {/* Informações da instituição */}
        <section className={styles.infoSection}>
          <div className={styles.sectionHeaderTitle}>
            <BsBuilding className={styles.sectionIcon} />
            <h2 className={styles.sectionTitle}>Suas Informações</h2>
          </div>
          <div className={styles.formCard}>
            <form className={styles.form}>
              <div className={styles.formGrid}>
                <Input label="Nome da Instituição" icon={BsBuilding} type="text"
                  id="nomeInstituicao" name="nomeInstituicao"
                  defaultValue={currentCompany?.institutionName} required />
                <Input label="Responsável pela conta" icon={BsPerson} type="text"
                  id="nomeResponsavel" name="nomeResponsavel"
                  defaultValue={user?.name} required />
              </div>
              <div className={styles.formGrid}>
                <Input label="CNPJ" icon={BsEnvelope} type="text"
                  id="cnpj" name="cnpj" defaultValue={currentCompany?.cnpj} required />
                <Input label="CNES" icon={BsBuilding} type="text"
                  id="cnes" name="cnes" defaultValue={currentCompany?.cnes} required />
              </div>
              <div className={styles.divider} />
              <div className={styles.formGrid}>
                <ToggleInput label="Email de login" icon={BsEnvelope} type="email"
                  id="email" name="email" value={user?.email || ""}
                  maskFn={maskEmail} showRequired readOnly
                  toggleAriaLabel={{ show: "Mostrar email", hide: "Ocultar email" }} />
              </div>
              <div className={styles.formActions}>
                <Button variant="primary" type="submit" fullWidth>Salvar Alterações</Button>
              </div>
            </form>
          </div>
        </section>

        {/* Campanhas */}
        {isFeatureEnabled("campaigns") && (
          <section className={styles.campaignsSection}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionHeaderTitle}>
                <BsMegaphone className={styles.sectionIcon} />
                <h2 className={styles.sectionTitle}>Campanhas</h2>
              </div>
              <Link href="/campanhas/criar" className={styles.createCampaignLink}>
                <Button variant="primary" iconBefore={<BsPlusLg />}>
                  Criar campanha
                </Button>
              </Link>
            </div>
            {isLoadingCampaigns ? (
              <div className={styles.loadingContainer}><Loading /></div>
            ) : campaigns.length === 0 ? (
              <div className={styles.emptyState}>
                <p>
                  Nenhuma campanha ativa.{" "}
                  <Link href="/campanhas/criar" className={styles.emptyStateLink}>
                    Crie sua primeira campanha.
                  </Link>
                </p>
              </div>
            ) : (
              <div className={styles.campaignsListDashboard}>
                {campaigns.map((c) => (
                  <CampaignDashboardCard key={c.id} campaign={c} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* Histórico de campanhas */}
        {isFeatureEnabled("campaigns") && historicalCampaigns.length > 0 && (
          <section className={styles.historicalCampaignsSection}>
            <div className={styles.sectionHeaderTitle}>
              <BsArchive className={styles.sectionIcon} />
              <h2 className={styles.sectionTitle}>
                Histórico de campanhas
                <span className={styles.historyCount}>
                  ({historicalCampaigns.length})
                </span>
              </h2>
            </div>
            <p className={styles.historyHint}>
              Campanhas concluídas ou canceladas. Visualização disponível, edição bloqueada.
            </p>
            <div className={styles.campaignsListDashboard}>
              {historicalCampaigns.map((c) => (
                <CampaignDashboardCard key={c.id} campaign={c} />
              ))}
            </div>
          </section>
        )}

        {/* Agendamentos */}
        <section className={styles.appointmentsSection}>
          <div className={styles.sectionHeaderTitle}>
            <BsCalendarCheck className={styles.sectionIcon} />
            <h2 className={styles.sectionTitle}>Agendamentos</h2>
          </div>
          {isLoadingAppointments ? (
            <div className={styles.loadingContainer}><Loading /></div>
          ) : appointments.length === 0 ? (
            <div className={styles.emptyState}><p>Nenhum agendamento encontrado.</p></div>
          ) : (
            <CalendarView appointments={appointments} />
          )}
        </section>

        {/* Histórico de movimentações */}
        <TableCard title="Histórico de Movimentações" icon={<BsCalendar3 />}
          className={styles.donationsSection}>
          {isLoadingHistory ? (
            <div className={styles.loadingContainer}><Loading /></div>
          ) : stockHistory.length === 0 ? (
            <div className={styles.emptyState}><p>Nenhuma movimentação encontrada.</p></div>
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
                      <span className={`${styles.movementValue} ${styles[getMovementColorClass(movement.movement)] || ""}`}>
                        {formatMovement(movement.movement)}
                      </span>
                    </TableCell>
                    <TableCell>{movement.quantityBefore}</TableCell>
                    <TableCell>
                      <span className={styles.quantityAfter}>{movement.quantityAfter}</span>
                    </TableCell>
                    <TableCell>
                      {movement.batch?.batchCode
                        ? <span className={styles.notes}>{movement.batch.batchCode}</span>
                        : <span className={styles.noNotes}>—</span>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {stockHistory.length > visibleHistoryCount && (
            <div className={styles.seeMoreContainer}>
              <Button variant="outline"
                onClick={() => setVisibleHistoryCount((prev) => prev + 10)}
                className={styles.seeMoreButton}>
                Ver mais ({stockHistory.length - visibleHistoryCount} restantes)
              </Button>
            </div>
          )}
        </TableCard>
      </div>

      <StockMovementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        stocks={stocks}
        onSuccess={refreshAfterStockUpdate}
      />
    </main>
  );
}
