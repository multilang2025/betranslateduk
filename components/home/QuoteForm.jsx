"use client";

import { useState } from "react";

// Client-side validated quote form. The submission (fields + files) is posted as
// multipart/form-data to QUOTE_ENDPOINT, the BeTranslated.com intake Andre is
// building (see the GitHub issue "Quote form backend"). Until that endpoint is
// set, or if it fails, the form falls back to opening the visitor's mail client
// with the request prefilled and asks them to attach the files there.
const TO = "hello@betranslated.co.uk";
const QUOTE_ENDPOINT = process.env.NEXT_PUBLIC_QUOTE_ENDPOINT || "";
const MAX_FILES = 10;
const MAX_TOTAL_MB = 25;
const ACCEPT = ".pdf,.doc,.docx,.odt,.rtf,.txt,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.heic,.zip";

const L = {
  es: {
    name: "Nombre", email: "Email", phone: "Teléfono (opcional)", pair: "Idiomas (por ejemplo, español a inglés)",
    message: "¿Qué necesitas traducir?",
    hint: "Si lo sabes, indica para qué trámite y en qué país usarás la traducción, si debe ser jurada, la fecha en la que la necesitas y el número de páginas o palabras. Para interpretación: fecha, horario, ciudad e idiomas.",
    submit: "Solicitar presupuesto gratuito", subject: "Solicitud de presupuesto",
    eName: "Indica tu nombre.", eEmail: "Introduce un email válido.", eMsg: "Cuéntanos qué necesitas traducir.",
    note: "Respondemos a tu solicitud de presupuesto en un máximo de 8 horas laborables.",
    files: "Documentos (opcional)", filesHint: `PDF, Word, Excel, imágenes o ZIP. Hasta ${MAX_FILES} archivos y ${MAX_TOTAL_MB} MB en total. Si el documento tiene varias páginas, envíalas todas y dinos cuáles hay que traducir.`,
    eFiles: `Puedes adjuntar hasta ${MAX_FILES} archivos y ${MAX_TOTAL_MB} MB en total.`,
    purpose: "Trámite y país (opcional)", purposePh: "Ej.: NIE en Valencia, nacionalidad",
    sworn: "¿Debe ser jurada?", swornOpts: [["", "No lo sé"], ["si", "Sí, traducción jurada"], ["no", "No, traducción simple"]],
    format: "Formato de entrega", formatOpts: [["", "No lo sé"], ["digital", "Digital certificada (suele bastar)"], ["papel", "En papel"], ["ambos", "Digital y papel"]],
    formatHint: "Confirma con el organismo qué páginas necesita y si acepta la versión digital.",
    deadline: "¿Para cuándo la necesitas? (opcional)",
    sentFiles: "Se ha abierto tu programa de correo con la solicitud. Adjunta tus documentos en ese correo antes de enviarlo. Si no ves nada, escríbenos a hello@betranslated.es.",
    ok: "Hemos recibido tu solicitud. Te respondemos en un máximo de 8 horas laborables.",
    sent: "Se ha abierto tu programa de correo con la solicitud. Si no ves nada, escríbenos a hello@betranslated.es.",
  },
  en: {
    name: "Name", email: "Email", phone: "Phone (optional)", pair: "Languages (for example, English to German)",
    message: "What do you need translated?",
    hint: "If you know them, tell us what the translation is for, whether it must be a sworn/certified translation, the date you need it by and the number of pages or words.",
    submit: "Request a free quote", subject: "Quote request",
    eName: "Please enter your name.", eEmail: "Enter a valid email.", eMsg: "Tell us what you need translated.",
    note: "We reply to your quote request within a couple of hours during UK business hours.",
    files: "Documents (optional)", filesHint: `PDF, Word, Excel, images or ZIP. Up to ${MAX_FILES} files and ${MAX_TOTAL_MB} MB in total. If the document has several pages, send them all and tell us which ones need translating.`,
    eFiles: `You can attach up to ${MAX_FILES} files and ${MAX_TOTAL_MB} MB in total.`,
    purpose: "Purpose (optional)", purposePh: "E.g. business contract, visa application",
    sworn: "Does it need to be certified?", swornOpts: [["", "I don't know"], ["yes", "Yes, certified translation"], ["no", "No, standard translation"]],
    format: "Delivery format", formatOpts: [["", "I don't know"], ["digital", "Certified digital (usually enough)"], ["paper", "Paper"], ["both", "Digital and paper"]],
    formatHint: "Check with the receiving authority which pages it needs and whether it accepts the digital version.",
    deadline: "When do you need it? (optional)",
    sentFiles: "Your email app has opened with the request. Attach your documents to that email before sending it. If nothing appears, write to hello@betranslated.co.uk.",
    ok: "We have received your request. We reply within a couple of hours during UK business hours.",
    sent: "Your email app has opened with the request. If nothing appears, write to hello@betranslated.co.uk.",
  },
  fr: {
    name: "Nom", email: "Email", phone: "Téléphone (facultatif)", pair: "Langues (par exemple, espagnol vers français)",
    message: "Que souhaitez-vous faire traduire ?",
    hint: "Si vous les connaissez, indiquez la démarche et le pays où vous utiliserez la traduction, s’il faut une traduction assermentée, la date à laquelle vous en avez besoin et le nombre de pages ou de mots. Pour l’interprétation : date, horaires, ville et langues.",
    submit: "Demander un devis gratuit", subject: "Demande de devis",
    eName: "Indiquez votre nom.", eEmail: "Saisissez un email valide.", eMsg: "Dites-nous ce que vous souhaitez traduire.",
    note: "Nous répondons à votre demande de devis sous 8 heures ouvrées au maximum.",
    files: "Documents (facultatif)", filesHint: `PDF, Word, Excel, images ou ZIP. Jusqu’à ${MAX_FILES} fichiers et ${MAX_TOTAL_MB} Mo au total. Si le document compte plusieurs pages, envoyez-les toutes et indiquez celles à traduire.`,
    eFiles: `Vous pouvez joindre jusqu’à ${MAX_FILES} fichiers et ${MAX_TOTAL_MB} Mo au total.`,
    purpose: "Démarche et pays (facultatif)", purposePh: "Ex. : NIE à Valencia, société",
    sworn: "Faut-il une traduction assermentée ?", swornOpts: [["", "Je ne sais pas"], ["oui", "Oui, traduction assermentée (jurada)"], ["non", "Non, traduction simple"]],
    format: "Format de livraison", formatOpts: [["", "Je ne sais pas"], ["numerique", "Numérique certifiée (suffit en général)"], ["papier", "Papier"], ["les-deux", "Numérique et papier"]],
    formatHint: "Vérifiez auprès de l’organisme quelles pages il exige et s’il accepte la version numérique.",
    deadline: "Pour quand en avez-vous besoin ? (facultatif)",
    sentFiles: "Votre messagerie s’est ouverte avec la demande. Joignez-y vos documents avant de l’envoyer. Sinon, écrivez à hello@betranslated.es.",
    ok: "Nous avons bien reçu votre demande. Nous répondons sous 8 heures ouvrées.",
    sent: "Votre messagerie s’est ouverte avec la demande. Sinon, écrivez à hello@betranslated.es.",
  },
};

