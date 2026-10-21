// Soft-3D service icons (navy/teal on #FBFAF7), self-hosted in
// public/icons/servicios/. The four main illustrations are the approved
// Higgsfield images recoloured to navy/teal; the specialty icons are rendered
// in the same clay style. Each has a 512 px file and a "-256" file for tiles.
const DIR = "/icons/servicios/";

export const SERVICE_ILLUSTRATION = {
  jurada: `${DIR}traduccion-jurada.webp`,
  interp: `${DIR}interpretacion.webp`,
  marketing: `${DIR}traduccion-web-marketing-digital.webp`,
  docs: `${DIR}traduccion-documentos.webp`,
};

// Matched on "href name" so the EN/FR tiles (whose links differ) resolve too.
// Order matters: "tecnológica"/"high-tech" before the generic "técnica".
const SPEC = [
  [/tecnol|technolog|high-tech|informati|high tech|\bit\b/i, "traduccion-tecnologica"],
  [/legal|jur[ií]d/i, "traduccion-juridica"],
  [/t[eé]cnica|technical|technique|industri|construction/i, "traduccion-tecnica-industrial"],
  [/comerc|commerc|business/i, "traduccion-comercial"],
  [/financ/i, "traduccion-financiera"],
  [/marketing|sales/i, "traduccion-marketing"],
  [/turis|touris|travel/i, "traduccion-turistica"],
  [/cient[ií]f|scientif/i, "traduccion-cientifica"],
  [/copywriting|r[ée]daction/i, "copywriting"],
  [/website|web site|document/i, "traduccion-especializada"],
  [/especializ|sp[ée]cialis/i, "traduccion-especializada"],
];

export const specialtyIconSrc = (href = "", name = "") => {
  const hit = SPEC.find(([re]) => re.test(`${href} ${name}`));
  return hit ? `${DIR}${hit[1]}-256.webp` : `${DIR}traduccion-especializada-256.webp`;
};
