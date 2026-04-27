"use client";

import { useEffect, useRef, useState } from "react";
import { BsGeoAltFill, BsChevronDown } from "react-icons/bs";
import styles from "./styles.module.scss";

interface MapAppsMenuProps {
  latitude: number;
  longitude: number;
  locationName: string;
}

interface MapApp {
  label: string;
  href: string;
  dotClass: string;
}

export function MapAppsMenu({
  latitude,
  longitude,
  locationName,
}: MapAppsMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const uberHref = (() => {
    const p = new URLSearchParams();
    p.set("action", "setPickup");
    p.set("pickup", "my_location");
    p.set("dropoff[latitude]", String(latitude));
    p.set("dropoff[longitude]", String(longitude));
    p.set("dropoff[nickname]", locationName);
    return `https://m.uber.com/ul/?${p.toString()}`;
  })();

  const the99Href = (() => {
    const p = new URLSearchParams();
    p.set("screen", "ride");
    p.set("dropoff_latitude", String(latitude));
    p.set("dropoff_longitude", String(longitude));
    return `https://99app.com/deeplink?${p.toString()}`;
  })();

  const apps: MapApp[] = [
    {
      label: "Google Maps",
      href: `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`,
      dotClass: styles.mapAppDotGoogle,
    },
    {
      label: "Waze",
      href: `https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`,
      dotClass: styles.mapAppDotWaze,
    },
    {
      label: "Uber",
      href: uberHref,
      dotClass: styles.mapAppDotUber,
    },
    {
      label: "99",
      href: the99Href,
      dotClass: styles.mapAppDot99,
    },
  ];

  return (
    <div ref={ref} className={styles.mapAppsMenuWrap}>
      <button
        type="button"
        className={styles.mapAppsTrigger}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <BsGeoAltFill />
        <span>Ver rotas</span>
        <BsChevronDown
          className={`${styles.mapAppsChevron} ${
            open ? styles.mapAppsChevronOpen : ""
          }`}
        />
      </button>

      {open && (
        <div className={styles.mapAppsMenu} role="menu">
          {apps.map((app) => (
            <a
              key={app.label}
              href={app.href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mapAppsMenuItem}
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              <span className={`${styles.mapAppDot} ${app.dotClass}`} />
              <span className={styles.mapAppsMenuLabel}>{app.label}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
