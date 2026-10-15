import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CtaBox } from "@/components/CtaBox";
import { PageBlocks } from "@/components/PageBlocks";
import { PageHero } from "@/components/PageHero";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { WhatHappensNext } from "@/components/WhatHappensNext";
import { findPage, pages } from "@/content/pages";

type Props = { params: Promise<{ slug: string[] }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return pages.map((p) => ({ slug: p.path.split("/") }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = findPage((await params).slug);
  return page ? { title: page.meta.title, description: page.meta.description } : {};
}

/** Every inner page: homepage-style hero, content blocks, then the shared process and CTA sections. */
export default async function InnerPage({ params }: Props) {
  const page = findPage((await params).slug);
  if (!page) notFound();
  return (
    <>
      <SiteHeader />
      <main>
        <PageHero page={page} />
        <PageBlocks blocks={page.blocks} />
        <WhatHappensNext />
        <CtaBox />
      </main>
      <SiteFooter />
    </>
  );
}
