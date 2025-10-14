"use client";
import { Solicitation } from "@/features/Solicitations/interfaces/Solicitations.interface";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

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
      onClick: () => router.push(`/visualizar-solicitacao/${solicitation.id}`),
    };
  });

  return <Map markers={markers} />;
}
