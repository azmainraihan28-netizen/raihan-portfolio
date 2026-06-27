'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { cn } from '@/lib/cn';

type Status = 'idle' | 'sending' | 'sent' | 'error';

export function ContactForm({ ref_ }: { ref_?: string }) {
  const [status, setStatus] = useState<Status>('idle');
  const [errMsg, setErrMsg] = useState('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    setErrMsg('');
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries());
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, ref: ref_ || null }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || 'Send failed');
      }
      setStatus('sent');
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      setStatus('error');
      setErrMsg(err.message || 'Something went wrong');
    }
  }

  if (status === 'sent') {
    return (
      <div className="rounded-xl border border-accent/30 bg-accent/10 p-8">
        <h2 className="text-2xl font-semibold tracking-tight">Message received.</h2>
        <p className="mt-2 text-muted">I'll get back to you within 24 hours — usually faster.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-xl border border-border bg-surface p-7 space-y-4">
      <Row>
        <Field name="name" label="Your name" required />
        <Field name="email" label="Email" type="email" required />
      </Row>
      <Row>
        <Field name="company" label="Company (optional)" />
        <Select
          name="budget"
          label="Budget"
          required
          options={[
            'Under $500',
            '$500 – $2,000',
            '$2,000 – $5,000',
            '$5,000+',
            'Not sure yet',
          ]}
        />
      </Row>
      <Field
        name="message"
        label="What are you trying to automate?"
        as="textarea"
        rows={6}
        required
        placeholder="If you already know which day from the 30 you want, mention the number. Otherwise describe the workflow you'd love to have running."
      />
      <button
        type="submit"
        disabled={status === 'sending'}
        className={cn(
          'inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium transition-colors',
          'bg-accent text-white hover:bg-accent-hover disabled:opacity-50',
        )}
      >
        <Send size={14} /> {status === 'sending' ? 'Sending…' : 'Send message'}
      </button>
      {status === 'error' && (
        <div className="text-sm text-red-400">{errMsg}</div>
      )}
    </form>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid sm:grid-cols-2 gap-4">{children}</div>;
}

function Field({
  name, label, as, ...rest
}: {
  name: string; label: string;
  as?: 'textarea';
  type?: string; required?: boolean; rows?: number; placeholder?: string;
}) {
  const cls = 'mt-1.5 w-full rounded-md bg-bg border border-border px-3 py-2 text-sm placeholder-muted/70 focus:outline-none focus:border-accent';
  return (
    <label className="block text-sm">
      <span className="text-muted">{label}</span>
      {as === 'textarea' ? (
        <textarea name={name} className={cls} {...(rest as any)} />
      ) : (
        <input name={name} className={cls} {...(rest as any)} />
      )}
    </label>
  );
}

function Select({ name, label, options, required }: { name: string; label: string; options: string[]; required?: boolean }) {
  return (
    <label className="block text-sm">
      <span className="text-muted">{label}</span>
      <select name={name} required={required} className="mt-1.5 w-full rounded-md bg-bg border border-border px-3 py-2 text-sm focus:outline-none focus:border-accent">
        <option value="">Select…</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}
