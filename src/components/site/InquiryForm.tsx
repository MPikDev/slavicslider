'use client'
import { useActionState } from 'react'
import { submitInquiry, type InquiryState } from '@/app/(frontend)/actions'

type Props = {
  type: 'contact' | 'sponsorship'
  /** Server render time, used to catch bots that submit instantly. */
  renderedAt: number
  tierOptions?: Array<{ value: string; label: string }>
}

const initial: InquiryState = { status: 'idle', message: '' }

export function InquiryForm({ type, renderedAt, tierOptions }: Props) {
  const [state, action, pending] = useActionState(submitInquiry, initial)
  const err = (name: string) => state.errors?.[name]
  const sponsor = type === 'sponsorship'

  if (state.status === 'success') {
    return (
      <div className="form-status" role="status">
        <strong>Thanks, got it!</strong>
        <p style={{ margin: '6px 0 0' }}>{state.message}</p>
      </div>
    )
  }

  return (
    <form action={action} className="form" noValidate>
      <input type="hidden" name="type" value={type} />
      <input type="hidden" name="t" value={renderedAt} />
      {/* Honeypot: hidden from people, bots fill it in */}
      <div className="hp-field" aria-hidden="true">
        <label htmlFor={`${type}-website`}>Leave this empty</label>
        <input id={`${type}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {state.status === 'error' && state.message ? (
        <div className="form-status error" role="alert">
          {state.message}
        </div>
      ) : null}

      <div className="form-row">
        <div className="field">
          <label htmlFor={`${type}-name`}>Your name *</label>
          <input
            id={`${type}-name`}
            name="name"
            type="text"
            autoComplete="name"
            required
            defaultValue={state.values?.name}
            aria-invalid={Boolean(err('name'))}
            aria-describedby={err('name') ? `${type}-name-err` : undefined}
          />
          {err('name') ? <div id={`${type}-name-err`} className="field-error">{err('name')}</div> : null}
        </div>
        <div className="field">
          <label htmlFor={`${type}-email`}>Email *</label>
          <input
            id={`${type}-email`}
            name="email"
            type="email"
            autoComplete="email"
            required
            defaultValue={state.values?.email}
            aria-invalid={Boolean(err('email'))}
            aria-describedby={err('email') ? `${type}-email-err` : undefined}
          />
          {err('email') ? <div id={`${type}-email-err`} className="field-error">{err('email')}</div> : null}
        </div>
      </div>

      <div className="form-row">
        <div className="field">
          <label htmlFor={`${type}-phone`}>Phone (optional)</label>
          <input id={`${type}-phone`} name="phone" type="tel" autoComplete="tel" defaultValue={state.values?.phone} />
        </div>
        {sponsor ? (
          <div className="field">
            <label htmlFor={`${type}-company`}>Company *</label>
            <input
              id={`${type}-company`}
              name="company"
              type="text"
              autoComplete="organization"
              required
              defaultValue={state.values?.company}
              aria-invalid={Boolean(err('company'))}
              aria-describedby={err('company') ? `${type}-company-err` : undefined}
            />
            {err('company') ? <div id={`${type}-company-err`} className="field-error">{err('company')}</div> : null}
          </div>
        ) : null}
      </div>

      {sponsor && tierOptions?.length ? (
        <div className="field">
          <label htmlFor={`${type}-tier`}>Interested in</label>
          <select id={`${type}-tier`} name="tierInterest" defaultValue={state.values?.tierInterest || ''}>
            <option value="">Not sure yet</option>
            {tierOptions.map((o) => (
              <option key={o.value} value={o.label}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      <div className="field">
        <label htmlFor={`${type}-message`}>{sponsor ? 'Tell us about your business *' : 'Message *'}</label>
        <textarea
          id={`${type}-message`}
          name="message"
          required
          defaultValue={state.values?.message}
          aria-invalid={Boolean(err('message'))}
          aria-describedby={err('message') ? `${type}-message-err` : undefined}
        />
        {err('message') ? <div id={`${type}-message-err`} className="field-error">{err('message')}</div> : null}
      </div>

      <div>
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? 'Sending…' : sponsor ? 'Send sponsorship inquiry' : 'Send message'}
        </button>
      </div>
    </form>
  )
}
