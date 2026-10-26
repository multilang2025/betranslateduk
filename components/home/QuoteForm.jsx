"use client";

import { useEffect, useRef, useState } from "react";

// Quote forms for the UK site: translation, certified translation and interpreting.
// Modelled on the three betranslated.com quote forms. The submission (fields + files)
// is relayed as JSON through /api/quote/ to the betranslated.com lead intake. When files
// are attached, or if the relay fails, the form falls back to opening the visitor's mail
// client with the request prefilled and asks them to attach the files there.
const TO = "hello@betranslated.co.uk";
const QUOTE_ENDPOINT = process.env.NEXT_PUBLIC_QUOTE_ENDPOINT || "/api/quote/";
const MAX_FILES = 10;
const MAX_TOTAL_MB = 25;
const ACCEPT = ".pdf,.doc,.docx,.odt,.rtf,.txt,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.heic,.zip";

// UK audience: English combinations come first, in both directions, then the rest.
const MAIN = [
  "French", "Spanish", "German", "Italian", "Portuguese", "Polish", "Romanian", "Arabic",
  "Mandarin Chinese", "Russian", "Turkish", "Dutch", "Urdu", "Punjabi", "Bengali", "Gujarati", "Korean", "Japanese", "Welsh",
];
const OTHER_PAIR = "other";
const pairOptions = (bidirectional) => [
  ...MAIN.map((x) => (bidirectional ? `English and ${x}` : `English to ${x}`)),
  ...(bidirectional ? [] : MAIN.map((x) => `${x} to English`)),
];

const TYPES = [
  { key: "translation", label: "Translation" },
  { key: "certified", label: "Certified translation" },
  { key: "interpreting", label: "Interpreting" },
];

const OPTS = {
  subject: ["General", "Legal", "Medical / Life Sciences", "Technical / Engineering", "Marketing / Advertising", "Financial", "Website / Software", "Academic / Scientific", "Other"],
  docType: ["Birth, marriage or death certificate", "Passport or ID", "Academic certificate or transcript", "Court or legal document", "Contract or company document", "Medical record", "Driving licence", "Other"],
  cert: ["Certified translation (signed statement of accuracy)", "Notarised translation", "Certified plus apostille", "Not sure, please advise"],
  delivery: ["Digital copy", "Hard copy by post", "Digital copy and hard copy", "Not sure, please advise"],
  eventType: ["Conference", "Business meeting", "Legal or court proceeding", "Medical appointment", "Training session", "Webinar or virtual event", "Other"],
  mode: ["On-site (consecutive)", "On-site (simultaneous)", "Remote (RSI or video)", "Telephone interpreting", "Whispered (chuchotage)", "Not sure, please advise"],
  equipment: ["Yes, we need equipment rental", "No, equipment already arranged", "Not sure yet, please advise"],
};

// Suggested wording for the message box, one per form type. Visitors edit it; an
// untouched template is never submitted as if it were a real message.
const TEMPLATE = {
  translation: [
    "Document type (for example contract, website, manual):",
    "Languages (from and into):",
    "Word or page count (or attach the files):",
    "Deadline:",
    "Who will read it, and what is it for:",
    "File format you need back (for example Word, PDF, InDesign):",
    "Anything else, such as a glossary or style guide:",
  ].join("\n"),
  certified: [
    "Document type (for example birth certificate, degree certificate, contract):",
    "Languages (from and into):",
    "Number of pages:",
    "Who will receive it (for example the Home Office, a university, a solicitor, an overseas authority) and in which country:",
    "Certification required (certified, notarised or apostille), if the receiving body has told you:",
    "Deadline:",
    "Digital copy, hard copy by post, or both:",
  ].join("\n"),
  interpreting: [
    "Date and start and finish times:",
    "Location (city and venue) or the remote platform (for example Zoom or Teams):",
    "Languages (working languages A and B):",
    "Type of interpreting (consecutive, simultaneous, whispered, telephone):",
    "Number of attendees:",
    "Subject matter, and any briefing documents you can share:",
    "Equipment: is a booth or headsets needed:",
  ].join("\n"),
};

const MSG_LABEL = {
  translation: "Tell us about your translation",
  certified: "Tell us about your certified translation",
  interpreting: "Tell us about your event",
};

const NOTE = "We reply to your quote request within a couple of hours during UK business hours.";
const OK = "We have received your request. We reply within a couple of hours during UK business hours.";
const SENT = "Your email app has opened with the request. If nothing appears, write to hello@betranslated.co.uk.";
const SENT_FILES = "Your email app has opened with the request. Attach your documents to that email before sending it. If nothing appears, write to hello@betranslated.co.uk.";
const E_FILES = `You can attach up to ${MAX_FILES} files and ${MAX_TOTAL_MB} MB in total.`;

