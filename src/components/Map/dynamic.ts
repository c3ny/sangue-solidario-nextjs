"use client";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("./index"), { ssr: false });

export { Map };
