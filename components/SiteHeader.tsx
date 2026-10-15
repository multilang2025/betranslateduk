"use client";

import { Menu, Search, X } from "lucide-react";
import { useState } from "react";
import { NAV, live } from "@/lib/site";
import { ThemeToggle } from "./ThemeToggle";

/** Logo left, menu centred, search then the dark/light button at the right (same order as the live site). */
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="container-bt bar">
        <a className="logo" href="/" aria-label="BeTranslated home">
          <img src="/images/brand/logo.png" alt="BeTranslated" width={180} height={28} />
        </a>
        <nav className={open ? "open" : ""} aria-label="Main">
          <ul>
            {NAV.map((item) => (
              <li key={item.label}>
                <a href={item.href} aria-current={item.href === "/" ? "page" : undefined}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="actions">
          <a className="icon-btn" href={live("/?s=")} aria-label="Search the site">
            <Search size={18} />
          </a>
          <ThemeToggle />
          <button
            type="button"
            className="icon-btn menu-toggle"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}
