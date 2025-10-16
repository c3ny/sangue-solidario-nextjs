"use client";

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
} from "react-icons/bs";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import styles from "./styles.module.scss";

/**
 * Blood stock data interface
 */
interface BloodStock {
  type: string;
  percentage: number;
  status: "critical" | "low" | "good";
}

/**
 * Scheduled donation interface
 */
interface ScheduledDonation {
  name: string;
  date: string;
  time: string;
  bloodType: string;
}

const bloodStockData: BloodStock[] = [
  { type: "A+", percentage: 70, status: "good" },
  { type: "A-", percentage: 45, status: "low" },
  { type: "B+", percentage: 85, status: "good" },
  { type: "B-", percentage: 60, status: "good" },
  { type: "AB+", percentage: 43, status: "low" },
  { type: "AB-", percentage: 55, status: "good" },
  { type: "O+", percentage: 72, status: "good" },
  { type: "O-", percentage: 35, status: "critical" },
];

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

export default function HemocentrosPage() {
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
              <BsDroplet className={styles.sectionIcon} />
              <h2 className={styles.sectionTitle}>Estoque de Sangue</h2>
            </div>
            <div className={styles.stockGrid}>
              {bloodStockData.map((stock) => (
                <div key={stock.type} className={styles.stockCard}>
                  <div className={styles.stockHeader}>
                    <span className={styles.bloodType}>{stock.type}</span>
                    <span className={styles.stockPercentage}>
                      {stock.percentage}%
                    </span>
                  </div>
                  <div className={styles.progressBar}>
                    <div
                      className={`${styles.progressFill} ${getStatusColor(
                        stock.status
                      )}`}
                      style={{ width: `${stock.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
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

        <section className={styles.donationsSection}>
          <div className={styles.sectionHeader}>
            <BsCalendar3 className={styles.sectionIcon} />
            <h2 className={styles.sectionTitle}>Doações Agendadas</h2>
          </div>
          <div className={styles.tableCard}>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>
                      <BsPerson className={styles.tableIcon} />
                      Nome
                    </th>
                    <th>
                      <BsCalendar3 className={styles.tableIcon} />
                      Data
                    </th>
                    <th>
                      <BsClock className={styles.tableIcon} />
                      Hora
                    </th>
                    <th>
                      <BsDroplet className={styles.tableIcon} />
                      Tipo Sanguíneo
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {scheduledDonations.map((donation, index) => (
                    <tr key={index}>
                      <td className={styles.donorName}>{donation.name}</td>
                      <td>{donation.date}</td>
                      <td>{donation.time}</td>
                      <td>
                        <span className={styles.bloodTypeBadge}>
                          {donation.bloodType}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
