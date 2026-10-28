"use client";

import { useEffect } from "react";
import { captureAttribution } from "../lib/attribution";

// Records referrer, landing page and campaign parameters once per page load so
// the quote form can send them with the request (lib/attribution.js).
export default function AttributionCapture() {
  useEffect(() => { captureAttribution(); }, []);
  return null;
}
