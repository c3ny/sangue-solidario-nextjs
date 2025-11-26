import { Metadata } from "next";
import AppointmentPage from "./_components/AppointmentPage";

export const metadata: Metadata = {
  title: "Agendamento de Doação - Sangue Solidário",
  description: "Agende sua doação de sangue",
};

interface PageProps {
  params: {
    username: string;
  };
}

export default function Appointment({ params }: PageProps) {
  return <AppointmentPage username={params.username} />;
}