export default function QuoteForm({ locale = "en" }) {
  const l = L[locale] || L.en;
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [files, setFiles] = useState([]);
  const [busy, setBusy] = useState(false);

  function filesError(list) {
    const total = list.reduce((n, f) => n + f.size, 0);
    return list.length > MAX_FILES || total > MAX_TOTAL_MB * 1024 * 1024 ? l.eFiles : null;
  }

  function onFiles(e) {
    const list = Array.from(e.currentTarget.files || []);
    setFiles(list);
    setErrors((prev) => ({ ...prev, files: filesError(list) || undefined }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const v = Object.fromEntries(Array.from(data.entries()).filter(([, x]) => typeof x === "string"));
    const next = {};
    if (!String(v.name || "").trim()) next.name = l.eName;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v.email || ""))) next.email = l.eEmail;
    if (!String(v.message || "").trim()) next.message = l.eMsg;
    const fErr = filesError(files);
    if (fErr) next.files = fErr;
    setErrors(next);
    if (Object.keys(next).length) return;

    data.set("locale", locale);
    data.set("page", window.location.pathname);

    if (QUOTE_ENDPOINT) {
      setBusy(true);
      try {
        const res = await fetch(QUOTE_ENDPOINT, { method: "POST", body: data });
        if (res.ok) {
          setStatus("ok");
          form.reset();
          setFiles([]);
          return;
        }
      } catch {
        // fall through to the mailto fallback
      } finally {
        setBusy(false);
      }
    }

    const label = (opts, key) => (opts.find(([k]) => k === key) || [])[1];
    const body = [
      `${l.name}: ${v.name}`,
      `${l.email}: ${v.email}`,
      v.phone ? `${l.phone}: ${v.phone}` : null,
      v.pair ? `${l.pair}: ${v.pair}` : null,
      v.purpose ? `${l.purpose}: ${v.purpose}` : null,
      v.sworn ? `${l.sworn} ${label(l.swornOpts, v.sworn)}` : null,
      v.format ? `${l.format}: ${label(l.formatOpts, v.format)}` : null,
      v.deadline ? `${l.deadline}: ${v.deadline}` : null,
      files.length ? `${l.files}: ${files.map((f) => f.name).join(", ")}` : null,
      "",
      v.message,
    ].filter((x) => x !== null).join("\n");

    // Best-effort server-side log so the lead isn't lost if mailto fails
    // (e.g. no desktop mail client). Never blocks the mailto fallback below.
    fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...v, locale, files: files.map((f) => f.name) }),
    }).catch(() => {});

    window.location.href = `mailto:${TO}?subject=${encodeURIComponent(l.subject)}&body=${encodeURIComponent(body)}`;
    setStatus(files.length ? "mailFiles" : "mail");
  }

  const field = (name, label, props = {}) => (
    <div className="field">
      <label htmlFor={`q-${name}`}>{label}</label>
      <input
        id={`q-${name}`}
        name={name}
        aria-invalid={errors[name] ? "true" : undefined}
        aria-describedby={errors[name] ? `q-${name}-err` : undefined}
        {...props}
      />
      {errors[name] ? <span id={`q-${name}-err`} className="field__error" role="alert">{errors[name]}</span> : null}
    </div>
  );

  const select = (name, label, opts, hint) => (
    <div className="field">
      <label htmlFor={`q-${name}`}>{label}</label>
      <select id={`q-${name}`} name={name} defaultValue="" aria-describedby={hint ? `q-${name}-hint` : undefined}>
        {opts.map(([k, t]) => <option key={k || "none"} value={k}>{t}</option>)}
      </select>
      {hint ? <span id={`q-${name}-hint`} className="field__hint">{hint}</span> : null}
    </div>
  );

  return (
    <form className="quote-form" onSubmit={onSubmit} noValidate>
      <div className="quote-form__row">
        {field("name", l.name, { autoComplete: "name", required: true })}
        {field("email", l.email, { type: "email", autoComplete: "email", required: true })}
      </div>
      <div className="quote-form__row">
        {field("phone", l.phone, { type: "tel", autoComplete: "tel" })}
        {field("pair", l.pair)}
      </div>
      <div className="quote-form__row">
        {field("purpose", l.purpose, { placeholder: l.purposePh })}
        {field("deadline", l.deadline, { type: "date" })}
      </div>
      <div className="quote-form__row">
        {select("sworn", l.sworn, l.swornOpts)}
        {select("format", l.format, l.formatOpts, l.formatHint)}
      </div>
      <div className="field">
        <label htmlFor="q-message">{l.message}</label>
        <span id="q-message-hint" className="field__hint">{l.hint}</span>
        <textarea
          id="q-message"
          name="message"
          rows={4}
          required
          aria-invalid={errors.message ? "true" : undefined}
          aria-describedby={errors.message ? "q-message-hint q-message-err" : "q-message-hint"}
        />
        {errors.message ? <span id="q-message-err" className="field__error" role="alert">{errors.message}</span> : null}
      </div>
      <div className="field field--file">
        <label htmlFor="q-files">{l.files}</label>
        <span id="q-files-hint" className="field__hint">{l.filesHint}</span>
        <input
          id="q-files"
          name="files"
          type="file"
          multiple
          accept={ACCEPT}
          onChange={onFiles}
          aria-invalid={errors.files ? "true" : undefined}
          aria-describedby={errors.files ? "q-files-hint q-files-err" : "q-files-hint"}
        />
        {errors.files ? <span id="q-files-err" className="field__error" role="alert">{errors.files}</span> : null}
      </div>
      <button type="submit" className="bt-btn bt-btn--primary bt-btn--lg" disabled={busy} aria-busy={busy || undefined}>{l.submit}</button>
      <p className="quote-form__note" role="status">
        {status === "ok" ? l.ok : status === "mailFiles" ? l.sentFiles : status === "mail" ? l.sent : l.note}
      </p>
    </form>
  );
}
