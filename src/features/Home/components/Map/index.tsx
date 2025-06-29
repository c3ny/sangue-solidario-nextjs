"use client";
import GoogleMaps from "@/components/Map";
import styles from "./styles.module.scss";
import { Solicitation } from "@/features/Solicitations/interfaces/Solicitations.interface";
import { useMemo } from "react";
import { useRouter } from "next/navigation";

export interface IMapSectionProps {
  solicitations: Solicitation[];
}

export const MapSection = ({ solicitations }: IMapSectionProps) => {
  const router = useRouter();
  const markers = solicitations.map((solicitation) => ({
    location: solicitation.location,
    onClick: () => {
      router.push(`/visualizar-solicitacao/${solicitation.id}`);
    },
  }));

  const quantity = useMemo(() => {
    const quantityOfHandlers = solicitations.reduce(
      (prev, next) => (next.user.type === "handler" ? prev + 1 : prev),
      0
    );

    const quantityOfUsers = solicitations.reduce(
      (prev, next) => (next.user.type === "user" ? prev + 1 : prev),
      0
    );

    return {
      handlersQuantity: quantityOfHandlers,
      usersQuantity: quantityOfUsers,
    };
  }, [solicitations]);

  return (
    <div>
      <div>
        <h2>
          {quantity.handlersQuantity > 0 &&
            `${quantity.handlersQuantity} hemocentros`}
          <span>
            {quantity.usersQuantity > 0 &&
              ` e ${quantity.usersQuantity} pessoas precisam da sua ajuda!`}
          </span>
        </h2>
        <div className={styles.mapContainer}>
          <GoogleMaps markers={markers} />
        </div>
      </div>
    </div>
  );
};
