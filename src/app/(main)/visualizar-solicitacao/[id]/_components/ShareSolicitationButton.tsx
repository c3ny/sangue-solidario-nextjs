"use client";

import { useState } from "react";
import { BsHeart, BsCheckCircle } from "react-icons/bs";
import { Button } from "@/components/Button";
import { logger } from "@/utils/logger";

interface ShareSolicitationButtonProps {
  solicitationId: string;
  solicitationName: string;
  bloodType: string;
  city?: string;
}

export function ShareSolicitationButton({
  solicitationId,
  solicitationName,
  bloodType,
  city,
}: ShareSolicitationButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = `${window.location.origin}/visualizar-solicitacao/${solicitationId}`;
    const locationPart = city ? ` em ${city}` : "";
    const text = `${solicitationName} precisa de doação de sangue ${bloodType}${locationPart}. Se você pode ajudar ou conhece alguém compatível, acesse:`;

    const shareData: ShareData = {
      title: `Ajude ${solicitationName}`,
      text,
      url,
    };

    try {
      if (
        typeof navigator !== "undefined" &&
        typeof navigator.share === "function" &&
        navigator.canShare?.(shareData) !== false
      ) {
        await navigator.share(shareData);
        return;
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }
      logger.error("Native share failed, falling back to clipboard:", error);
    }

    try {
      await navigator.clipboard.writeText(`${text} ${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      logger.error("Clipboard copy failed:", error);
      window.prompt("Copie o link da solicitação:", url);
    }
  };

  return (
    <Button
      variant="primary"
      iconBefore={copied ? <BsCheckCircle /> : <BsHeart />}
      onClick={handleShare}
    >
      {copied ? "Link copiado!" : "Quero Ajudar"}
    </Button>
  );
}
