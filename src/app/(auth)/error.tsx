"use client";

import { useEffect } from "react";
import { logger } from "@/utils/logger";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AuthError({ error, reset }: ErrorProps) {
  useEffect(() => {
    logger.error("Auth group error:", error);
  }, [error]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        gap: "1rem",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <h2 style={{ fontSize: "1.5rem", fontWeight: 600 }}>
        Algo deu errado
      </h2>
      <p style={{ color: "#666", maxWidth: "360px" }}>
        Ocorreu um erro inesperado. Por favor, tente novamente ou volte para a
        página inicial.
      </p>
      <div style={{ display: "flex", gap: "0.75rem" }}>
        <button
          onClick={reset}
          style={{
            padding: "0.5rem 1.25rem",
            background: "#c0392b",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          Tentar novamente
        </button>
        <a
          href="/"
          style={{
            padding: "0.5rem 1.25rem",
            background: "transparent",
            color: "#c0392b",
            border: "1px solid #c0392b",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: 500,
            textDecoration: "none",
          }}
        >
          Ir para o início
        </a>
      </div>
    </div>
  );
}
