import { Metadata } from "next";
import { listActiveCompanies } from "@/features/Institution/services/company.service";
import { HemocentrosListClient } from "./HemocentrosListClient";

export const metadata: Metadata = {
  title: "Hemocentros — Sangue Solidário",
  description:
    "Encontre hemocentros e instituições parceiras para doar sangue ou agendar sua doação",
};

const PAGE_LIMIT = 100;

export default async function HemocentrosPage() {
  const { data: institutions } = await listActiveCompanies({ limit: PAGE_LIMIT });

  return <HemocentrosListClient initialInstitutions={institutions} />;
}
