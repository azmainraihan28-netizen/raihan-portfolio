'use client';

import { useState } from 'react';
import { CheckCircle2, Loader2, Send } from 'lucide-react';
import { cn } from '@/lib/cn';

type Status = 'idle' | 'sending' | 'sent' | 'error';

/* Field names are unchanged from the previous form on purpose --
   the API route and any downstream tracking key off them. */
export function ContactForm({ ref_ }: { ref_?: string }) {
  const [status, setStatus] = useState<Status>('idle');
  const [errMsg, setErrMsg] = useState('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    setErrMsg('');
    const form = e.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, ref: ref_ || null }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || 'We could not send that. Try again, or email us directly.');
      }
      setStatus('sent');
      form.reset();
    } catch (err: any) {
      setStatus('error');
      setErrMsg(err.message || 'Something went wrong. Try again, or email us directly.');
    }
  }

  if (status === 'sent') {
    return (
      <div className="rounded-card border border-accent/35 bg-accent/[0.07] p-9">
        <CheckCircle2 size={22} className="text-accent" strokeWidth={1.8} />
        <h2 className="mt-5 font-display text-2xl font-semibold tracking-[-0.025em]">
          Message received.
        </h2>
        <p className="mt-2.5 text-muted leading-relaxed max-w-[44ch]">
          We reply within 24 hours, usually faster. If it is urgent, LinkedIn is the fastest route.
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-7 text-sm text-accent hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  const busy = status === 'sending';

  return (
    <form
      onSubmit={onSubmit}
      aria-busy={busy}
      className="rounded-card border border-border bg-surface p-7 md:p-9 space-y-6"
    >
      <div className="grid sm:grid-cols-2 gap-6">
        <Field name="name" label="Your name" required autoComplete="name" />
        <Field name="email" label="Email" type="email" required autoComplete="email" />
      </div>
      <div className="grid sm:grid-cols-2 gap-6">
        <Field name="company" label="Company" hint="Optional" autoComplete="organization" />
        <Select
          name="scope"
          label="Scope"
          required
          options={[
            'Single workflow or page',
            'Full site or app',
            'Multi-workstream engagement',
            'Ongoing / retainer',
            'Not sure yet',
          ]}
        />
      </div>
      <Field
        name="message"
        label="What are you trying to build or automate?"
        hint="The outcome you want is more useful than a spec. Two or three sentences is plenty."
        as="textarea"
        rows={6}
        required
      />

      <div className="pt-1">
        <button
          type="submit"
          disabled={busy}
          data-press={busy ? 'off' : 'pill'}
          className={cn(
            'inline-flex items-center gap-2 px-6 py-3 rounded-pill text-sm font-medium whitespace-nowrap',
            'bg-primary text-primary-on hover:bg-primary-hover transition-colors',
            'disabled:opacity-60 disabled:cursor-not-allowed',
          )}
        >
          {busy ? (
            <>
              <Loader2 size={15} className="animate-spin" aria-hidden /> Sending
            </>
          ) : (
            <>
              <Send size={15} aria-hidden /> Send message
            </>
          )}
        </button>

        {status === 'error' && (
          <p role="alert" className="mt-4 text-sm text-rose-400">
            {errMsg}
          </p>
        )}
      </div>
    </form>
  );
}

const controlCls =
  'w-full rounded-input bg-bg border border-border px-3.5 py-2.5 text-sm text-text ' +
  'placeholder:text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/40';

function Field({
  name,
  label,
  hint,
  as,
  ...rest
}: {
  name: string;
  label: string;
  hint?: string;
  as?: 'textarea';
  type?: string;
  required?: boolean;
  rows?: number;
  autoComplete?: string;
}) {
  const hintId = hint ? `${name}-hint` : undefined;
  return (
    <div className="flex flex-col gap-2">
      {/* Label above, always. Never a placeholder standing in for a label. */}
      <label htmlFor={name} className="text-sm text-text/90 font-medium">
        {label}
      </label>
      {as === 'textarea' ? (
        <textarea id={name} name={name} aria-describedby={hintId} className={controlCls} {...(rest as any)} />
      ) : (
        <input id={name} name={name} aria-describedby={hintId} className={controlCls} {...(rest as any)} />
      )}
      {hint && (
        <p id={hintId} className="text-xs text-muted leading-relaxed">
          {hint}
        </p>
      )}
    </div>
  );
}

function Select({
  name,
  label,
  options,
  required,
}: {
  name: string;
  label: string;
  options: string[];
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="text-sm text-text/90 font-medium">
        {label}
      </label>
      <select id={name} name={name} required={required} defaultValue="" className={controlCls}>
        <option value="" disabled>
          Select a range
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
