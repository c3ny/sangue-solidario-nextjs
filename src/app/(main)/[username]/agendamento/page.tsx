import { Metadata } from "next";
import AppointmentPage from "./_components/AppointmentPage";

export const metadata: Metadata = {
  title: "Agendamento de Doação - Sangue Solidário",
  description: "Agende sua doação de sangue",
};

interface PageProps {
  params: Promise<{
    username: string;
  }>;
}

export default async function Appointment({ params }: PageProps) {
  const { username } = await params;

  return <AppointmentPage username={username} />;
}