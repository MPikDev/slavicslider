'use client'
/**
 * Friendly color picker for the car paint colors: a native color swatch picker
 * plus a text box for pasting a hex code like #1F63E0.
 */
import React from 'react'
import { useField } from '@payloadcms/ui'

type Props = {
  path?: string
  field?: { name?: string; label?: unknown; required?: boolean }
  readOnly?: boolean
}

const HEX = /^#[0-9a-fA-F]{6}$/

export const ColorField: React.FC<Props> = (props) => {
  const path = props.path ?? props.field?.name ?? 'color'
  const { value, setValue, showError, errorMessage } = useField<string>({ path })
  const label = typeof props.field?.label === 'string' ? props.field.label : 'Color'
  const current = typeof value === 'string' ? value : ''
  const safe = HEX.test(current) ? current : '#1F63E0'
  const inputId = `field-${path.replace(/\./g, '__')}`

  return (
    <div className={`field-type text${showError ? ' error' : ''}`} style={{ marginBottom: 16 }}>
      <label className="field-label" htmlFor={inputId}>
        {label}
        {props.field?.required ? <span className="required">*</span> : null}
      </label>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <input
          aria-label={`${label} picker`}
          type="color"
          value={safe}
          disabled={props.readOnly}
          onChange={(e) => setValue(e.target.value.toUpperCase())}
          style={{ width: 56, height: 44, padding: 0, border: '1px solid var(--theme-elevation-150)', background: 'none', cursor: 'pointer' }}
        />
        <input
          id={inputId}
          type="text"
          value={current}
          placeholder="#1F63E0"
          disabled={props.readOnly}
          onChange={(e) => {
            let v = e.target.value.trim()
            if (v && !v.startsWith('#')) v = `#${v}`
            setValue(v.toUpperCase())
          }}
          style={{ maxWidth: 160, height: 44 }}
        />
      </div>
      <div className="field-description" style={{ marginTop: 6 }}>
        Tap the square to pick a color, or paste a code like #1F63E0.
      </div>
      {showError && errorMessage ? (
        <div className="field-error" role="alert" style={{ color: 'var(--theme-error-500)', marginTop: 6 }}>
          {errorMessage}
        </div>
      ) : null}
    </div>
  )
}
