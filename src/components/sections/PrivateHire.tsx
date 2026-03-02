"use client";

import { useMemo, useState } from "react";

type FormState = {
  name: string;
  email: string;
  phone: string;
  date: string;
  groupSize: string;
  message: string;
};

const INITIAL: FormState = {
  name: "",
  email: "",
  phone: "",
  date: "",
  groupSize: "",
  message: "",
};

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

export default function PrivateHire() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState<string>("");

  const validation = useMemo(() => {
    const errs: string[] = [];
    if (!form.name.trim()) errs.push("Name is required.");
    if (!form.email.trim() || !isEmail(form.email)) errs.push("A valid email is required.");
    // phone optional
    // date optional but encouraged
    const gs = form.groupSize.trim();
    if (gs && !/^\d{1,4}$/.test(gs)) errs.push("Group size must be a number (e.g. 12).");
    if (!form.message.trim()) errs.push("Please add a short message (what you’re looking for).");
    return errs;
  }, [form]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (validation.length) {
      setStatus("error");
      setError(validation[0]);
      return;
    }

    try {
      setStatus("submitting");

      const res = await fetch("/api/private-hire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Submission failed.");
      }

      setStatus("success");
      setForm(INITIAL);
    } catch (err: any) {
      setStatus("error");
      setError(err?.message || "Something went wrong.");
    }
  }

  return (
    <section id="private-hire" className="marble-soft">
      <div className="container-shell py-14">
        <div className="grid gap-14 md:grid-cols-[1fr_auto_1fr] md:gap-16">
          {/* INFO */}
          <div>
            <div className="section-title text-center md:text-left">PRIVATE HIRE</div>
            <div className="mt-3 h-px w-full bg-black/10" />

            <div className="b-font mt-6 text-[15px] text-charcoal/70 leading-relaxed">
              Planning a birthday, group night out, or a private party in Ayia Napa?
              Send us the details and we’ll get back to you with availability and options.
            </div>

            <div className="mt-6 space-y-2">
              <div className="b-font text-xs text-[var(--botanical)]">✓ Fast reply</div>
              <div className="b-font text-xs text-[var(--botanical)]">✓ Groups welcome</div>
              <div className="b-font text-xs text-[var(--botanical)]">✓ Tailored packages</div>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px bg-black/10" />

          {/* FORM */}
          <div>
            <div className="section-title text-center md:text-left">ENQUIRY</div>
            <div className="mt-3 h-px w-full bg-black/10" />

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Name"
                  value={form.name}
                  onChange={(v) => setForm((s) => ({ ...s, name: v }))}
                  autoComplete="name"
                  required
                />
                <Field
                  label="Email"
                  value={form.email}
                  onChange={(v) => setForm((s) => ({ ...s, email: v }))}
                  autoComplete="email"
                  type="email"
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Phone (optional)"
                  value={form.phone}
                  onChange={(v) => setForm((s) => ({ ...s, phone: v }))}
                  autoComplete="tel"
                />
                <Field
                  label="Preferred date (optional)"
                  value={form.date}
                  onChange={(v) => setForm((s) => ({ ...s, date: v }))}
                  type="date"
                />
              </div>

              <Field
                label="Approx group size (optional)"
                value={form.groupSize}
                onChange={(v) => setForm((s) => ({ ...s, groupSize: v }))}
                inputMode="numeric"
                placeholder="e.g. 12"
              />

              <div>
                <label className="b-font text-[11px] tracking-[0.26em] text-charcoal/55">
                  Message
                </label>
                <div className="mt-2 overflow-hidden rounded-[14px] bg-white/30 ring-1 ring-black/10">
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm((s) => ({ ...s, message: e.target.value }))}
                    rows={5}
                    className="w-full bg-transparent px-4 py-3 text-[15px] text-charcoal/80 outline-none placeholder:text-charcoal/35"
                    placeholder="Tell us what you’re planning (occasion, time, any requests)…"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="pill pill-primary disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === "submitting" ? "SENDING…" : "SEND ENQUIRY"}
                </button>

                <div className="b-font text-xs text-charcoal/60">
                  {status === "success" ? (
                    <span className="text-[var(--botanical)]">✓ Sent — we’ll get back to you soon.</span>
                  ) : status === "error" && error ? (
                    <span className="text-red-600/80">{error}</span>
                  ) : (
                    <span>We’ll reply as soon as possible.</span>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="hairline" />
    </section>
  );
}

function Field(props: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  return (
    <div>
      <label className="b-font text-[11px] tracking-[0.26em] text-charcoal/55">
        {props.label}
      </label>
      <div className="mt-2 overflow-hidden rounded-[14px] bg-white/30 ring-1 ring-black/10">
        <input
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          type={props.type || "text"}
          required={props.required}
          autoComplete={props.autoComplete}
          placeholder={props.placeholder}
          inputMode={props.inputMode}
          className="w-full bg-transparent px-4 py-3 text-[15px] text-charcoal/80 outline-none placeholder:text-charcoal/35"
        />
      </div>
    </div>
  );
}