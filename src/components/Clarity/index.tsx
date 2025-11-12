"use client";

import { useEffect } from "react";
import Clarity from "@microsoft/clarity";

export function ClarityComponent() {
  useEffect(() => {
    const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;

    if (!clarityId) {
      console.warn(
        "Clarity ID not found. Please set NEXT_PUBLIC_CLARITY_ID in your environment variables."
      );
      return;
    }

    // Initialize Clarity
    Clarity.init(clarityId);
  }, []);

  return null;
}
