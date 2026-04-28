"use client";

import Link from "next/link";
import {
  BsBuilding, BsPerson, BsCalendar3, BsClock,
  BsDroplet, BsFileEarmarkArrowDown, BsArrowDownUp,
  BsBoxArrowInDown, BsBoxArrowInUp, BsSticky, BsCalendarCheck,
  BsPencilSquare, BsMegaphone, BsPlusLg, BsArchive,
  BsCheckCircleFill, BsXCircleFill,
} from "react-icons/bs";
import { isFeatureEnabled } from "@/service/featureFlags/featureFlags.config";
import { CampaignDashboardCard } from "../_components/CampaignDashboardCard";
import { PiWarningOctagonFill } from "react-icons/pi";
import { Button } from "@/components/Button";
import {
  Table, TableHeader, TableBody, TableRow,
  TableHeaderCell, TableCell, TableCard,
} from "@/components/Table";
import Loading from "@/components/Loading";
import { Tooltip } from "@/components/Tooltip";
import { StockMovementModal } from "../_components/StockMovementModal";
import { CalendarView } from "../_components/CalendarView";
import { AppointmentsList } from "../_components/AppointmentsList";
import { generateStockReportAction } from "@/actions/bloodstock/bloodstock-actions";
import { useState } from "react";
import { ProfileClient } from "../../perfil/ProfileClient";
import {
  formatDate, formatTime, getStockStatus,
  calculatePercentage, formatMovement, getMovementColorClass,
} from "@/utils/stock.utils";
import { getClientUrl } from "@/config/microservices";
import { resolveAvatarUrl } from "@/utils/avatar";
import { maskCNPJ, maskCEP, maskPhone } from "@/utils/masks";
import { useHemocentroData } from "@/hooks/useHemocentroData";
import { IInstitution, InstitutionType } from "@/features/Institution/interfaces/Institution.interface";
import styles from "./styles.module.scss";

const INSTITUTION_TYPE_LABELS: Record<InstitutionType, string> = {
  [InstitutionType.HOSPITAL]: "Hospital",
  [InstitutionType.BLOOD_CENTER]: "Hemocentro",
  [InstitutionType.CLINIC]: "Clínica",
};

function formatAddress(location: IInstitution["location"]): string {
  const parts = [
    location.address,
    location.neighborhood,
    location.city && location.uf ? `${location.city} - ${location.uf}` : location.city || location.uf,
    location.zipcode ? maskCEP(location.zipcode) : "",
  ].filter((p): p is string => Boolean(p && p.trim()));
  return parts.join(", ");
}

