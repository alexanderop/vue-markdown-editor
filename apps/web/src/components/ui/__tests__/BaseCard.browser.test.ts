import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/vue'
import { defineComponent, h } from 'vue'
import {
  BaseCard,
  BaseCardAction,
  BaseCardContent,
  BaseCardDescription,
  BaseCardFooter,
  BaseCardHeader,
  BaseCardTitle,
} from '@vme/ui'

import { expectNoA11yViolations } from '../../../../tests/setup-browser'

describe('BaseCard', () => {
  it('should compose header/title/description/content/footer with semantic structure', async () => {
    const Composed = defineComponent({
      render() {
        return h(BaseCard, () => [
          h(BaseCardHeader, () => [
            h(BaseCardTitle, () => 'Title'),
            h(BaseCardDescription, () => 'Description'),
          ]),
          h(BaseCardContent, () => 'Body content'),
          h(BaseCardFooter, () => 'Footer content'),
        ])
      },
    })

    const { getByText, container } = render(Composed)

    // Title is an h3 — preserves heading order semantics.
    expect(getByText('Title').tagName).toBe('H3')
    expect(getByText('Description').tagName).toBe('P')

    expect(getByText('Title').dataset.slot).toBe('base-card-title')
    expect(getByText('Body content').dataset.slot).toBe('base-card-content')
    expect(getByText('Footer content').dataset.slot).toBe('base-card-footer')

    await expectNoA11yViolations(container)
  })

  it('should lay out CardAction in the action grid cell when present', () => {
    const WithAction = defineComponent({
      render() {
        return h(BaseCard, () => [
          h(BaseCardHeader, () => [
            h(BaseCardTitle, () => 'Heading'),
            h(BaseCardAction, () => 'Action'),
          ]),
        ])
      },
    })

    const { getByText } = render(WithAction)

    const action = getByText('Action')
    expect(action.dataset.slot).toBe('base-card-action')
    expect(action.className).toMatch(/col-start-2/)
  })
})
