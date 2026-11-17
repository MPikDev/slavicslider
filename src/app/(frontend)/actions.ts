'use server'
import { headers } from 'next/headers'
import { getPayloadClient, getSettings } from '@/lib/payload'

export type InquiryState = {
  status: 'idle' | 'success' | 'error'
  message: string
  errors?: Record<string, string>
  values?: Record<string, string>
}

// Simple in-memory rate limit: max 5 submissions per IP per 15 minutes.
const WINDOW_MS = 15 * 60 * 1000
const MAX_PER_WINDOW = 5
const hits = new Map<string, number[]>()

const rateLimited = (ip: string): boolean => {
  const now = Date.now()
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS)
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent)
    return true
  }
  recent.push(now)
  hits.set(ip, recent)
  if (hits.size > 5000) hits.clear() // keep memory bounded
  return false
}

const str = (fd: FormData, key: string, max = 2000) => String(fd.get(key) ?? '').trim().slice(0, max)
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export async function submitInquiry(_prev: InquiryState, formData: FormData): Promise<InquiryState> {
  const type = str(formData, 'type') === 'sponsorship' ? 'sponsorship' : 'contact'
  const values = {
    name: str(formData, 'name', 120),
    email: str(formData, 'email', 200),
    phone: str(formData, 'phone', 40),
    company: str(formData, 'company', 160),
    tierInterest: str(formData, 'tierInterest', 60),
    message: str(formData, 'message', 5000),
  }
  const fakeSuccess: InquiryState = { status: 'success', message: 'We’ll get back to you soon.' }

  // Spam traps: honeypot field filled in, or the form was submitted inhumanly fast.
  if (str(formData, 'website')) return fakeSuccess
  const renderedAt = Number(str(formData, 't'))
  if (!renderedAt || Date.now() - renderedAt < 2500) return fakeSuccess

  const h = await headers()
  const ip =
    h.get('cf-connecting-ip') || h.get('x-real-ip') || h.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (rateLimited(ip)) {
    return { status: 'error', message: 'Too many messages from your connection. Please try again in a little while.', values }
  }

  const errors: Record<string, string> = {}
  if (!values.name) errors.name = 'Please enter your name.'
  if (!EMAIL.test(values.email)) errors.email = 'Please enter a valid email address.'
  if (values.message.length < 5) errors.message = 'Please write a short message.'
  if (type === 'sponsorship' && !values.company) errors.company = 'Please enter your company name.'
  if (Object.keys(errors).length) {
    return { status: 'error', message: 'Please fix the highlighted fields.', errors, values }
  }

  try {
    const payload = await getPayloadClient()
    await payload.create({
      collection: 'inquiries',
      data: { type, status: 'new', ...values },
      overrideAccess: true,
    })

    // Optional email notification (only if SMTP is configured in .env)
    if (process.env.SMTP_HOST) {
      const settings = await getSettings()
      const to = process.env.NOTIFY_EMAIL || settings.contactEmail
      if (to) {
        const label = type === 'sponsorship' ? 'Sponsorship inquiry' : 'Contact message'
        await payload
          .sendEmail({
            to,
            replyTo: values.email,
            subject: `[Slavic Sliders] ${label} from ${values.name}`,
            text: [
              `${label}`,
              `Name: ${values.name}`,
              `Email: ${values.email}`,
              values.phone ? `Phone: ${values.phone}` : null,
              values.company ? `Company: ${values.company}` : null,
              values.tierInterest ? `Interested in: ${values.tierInterest}` : null,
              '',
              values.message,
              '',
              'View all inquiries in the admin panel under Inbox → Inquiries.',
            ]
              .filter((l): l is string => typeof l === 'string')
              .join('\n'),
          })
          .catch((err: unknown) => payload.logger.error({ err }, 'Inquiry email failed'))
      }
    }
  } catch (err) {
    console.error('Inquiry save failed', err)
    return { status: 'error', message: 'Sorry, something went wrong sending your message. Please try again or email us.', values }
  }

  return {
    status: 'success',
    message:
      type === 'sponsorship'
        ? 'Thanks for your interest in sponsoring Slavic Sliders. We’ll reply by email soon.'
        : 'Thanks for reaching out. We’ll reply by email soon.',
  }
}
