import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/vue'
import { userEvent } from 'vitest/browser'
import { defineComponent, h } from 'vue'
import { BaseInput, BaseLabel } from '@vme/ui'

import { expectNoA11yViolations } from '../../../../tests/setup-browser'

function fieldFactory(id: string, labelText: string) {
  return defineComponent({
    render() {
      return h('div', [h(BaseLabel, { for: id }, () => labelText), h(BaseInput, { id })])
    },
  })
}

describe('BaseLabel', () => {
  it('should associate with its target via `for` so screen readers announce the field', async () => {
    const { getByLabelText, container } = render(fieldFactory('name', 'Name'))

    const input = getByLabelText('Name') as HTMLInputElement
    expect(input.tagName).toBe('INPUT')
    await expectNoA11yViolations(container)
  })

  it('should focus the associated input when the label is clicked', async () => {
    const { getByText, getByLabelText } = render(fieldFactory('username', 'Username'))

    await userEvent.click(getByText('Username'))
    expect(document.activeElement).toBe(getByLabelText('Username'))
  })

  it('should mark itself with a data-slot for styling hooks', () => {
    const { getByText } = render(BaseLabel, {
      props: { for: 'x' },
      slots: { default: 'Slot text' },
    })

    expect(getByText('Slot text').dataset.slot).toBe('base-label')
  })
})
