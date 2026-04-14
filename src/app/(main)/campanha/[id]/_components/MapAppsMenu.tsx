"use client";

import { useEffect, useRef, useState } from "react";
import { BsGeoAltFill, BsChevronDown } from "react-icons/bs";
import styles from "../styles.module.scss";

interface MapAppsMenuProps {
  latitude: number;
  longitude: number;
  locationName: string;
}

interface MapApp {
  label: string;
  href: string;
  colorClass: string;
  dotClass: string;
}

export function MapAppsMenu({ latitude, longitude, locationName }: MapAppsMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
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
      colorClass: styles.mapAppGoogle,
      dotClass: styles.mapAppDotGoogle,
    },
    {
      label: "Waze",
      href: `https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`,
      colorClass: styles.mapAppWaze,
      dotClass: styles.mapAppDotWaze,
    },
    {
      label: "Uber",
      href: uberHref,
      colorClass: styles.mapAppUber,
      dotClass: styles.mapAppDotUber,
    },
    {
      label: "99",
      href: the99Href,
      colorClass: styles.mapApp99,
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
        <span>Abrir no app</span>
        <BsChevronDown
          className={`${styles.mapAppsChevron} ${open ? styles.mapAppsChevronOpen : ""}`}
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
