"use client";
import { Solicitation } from "@/features/Solicitations/interfaces/Solicitations.interface";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Loading from "@/components/Loading";

const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => <Loading width="100%" height="600px" />,
});

export interface ISolicitationMapSectionProps {
  solicitations: Solicitation[];
}

export default function SolicitationMapSection({
  solicitations,
}: ISolicitationMapSectionProps) {
  const router = useRouter();

  const markers = solicitations.map((solicitation) => {
    return {
      location: solicitation.location,
      tooltip: solicitation.name,
      onClick: () => router.push(`/visualizar-solicitacao/${solicitation.id}`),
    };
  });

  return <Map markers={markers} />;
}
