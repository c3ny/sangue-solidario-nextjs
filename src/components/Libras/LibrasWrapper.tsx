"use client";

import dynamic from "next/dynamic";

const Libras = dynamic(() => import("./index"), {
  ssr: false,
  loading: () => null,
});

export default function LibrasWrapper() {
  return <Libras />;
}
