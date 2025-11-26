"use client";
import Script from "next/script";
import { useLayoutEffect } from "react";

export default function VLibrasNext() {
  const init = () => {
    new (window as any).VLibras.Widget("https://vlibras.gov.br/app");
  };

  useLayoutEffect(() => {
    if (window && window.onload) {
      // @ts-expect-error window.onload is a valid attribute for the window object because of the VLibras plugin injected this new method
      window.onload();
    }
  }, []);

  return (
    <>
      {/* @ts-expect-error VW is a valid attribute for the div element because of the VLibras plugin */}
      <div vw="true" className="enabled">
        <div vw-access-button="true" className="active"></div>
        <div vw-plugin-wrapper="true">
          <div className="vw-plugin-top-wrapper"></div>
        </div>
      </div>
      <Script
        src="https://vlibras.gov.br/app/vlibras-plugin.js"
        onLoad={init}
      />
    </>
  );
}