export default function HemocentrosPage() {
  const {
    stocks, stockHistory, currentCompany, institution, appointments, campaigns, historicalCampaigns, user,
    isLoading, isLoadingHistory, isLoadingAppointments, isLoadingCampaigns, error,
    visibleHistoryCount, setVisibleHistoryCount, refreshAfterStockUpdate, refreshCampaigns,
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
                    personType: "COMPANY",
                    avatarPath: resolveAvatarUrl(user?.avatarPath, getClientUrl("users", "")),
                  }}
                />
              </div>
              <h2 className={styles.institutionName}>
                {institution?.institutionName || currentCompany?.institutionName || "—"}
              </h2>
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
          <div className={styles.infoSectionHeader}>
            <div className={styles.sectionHeaderTitle}>
              <BsBuilding className={styles.sectionIcon} />
              <h2 className={styles.sectionTitle}>Suas Informações</h2>
            </div>
          </div>

          <div className={styles.infoCard}>
            {/* Dados da empresa */}
            <div className={styles.infoGroup}>
              <h3 className={styles.infoGroupTitle}>Dados da instituição</h3>
              <dl className={styles.infoGrid}>
                <div className={styles.infoRow}>
                  <dt className={styles.infoLabel}>Nome</dt>
                  <dd className={styles.infoValue}>
                    {institution?.institutionName || currentCompany?.institutionName || "—"}
                  </dd>
                </div>
                <div className={styles.infoRow}>
                  <dt className={styles.infoLabel}>Tipo</dt>
                  <dd className={styles.infoValue}>
                    {institution?.type ? INSTITUTION_TYPE_LABELS[institution.type] ?? institution.type : "—"}
                  </dd>
                </div>
                <div className={styles.infoRow}>
                  <dt className={styles.infoLabel}>CNPJ</dt>
                  <dd className={styles.infoValue}>
                    {institution?.cnpj
                      ? maskCNPJ(institution.cnpj)
                      : currentCompany?.cnpj
                      ? maskCNPJ(currentCompany.cnpj)
                      : "—"}
                  </dd>
                </div>
                <div className={styles.infoRow}>
                  <dt className={styles.infoLabel}>CNES</dt>
                  <dd className={styles.infoValue}>
                    {institution?.cnes || currentCompany?.cnes || "—"}
                  </dd>
                </div>
                {institution?.description && (
                  <div className={`${styles.infoRow} ${styles.infoFullWidth}`}>
                    <dt className={styles.infoLabel}>Descrição</dt>
                    <dd className={styles.infoValue}>{institution.description}</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Contato */}
            <div className={styles.infoGroup}>
              <h3 className={styles.infoGroupTitle}>Contato</h3>
              <dl className={styles.infoGrid}>
                <div className={styles.infoRow}>
                  <dt className={styles.infoLabel}>Telefone</dt>
                  <dd className={styles.infoValue}>
                    {institution?.contact?.phone ? maskPhone(institution.contact.phone) : "—"}
                  </dd>
                </div>
                <div className={styles.infoRow}>
                  <dt className={styles.infoLabel}>WhatsApp</dt>
                  <dd className={styles.infoValue}>
                    {institution?.contact?.whatsapp ? maskPhone(institution.contact.whatsapp) : "—"}
                  </dd>
                </div>
                <div className={styles.infoRow}>
                  <dt className={styles.infoLabel}>E-mail público</dt>
                  <dd className={styles.infoValue}>{institution?.contact?.email || "—"}</dd>
                </div>
                <div className={styles.infoRow}>
                  <dt className={styles.infoLabel}>Site</dt>
                  <dd className={styles.infoValue}>
                    {institution?.contact?.website ? (
                      <a
                        href={institution.contact.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.infoLink}
                      >
                        {institution.contact.website}
                      </a>
                    ) : (
                      "—"
                    )}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Endereço */}
            <div className={styles.infoGroup}>
              <h3 className={styles.infoGroupTitle}>Endereço</h3>
              <p className={styles.infoAddress}>
                {institution?.location && formatAddress(institution.location) ? formatAddress(institution.location) : "—"}
              </p>
            </div>

            {/* Responsável */}
            <div className={styles.infoGroup}>
              <h3 className={styles.infoGroupTitle}>Responsável pela conta</h3>
              <dl className={styles.infoGrid}>
                <div className={styles.infoRow}>
                  <dt className={styles.infoLabel}>Nome</dt>
                  <dd className={styles.infoValue}>{user?.name || "—"}</dd>
                </div>
                <div className={styles.infoRow}>
                  <dt className={styles.infoLabel}>E-mail de login</dt>
                  <dd className={styles.infoValue}>{user?.email || "—"}</dd>
                </div>
              </dl>
            </div>

            {/* Configurações */}
            <div className={styles.infoGroup}>
              <h3 className={styles.infoGroupTitle}>Configurações</h3>
              <ul className={styles.infoFlagList}>
                <li className={styles.infoFlagItem}>
                  {institution?.acceptsDonations ? (
                    <BsCheckCircleFill className={styles.flagYes} />
                  ) : (
                    <BsXCircleFill className={styles.flagNo} />
                  )}
                  <span>Aceita doações presenciais</span>
                </li>
                <li className={styles.infoFlagItem}>
                  {institution?.acceptsScheduling ? (
                    <BsCheckCircleFill className={styles.flagYes} />
                  ) : (
                    <BsXCircleFill className={styles.flagNo} />
                  )}
                  <span>Aceita agendamentos online</span>
                </li>
              </ul>
            </div>

            {/* Horários */}
            {institution?.schedule && institution.schedule.length > 0 && (
              <div className={styles.infoGroup}>
                <h3 className={styles.infoGroupTitle}>Horário de funcionamento</h3>
                <ul className={styles.infoScheduleList}>
                  {institution.schedule.map((day) => (
                    <li key={day.dayOfWeek} className={styles.infoScheduleItem}>
                      <span className={styles.infoScheduleDay}>{day.dayOfWeek}</span>
                      <span className={styles.infoScheduleHours}>
                        {day.isOpen ? `${day.openTime} — ${day.closeTime}` : "Fechado"}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
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
                  <CampaignDashboardCard key={c.id} campaign={c} onMutated={refreshCampaigns} />
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
                <CampaignDashboardCard key={c.id} campaign={c} onMutated={refreshCampaigns} />
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
            <>
              <CalendarView appointments={appointments} />
              <AppointmentsList appointments={appointments} />
            </>
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
