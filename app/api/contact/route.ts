import { NextResponse } from 'next/server';
import { site } from '@/content/site';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { name, email, company, budget, message, ref } = body || {};

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Dev fallback: log to server console so the form still works locally.
    console.log('[contact] new lead (no RESEND_API_KEY set):', { name, email, company, budget, message, ref });
    return NextResponse.json({ ok: true, dev: true });
  }

  try {
    const { Resend } = await import('resend');
    const resend = new Resend(apiKey);
    const html = `
      <h2>New portfolio lead</h2>
      <p><strong>From:</strong> ${escape(name)} &lt;${escape(email)}&gt;</p>
      ${company ? `<p><strong>Company:</strong> ${escape(company)}</p>` : ''}
      ${budget ? `<p><strong>Budget:</strong> ${escape(budget)}</p>` : ''}
      ${ref ? `<p><strong>Came from:</strong> ${escape(ref)}</p>` : ''}
      <hr/>
      <p style="white-space:pre-wrap">${escape(message)}</p>
    `;
    await resend.emails.send({
      from: `Portfolio <onboarding@resend.dev>`,
      to: site.email,
      replyTo: email,
      subject: `New lead — ${name}${budget ? ` (${budget})` : ''}`,
      html,
    });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Send failed' }, { status: 500 });
  }
}

function escape(s: string) {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' } as Record<string, string>)[c] || c,
  );
}
