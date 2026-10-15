import { FilePenLine, MessageCircle, PackageCheck, ReceiptText, SearchCheck } from "lucide-react";
import { whatNext } from "@/content/home";

const ICONS = [FilePenLine, MessageCircle, SearchCheck, PackageCheck, ReceiptText];

/** White in both themes, like the live site. */
export function WhatHappensNext() {
  return (
    <section className="whn" aria-labelledby="whn-title">
      <div className="wrap">
        <h2 id="whn-title">
          <span>{whatNext.heading}</span>
        </h2>
        <ol className="steps">
          {whatNext.steps.map((step, i) => {
            const Icon = ICONS[i] ?? FilePenLine;
            return (
              <li key={step.title}>
                <span className="dot">
                  <Icon size={18} aria-hidden="true" />
                </span>
                <div className="card">
                  <strong>{step.title}</strong>
                  <span>{step.text}</span>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
