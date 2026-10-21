// "What to include in your request" checklist for the quote pages. The items
// are the details most often missing from real quote requests on the legacy
// site (docs/quote-insights-2026-10-17.md): what the translation is for and
// where it will be used, sworn or not, the deadline, the volume and, for
// interpreting, date, place and languages.
const COPY = {
  es: {
    title: "Qué incluir en tu solicitud",
    items: [
      "Para qué trámite u objetivo necesitas la traducción y en qué país la vas a presentar.",
      "Si el organismo te pide traducción jurada y si la quieres en digital, en papel o en ambos formatos.",
      "La fecha en la que la necesitas.",
      "Todas las páginas del documento, con la apostilla si la tiene, o el número aproximado de páginas o palabras.",
      "Para interpretación: fechas y horario, ciudad y lugar, idiomas, número de asistentes y si la sala ya tiene equipo.",
    ],
    note: "Con estos datos te respondemos con precio y plazo en un máximo de 8 horas laborables.",
  },
  en: {
    title: "What to include in your request",
    items: [
      "What the translation is for and in which country you will submit it.",
      "Whether the receiving body asks for a sworn translation, and whether you need it digitally, on paper or both.",
      "The date you need it by.",
      "Every page of the document, including the apostille if there is one, or the approximate number of pages or words.",
      "For interpreting: dates and times, city and venue, languages, number of attendees and whether the room already has equipment.",
    ],
    note: "With these details we reply with price and turnaround within a maximum of 8 business hours.",
  },
  fr: {
    title: "Ce qu’il faut indiquer dans votre demande",
    items: [
      "La démarche ou l’objectif de la traduction, et le pays où vous la présenterez.",
      "Si l’organisme vous demande une traduction assermentée, et si vous la souhaitez en version numérique, papier ou les deux.",
      "La date à laquelle vous en avez besoin.",
      "Toutes les pages du document, avec l’apostille le cas échéant, ou le nombre approximatif de pages ou de mots.",
      "Pour l’interprétation : dates et horaires, ville et lieu, langues, nombre de participants et équipement déjà disponible dans la salle.",
    ],
    note: "Avec ces informations, nous vous répondons avec un prix et un délai sous 8 heures ouvrées au maximum.",
  },
};

export default function QuoteChecklist({ locale = "es" }) {
  const c = COPY[locale] || COPY.es;
  return (
    <div className="quote-check">
      <h3>{c.title}</h3>
      <ul>{c.items.map((i) => <li key={i}>{i}</li>)}</ul>
      <p>{c.note}</p>
    </div>
  );
}
