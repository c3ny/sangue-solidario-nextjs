import { Metadata } from "next";
import AppointmentPage from "./_components/AppointmentPage";

export const metadata: Metadata = {
  title: "Agendamento de Doação - Sangue Solidário",
  description: "Agende sua doação de sangue",
};

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function Appointment({ params }: PageProps) {
  const { slug } = await params;

  return <AppointmentPage slug={slug} />;
}
