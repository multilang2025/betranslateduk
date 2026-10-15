import { About } from "@/components/About";
import { ClientBand } from "@/components/ClientBand";
import { CtaBox } from "@/components/CtaBox";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { WhatHappensNext } from "@/components/WhatHappensNext";

/** Homepage, in the same order as the live page on 14 Oct 2026. */
export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <ClientBand />
        <Services />
        <About />
        <WhatHappensNext />
        <CtaBox />
      </main>
      <SiteFooter />
    </>
  );
}
