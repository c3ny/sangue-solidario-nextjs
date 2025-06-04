"use client";

import { useEffect, useRef } from "react";
import sanitize from "sanitize-html";
export interface IPostContentHandler {
  content: string;
}

export default function PostContentHandler({ content }: IPostContentHandler) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = sanitize(content);
    }
  }, [ref]);

  return <div ref={ref}></div>;
}
