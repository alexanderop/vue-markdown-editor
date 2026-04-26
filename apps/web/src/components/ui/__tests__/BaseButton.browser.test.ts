import { describe, expect, it, vi } from 'vitest'
import { render } from '@testing-library/vue'
import { userEvent } from 'vitest/browser'
import { BaseButton } from '@vme/ui'

import { expectNoA11yViolations } from '../../../../tests/setup-browser'

describe('BaseButton', () => {
  it('should render the slot content as the accessible name', async () => {
    const { getByRole, container } = render(BaseButton, { slots: { default: 'Save' } })

    expect(getByRole('button', { name: 'Save' })).toBeTruthy()
    await expectNoA11yViolations(container)
  })

  it('should reflect variant + size on data attributes for styling hooks', () => {
    const { getByRole } = render(BaseButton, {
      props: { variant: 'destructive', size: 'lg' },
      slots: { default: 'Delete' },
    })

    const btn = getByRole('button', { name: 'Delete' })
    expect(btn.dataset.variant).toBe('destructive')
    expect(btn.dataset.size).toBe('lg')
    expect(btn.dataset.slot).toBe('base-button')
  })

  it('should emit click when the user activates it', async () => {
    const onClick = vi.fn<() => void>()
    const { getByRole } = render(BaseButton, {
      slots: { default: 'Click me' },
      attrs: { onClick },
    })

    await userEvent.click(getByRole('button', { name: 'Click me' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('should not fire click when disabled', async () => {
    const onClick = vi.fn<() => void>()
    const { getByRole } = render(BaseButton, {
      props: { disabled: true },
      slots: { default: 'Disabled' },
      attrs: { onClick },
    })

    const btn = getByRole('button', { name: 'Disabled' })
    expect(btn.hasAttribute('disabled')).toBe(true)
    await userEvent.click(btn).catch(() => {})
    expect(onClick).not.toHaveBeenCalled()
  })

  it('should merge consumer-supplied class with the variant base classes', () => {
    const { getByRole } = render(BaseButton, {
      props: { class: 'mx-4 custom-thing' },
      slots: { default: 'Styled' },
    })

    const btn = getByRole('button', { name: 'Styled' })
    expect(btn.className).toMatch(/custom-thing/)
    expect(btn.className).toMatch(/inline-flex/)
  })
})
