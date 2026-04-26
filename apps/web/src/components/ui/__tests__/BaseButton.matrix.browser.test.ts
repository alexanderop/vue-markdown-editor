import { describe, it } from 'vitest'
import { render } from '@testing-library/vue'
import { BaseButton, baseButtonVariantConfig } from '@vme/ui'

import { renderEach } from '../../../../tests/render-each'
import { expectNoA11yViolations } from '../../../../tests/setup-browser'

// Matrix snapshot of the BaseButton visual contract: every variant × size
// combination, plus disabled. Driven off `baseButtonVariantConfig` so adding a
// new variant automatically gets a snapshot row, and removing one breaks the
// test — forcing intentional review.
const variants = Object.keys(baseButtonVariantConfig.variants.variant) as Array<
  keyof typeof baseButtonVariantConfig.variants.variant
>
const sizes = Object.keys(baseButtonVariantConfig.variants.size) as Array<
  keyof typeof baseButtonVariantConfig.variants.size
>

describe('BaseButton (matrix)', () => {
  renderEach(BaseButton, [
    ...variants.map(
      (variant) =>
        [`variant=${variant}`, { props: { variant }, slots: { default: 'Button' } }] as const,
    ),
    ...sizes.map(
      (size) => [`size=${size}`, { props: { size }, slots: { default: 'Button' } }] as const,
    ),
    ['disabled', { props: { disabled: true }, slots: { default: 'Button' } }] as const,
  ])

  it('should report no a11y violations on a representative variant', async () => {
    const { container } = render(BaseButton, {
      props: { variant: 'destructive' },
      slots: { default: 'Delete' },
    })
    await expectNoA11yViolations(container)
  })
})
