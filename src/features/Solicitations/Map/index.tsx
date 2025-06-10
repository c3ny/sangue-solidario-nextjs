"use client";

import GoogleMaps from "@/components/Map";
import { Solicitation } from "@/interfaces/Solicitations.interface";
import { useRouter } from "next/navigation";

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

  return <GoogleMaps markers={markers} />;
}
