"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  BsBuilding,
  BsPerson,
  BsEnvelope,
  BsTelephone,
  BsGeoAlt,
  BsLock,
  BsCalendar3,
  BsClock,
  BsDroplet,
  BsPlusCircle,
  BsFileEarmarkArrowDown,
} from "react-icons/bs";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
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
import { StockMovementModal } from "./_components/StockMovementModal";
import { getStockByCompany, Bloodstock, generateStockReport } from "@/lib/api";
import styles from "./styles.module.scss";

export const dynamic = "force-dynamic";

/**
 * Scheduled donation interface
 */
interface ScheduledDonation {
  name: string;
  date: string;
  time: string;
  bloodType: string;
}

const scheduledDonations: ScheduledDonation[] = [
  {
    name: "João Silva",
    date: "12/10/2024",
    time: "07:30",
    bloodType: "A+",
  },
  {
    name: "Tatiane Moscardi",
    date: "12/10/2024",
    time: "07:45",
    bloodType: "B+",
  },
  {
    name: "Sabrina Fernandes",
    date: "12/10/2024",
    time: "08:00",
    bloodType: "O-",
  },
  {
    name: "Diego Mendes",
    date: "12/10/2024",
    time: "09:00",
    bloodType: "AB+",
  },
];

/**
 * Calculate stock status based on quantity
 */
const getStockStatus = (quantity: number): "critical" | "low" | "good" => {
  if (quantity < 20) return "critical";
  if (quantity < 50) return "low";
  return "good";
};

/**
 * Calculate percentage (assuming max capacity of 100)
 */
const calculatePercentage = (quantity: number): number => {
  const maxCapacity = 100;
  return Math.min((quantity / maxCapacity) * 100, 100);
};

export default function HemocentrosPage() {
  const [stocks, setStocks] = useState<Bloodstock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [companyId, setCompanyId] = useState<string>("teste");
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  // TODO: Get companyId from authenticated user context
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError("");

      try {
        // TODO: Get companyId from user context
        // For demo purposes, you might want to hardcode a valid company ID
        // or get it from the logged-in user's profile
        const demoCompanyId = "your-company-id-here"; // Replace with actual company ID

        if (!demoCompanyId || demoCompanyId === "your-company-id-here") {
          setError(
            "ID da empresa não encontrado. Por favor, faça login novamente."
          );
          setIsLoading(false);
          return;
        }

        setCompanyId(demoCompanyId);

        // Fetch stock data
        const stockData = await getStockByCompany(demoCompanyId);

        setStocks(stockData);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Erro ao carregar dados do estoque. Tente novamente."
        );
        console.error("Error fetching stock data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleStockUpdate = async () => {
    // Refresh stock data after successful movement
    if (companyId) {
      try {
        const stockData = await getStockByCompany(companyId);
        setStocks(stockData);
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
          <h1 className={styles.pageTitle}>Painel do Hemocentro</h1>
          <p className={styles.pageSubtitle}>
            Gerencie informações e acompanhe o estoque de sangue
          </p>
        </div>

        <div className={styles.mainGrid}>
          <aside className={styles.profileCard}>
            <div className={styles.profileHeader}>
              <div className={styles.avatarWrapper}>
                <Image
                  src="/assets/images/users/colsan.jpg"
                  alt="Colsan Sorocaba"
                  className={styles.avatar}
                  width={120}
                  height={120}
                />
              </div>
              <h2 className={styles.institutionName}>Colsan Sorocaba</h2>
              <p className={styles.responsibleInfo}>
                Responsável: <span>Ricardo Souza</span>
              </p>
              <p className={styles.createdAt}>Perfil criado em: 01/01/2023</p>
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
                {error.includes("ID da empresa") && (
                  <p className={styles.errorHint}>
                    Nota: Este erro ocorre porque o ID da empresa não foi
                    configurado. Configure o companyId no código ou através do
                    contexto de autenticação.
                  </p>
                )}
              </div>
            )}

            {stocks.length === 0 && !error && (
              <div className={styles.emptyState}>
                <p>Nenhum estoque encontrado.</p>
              </div>
            )}

            <div className={styles.stockGrid}>
              {stocks.map((stock) => {
                const status = getStockStatus(stock.quantity);
                const percentage = calculatePercentage(stock.quantity);

                return (
                  <div key={stock.id} className={styles.stockCard}>
                    <div className={styles.stockHeader}>
                      <span className={styles.bloodType}>
                        {stock.bloodType}
                      </span>
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
          <div className={styles.sectionHeader}>
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
                  defaultValue="Colsan Sorocaba"
                  required
                />
                <Input
                  label="Responsável pela conta"
                  icon={BsPerson}
                  type="text"
                  id="nomeResponsavel"
                  name="nomeResponsavel"
                  defaultValue="Ricardo Souza"
                  required
                />
              </div>

              <div className={styles.formGrid}>
                <Input
                  label="Telefone"
                  icon={BsTelephone}
                  type="text"
                  id="telefone"
                  name="telefone"
                  defaultValue="(11) 98765-4321"
                  required
                />
                <Input
                  label="Endereço"
                  icon={BsGeoAlt}
                  type="text"
                  id="endereco"
                  name="endereco"
                  defaultValue="Av. Comendador Pereira Inácio, 564"
                  required
                />
              </div>

              <div className={styles.divider} />

              <div className={styles.formGrid}>
                <Input
                  label="Email de login"
                  icon={BsEnvelope}
                  type="email"
                  id="email"
                  name="email"
                  defaultValue="lolomoraes@gmail.com"
                  required
                />
                <Input
                  label="Senha"
                  icon={BsLock}
                  type="password"
                  id="password"
                  name="password"
                  defaultValue="123456"
                  required
                  showPasswordToggle
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

        <TableCard
          title="Doações Agendadas"
          icon={<BsCalendar3 />}
          className={styles.donationsSection}
        >
          <Table hoverable>
            <TableHeader>
              <TableRow>
                <TableHeaderCell icon={<BsPerson />}>Nome</TableHeaderCell>
                <TableHeaderCell icon={<BsCalendar3 />}>Data</TableHeaderCell>
                <TableHeaderCell icon={<BsClock />}>Hora</TableHeaderCell>
                <TableHeaderCell icon={<BsDroplet />}>
                  Tipo Sanguíneo
                </TableHeaderCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scheduledDonations.map((donation, index) => (
                <TableRow key={index}>
                  <TableCell bold>{donation.name}</TableCell>
                  <TableCell>{donation.date}</TableCell>
                  <TableCell>{donation.time}</TableCell>
                  <TableCell>
                    <span className={styles.bloodTypeBadge}>
                      {donation.bloodType}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
