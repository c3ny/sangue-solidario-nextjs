"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    VLibras?: {
      Widget: new (rootPath: string) => unknown;
    };
  }
}

interface VLibrasNextProps {
  nonce?: string;
}

const VLIBRAS_SCRIPT_ID = "vlibras-plugin-script";
const VLIBRAS_SRC = "https://vlibras.gov.br/app/vlibras-plugin.js";
const VLIBRAS_ROOT_PATH = "https://vlibras.gov.br/app";

export default function VLibrasNext({ nonce }: VLibrasNextProps = {}) {
  useEffect(() => {
    const initWidget = () => {
      if (typeof window === "undefined" || !window.VLibras?.Widget) return;
      try {
        new window.VLibras.Widget(VLIBRAS_ROOT_PATH);
      } catch {
        // Widget may already be bound to the DOM container — ignore
      }
    };

    // Script may already exist in the DOM from a previous mount (SPA nav).
    // In that case, just re-init the widget against the freshly mounted DOM.
    const existing = document.getElementById(VLIBRAS_SCRIPT_ID);
    if (existing) {
      initWidget();
      return;
    }

    const script = document.createElement("script");
    script.id = VLIBRAS_SCRIPT_ID;
    script.src = VLIBRAS_SRC;
    script.async = true;
    if (nonce) script.nonce = nonce;
    script.onload = initWidget;
    document.body.appendChild(script);
  }, [nonce]);

  return (
    // @ts-expect-error VLibras custom HTML attributes
    <div vw="true" className="enabled">
      <div vw-access-button="true" className="active"></div>
      <div vw-plugin-wrapper="true">
        <div className="vw-plugin-top-wrapper"></div>
      </div>
    </div>
  );
}
