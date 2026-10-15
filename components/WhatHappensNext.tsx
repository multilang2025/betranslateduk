import { FilePenLine, MessageCircle, PackageCheck, ReceiptText, SearchCheck } from "lucide-react";
import { whatNext } from "@/content/home";

const ICONS = [FilePenLine, MessageCircle, SearchCheck, PackageCheck, ReceiptText];

/** White in both themes, like the live site. Styled like the Services section. */
export function WhatHappensNext() {
  return (
    <section className="whn" aria-labelledby="whn-title">
      <div className="container-bt">
        <p className="eyebrow-text">{whatNext.eyebrow}</p>
        <h2 id="whn-title">{whatNext.heading}</h2>
        <ol className="steps">
          {whatNext.steps.map((step, i) => {
            const Icon = ICONS[i] ?? FilePenLine;
            return (
              <li key={step.title}>
                <span className="ic" aria-hidden="true">
                  <Icon size={22} strokeWidth={1.75} />
                  <span className="num">{i + 1}</span>
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
