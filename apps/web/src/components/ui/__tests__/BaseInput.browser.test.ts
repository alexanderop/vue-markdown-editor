import { describe, expect, it, vi } from 'vitest'
import { render } from '@testing-library/vue'
import { userEvent } from 'vitest/browser'
import { defineComponent, h, ref } from 'vue'
import { BaseInput, BaseLabel } from '@vme/ui'

import { expectNoA11yViolations } from '../../../../tests/setup-browser'

// Factory: input + label wired together with v-model. Returns the rendered
// surface plus the reactive value so tests can inspect it directly.
function mountField() {
  const value = ref('')
  const Field = defineComponent({
    setup() {
      const onInput = (v: string | number) => {
        value.value = String(v)
      }
      return () =>
        h('div', [
          h(BaseLabel, { for: 'email' }, () => 'Email'),
          h(BaseInput, {
            id: 'email',
            modelValue: value.value,
            'onUpdate:modelValue': onInput,
            type: 'email',
            placeholder: 'you@example.com',
          }),
        ])
    },
  })
  const ui = render(Field)
  return Object.assign(ui, {
    value,
    input: ui.getByLabelText('Email') as HTMLInputElement,
  })
}

describe('BaseInput', () => {
  it('should render with the type and placeholder it was given', async () => {
    const field = mountField()

    expect(field.input.type).toBe('email')
    expect(field.input.placeholder).toBe('you@example.com')
    expect(field.input.dataset.slot).toBe('base-input')
    await expectNoA11yViolations(field.container)
  })

  it('should reflect typed text in the DOM input value', async () => {
    const field = mountField()

    await userEvent.type(field.input, 'alex@example.com')
    expect(field.input.value).toBe('alex@example.com')
  })

  it('should emit update:modelValue on every keystroke', async () => {
    const onUpdate = vi.fn<(value: string) => void>()
    const { getByLabelText } = render(BaseInput, {
      attrs: { 'aria-label': 'Subscriber address', 'onUpdate:modelValue': onUpdate },
    })

    const input = getByLabelText('Subscriber address') as HTMLInputElement
    await userEvent.type(input, 'abc')
    expect(onUpdate).toHaveBeenCalledTimes(3)
    expect(onUpdate).toHaveBeenLastCalledWith('abc')
  })

  it('should block input and announce as disabled when disabled', () => {
    const { getByRole } = render(BaseInput, {
      props: { disabled: true, placeholder: 'p' },
      attrs: { 'aria-label': 'thing' },
    })

    const input = getByRole('textbox', { name: 'thing' }) as HTMLInputElement
    expect(input.disabled).toBe(true)
  })

  it('should merge consumer class with base classes', () => {
    const { getByRole } = render(BaseInput, {
      props: { class: 'border-red-500' },
      attrs: { 'aria-label': 'styled' },
    })

    const input = getByRole('textbox', { name: 'styled' })
    expect(input.className).toMatch(/border-red-500/)
    expect(input.className).toMatch(/rounded-md/)
  })
})
