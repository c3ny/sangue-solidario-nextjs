"use client";

import { useState, type PropsWithChildren } from "react";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";

interface Props extends PropsWithChildren {
  nonce?: string;
}

/**
 * Wraps children in an Emotion CacheProvider whose cache is configured with
 * the CSP nonce. MUI's styled/sx/styled-components propagate the nonce to
 * every <style> tag they inject, allowing us to drop 'unsafe-inline' from
 * style-src while keeping MUI functional.
 */
export function EmotionCacheProvider({ nonce, children }: Props) {
  const [cache] = useState(() =>
    createCache({
      key: "mui",
      nonce,
      prepend: true,
    })
  );

  return <CacheProvider value={cache}>{children}</CacheProvider>;
}