export default function QuoteForm({ initialType = "translation" }) {
  const [type, setType] = useState(TYPES.some((t) => t.key === initialType) ? initialType : "translation");
  const [msg, setMsg] = useState(TEMPLATE[type]);
  const [pair, setPair] = useState("");
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [files, setFiles] = useState([]);
  const [busy, setBusy] = useState(false);
  const startedAt = useRef(0);
  useEffect(() => { startedAt.current = Date.now(); }, []);

  const interp = type === "interpreting";
  const pairs = pairOptions(interp);

  function switchType(next) {
    if (next === type) return;
    // Swap the suggested wording only if the visitor has not typed anything of their own.
    if (msg.trim() === TEMPLATE[type].trim()) setMsg(TEMPLATE[next]);
    setType(next);
    setPair("");
    setErrors({});
  }

  function filesError(list) {
    const total = list.reduce((n, f) => n + f.size, 0);
    return list.length > MAX_FILES || total > MAX_TOTAL_MB * 1024 * 1024 ? E_FILES : null;
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
    // Honeypot: bots fill the hidden field. Pretend success and drop the request.
    if (v.website_url) { setStatus("ok"); return; }

    const untouched = msg.trim() === TEMPLATE[type].trim();
    const next = {};
    if (!String(v.name || "").trim()) next.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v.email || ""))) next.email = "Enter a valid email.";
    if (pair === OTHER_PAIR) {
      if (!String(v.fromLanguage || "").trim() || !String(v.toLanguage || "").trim()) next.pair = "Enter both languages.";
    } else if (!pair) next.pair = "Choose a language combination.";
    if (interp && !v.eventType) next.eventType = "Choose an event type.";
    if (interp && !v.mode) next.mode = "Choose how you need the interpreter.";
    if (!msg.trim() || untouched) next.message = "Replace the suggested wording with your details, or delete it and write your own.";
    const fErr = filesError(files);
    if (fErr) next.files = fErr;
    setErrors(next);
    if (Object.keys(next).length) return;

    const languages = pair === OTHER_PAIR
      ? (interp ? `${v.fromLanguage} and ${v.toLanguage}` : `${v.fromLanguage} to ${v.toLanguage}`)
      : pair;
    data.set("type", type);
    data.set("languages", languages);
    data.set("message", msg);
    data.set("page", window.location.pathname);

    // Files cannot go through the relay, so a request with documents uses the email fallback.
    if (QUOTE_ENDPOINT && !files.length) {
      setBusy(true);
      try {
        const payload = { ...Object.fromEntries(Array.from(data.entries()).filter(([, x]) => typeof x === "string")), _form_started: startedAt.current };
        const res = await fetch(QUOTE_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        if (res.ok) {
          setStatus("ok");
          form.reset();
          setMsg(TEMPLATE[type]);
          setPair("");
          setFiles([]);
          return;
        }
      } catch {
        // fall through to the mailto fallback
      } finally {
        setBusy(false);
      }
    }

    const typeLabel = TYPES.find((t) => t.key === type).label;
    const lines = [
      ["Form", typeLabel],
      ["Name", v.name],
      ["Email", v.email],
      ["Phone", v.phone],
      ["Languages", languages],
      ["Subject", v.subject],
      ["Word count", v.wordCount],
      ["Document type", v.docType],
      ["Pages", v.pages],
      ["Certification", v.certification],
      ["Delivery", v.delivery],
      ["Event type", v.eventType],
      ["Interpreting mode", v.mode],
      ["Event start", v.eventDateStart],
      ["Event end", v.eventDateEnd],
      ["Duration", v.duration],
      ["Location or platform", v.location],
      ["Venue", v.venue],
      ["Attendees", v.attendees],
      ["Equipment", v.equipment],
      ["Deadline", v.deadline],
      ["Documents", files.length ? files.map((f) => f.name).join(", ") : ""],
    ].filter(([, x]) => x).map(([k, x]) => `${k}: ${x}`);
    const body = [...lines, "", msg].join("\n");

    window.location.href = `mailto:${TO}?subject=${encodeURIComponent(`${typeLabel} quote request`)}&body=${encodeURIComponent(body)}`;
    setStatus(files.length ? "mailFiles" : "mail");
  }

  const err = (name) => (errors[name] ? <span id={`q-${name}-err`} className="field__error" role="alert">{errors[name]}</span> : null);
  const aria = (name) => ({ "aria-invalid": errors[name] ? "true" : undefined, "aria-describedby": errors[name] ? `q-${name}-err` : undefined });

  const field = (name, label, props = {}) => (
    <div className="field">
      <label htmlFor={`q-${name}`}>{label}</label>
      <input id={`q-${name}`} name={name} {...aria(name)} {...props} />
      {err(name)}
    </div>
  );

  const select = (name, label, list, { required, placeholder = "Select an option", hint } = {}) => (
    <div className="field">
      <label htmlFor={`q-${name}`}>{label}</label>
      <select id={`q-${name}`} name={name} defaultValue="" required={required} {...aria(name)}>
        <option value="">{placeholder}</option>
        {list.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      {hint ? <span className="field__hint">{hint}</span> : null}
      {err(name)}
    </div>
  );

  return (
    <form className="quote-form" onSubmit={onSubmit} noValidate>
      <div className="quote-form__tabs" role="group" aria-label="Type of quote">
        {TYPES.map((t) => (
          <button
            key={t.key}
            type="button"
            className={`quote-form__tab${t.key === type ? " is-active" : ""}`}
            aria-pressed={t.key === type}
            onClick={() => switchType(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="quote-form__hp" aria-hidden="true">
        <label htmlFor="q-website_url">Leave this field empty</label>
        <input id="q-website_url" name="website_url" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {interp ? (
        <div className="quote-form__row">
          {select("eventType", "Event type", OPTS.eventType, { required: true, placeholder: "Select event type" })}
          {select("mode", "Interpreting mode", OPTS.mode, { required: true, placeholder: "Select mode" })}
        </div>
      ) : null}

      <div className="field">
        <label htmlFor="q-pair">{interp ? "Working languages" : "Languages"}</label>
        <select id="q-pair" value={pair} onChange={(e) => setPair(e.target.value)} {...aria("pair")}>
          <option value="">Select a language combination</option>
          <optgroup label={interp ? "English with" : "With English"}>
            {pairs.map((p) => <option key={p} value={p}>{p}</option>)}
          </optgroup>
          <option value={OTHER_PAIR}>Another combination</option>
        </select>
        <span className="field__hint">English combinations come first. Pick &ldquo;Another combination&rdquo; for any other pair.</span>
        {err("pair")}
      </div>
      {pair === OTHER_PAIR ? (
        <div className="quote-form__row">
          {field("fromLanguage", interp ? "Working language A" : "Translate from", { required: true })}
          {field("toLanguage", interp ? "Working language B" : "Translate into", { required: true })}
        </div>
      ) : null}

      {type === "translation" ? (
        <>
          <div className="quote-form__row">
            {select("subject", "Subject area", OPTS.subject)}
            {field("wordCount", "Word count (if known)", { placeholder: "e.g. 2,500", inputMode: "numeric" })}
          </div>
          {field("deadline", "Deadline (optional)", { type: "date" })}
        </>
      ) : null}

      {type === "certified" ? (
        <>
          <div className="quote-form__row">
            {select("docType", "Document type", OPTS.docType)}
            {field("pages", "Number of pages (if known)", { placeholder: "e.g. 2", inputMode: "numeric" })}
          </div>
          <div className="quote-form__row">
            {select("certification", "Certification level", OPTS.cert, { placeholder: "Select certification level", hint: "Ask the receiving body what it accepts. If you are unsure, choose the last option and we will advise." })}
            {select("delivery", "Delivery format", OPTS.delivery, { placeholder: "Select delivery format" })}
          </div>
          {field("deadline", "Deadline (optional)", { type: "date" })}
        </>
      ) : null}

      {interp ? (
        <>
          <div className="quote-form__row">
            {field("eventDateStart", "Event date", { type: "date" })}
            {field("eventDateEnd", "End date (if more than one day)", { type: "date" })}
          </div>
          <div className="quote-form__row">
            {field("duration", "Duration", { placeholder: "e.g. half day, 3 hours" })}
            {field("attendees", "Number of attendees", { type: "number", min: 1, inputMode: "numeric", placeholder: "e.g. 40" })}
          </div>
          <div className="quote-form__row">
            {field("location", "City, or remote platform", { placeholder: "e.g. Manchester, Zoom, Teams" })}
            {field("venue", "Venue (optional)", { placeholder: "e.g. ExCeL London, Crown Court" })}
          </div>
          {select("equipment", "Interpreting equipment", OPTS.equipment, { placeholder: "Select equipment option" })}
        </>
      ) : null}

      <div className="quote-form__row">
        {field("name", "Name", { autoComplete: "name", required: true, placeholder: "Jane Smith" })}
        {field("email", "Email", { type: "email", autoComplete: "email", required: true, placeholder: "jane@company.co.uk" })}
      </div>
      {field("phone", "Phone (optional)", { type: "tel", autoComplete: "tel" })}

      <div className="field">
        <label htmlFor="q-message">{MSG_LABEL[type]}</label>
        <span id="q-message-hint" className="field__hint">We have started the list for you. Complete each line you can, delete the ones that do not apply, and add anything else we should know.</span>
        <textarea
          id="q-message"
          name="message"
          rows={9}
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          aria-invalid={errors.message ? "true" : undefined}
          aria-describedby={errors.message ? "q-message-hint q-message-err" : "q-message-hint"}
        />
        {err("message")}
      </div>

      <div className="field field--file">
        <label htmlFor="q-files">Documents (optional)</label>
        <span id="q-files-hint" className="field__hint">{`PDF, Word, Excel, images or ZIP. Up to ${MAX_FILES} files and ${MAX_TOTAL_MB} MB in total. If the document has several pages, send them all and tell us which ones need translating.`}</span>
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
        {err("files")}
      </div>

      <button type="submit" className="bt-btn bt-btn--primary bt-btn--lg" disabled={busy} aria-busy={busy || undefined}>Request a free quote</button>
      <p className="quote-form__note" role="status">
        {status === "ok" ? OK : status === "mailFiles" ? SENT_FILES : status === "mail" ? SENT : NOTE}
      </p>
    </form>
  );
}
