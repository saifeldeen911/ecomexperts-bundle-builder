import {
  formatCompareAtPrice,
  formatCurrency,
  formatPrice,
} from '../lib/bundleCalculations'
import type { BundleSelectionTarget, ReviewLine } from '../types'
import { QuantityStepper } from './QuantityStepper'

interface ReviewLineItemProps {
  line: ReviewLine
  onIncrementQuantity?: (target: BundleSelectionTarget) => void
  onDecrementQuantity?: (target: BundleSelectionTarget) => void
}

export function ReviewLineItem({
  line,
  onIncrementQuantity,
  onDecrementQuantity,
}: ReviewLineItemProps) {
  const showQuantityStepper = line.category !== 'plan'
  const stepperLabel = `${line.name}${
    line.variantLabel === undefined ? '' : ` ${line.variantLabel}`
  } quantity`
  const compareAtPrice = formatCompareAtPrice(line.pricing)
  const activeTotalCents = line.pricing.activeCents * line.quantity
  const activePrice =
    activeTotalCents === 0 ? 'FREE' : formatPrice({
      activeCents: activeTotalCents,
      cadence: line.pricing.cadence,
    })
  const compareAtTotal =
    compareAtPrice === undefined
      ? undefined
      : line.pricing.cadence === 'monthly'
        ? `${formatCurrency((line.pricing.compareAtCents ?? 0) * line.quantity)}/mo`
        : formatCurrency((line.pricing.compareAtCents ?? 0) * line.quantity)

  return (
    <article className="review-line" data-category={line.category}>
      <div className="review-line__media" aria-label={line.image.alt}>
        {line.image.isExported && (
          <img src={line.image.path} alt={line.image.alt} />
        )}
      </div>

      <div className="review-line__details">
        {line.category === 'plan' && line.name === 'Cam Unlimited' ? (
          <strong className="review-line__plan-name">
            Cam <span>Unlimited</span>
          </strong>
        ) : (
          <strong>{line.name}</strong>
        )}
        {line.variantLabel !== undefined && <span>{line.variantLabel}</span>}
        {line.isRequired === true && !line.name.includes('Required') && (
          <span>Required</span>
        )}
      </div>

      {showQuantityStepper && (
        <QuantityStepper
          value={line.quantity}
          label={stepperLabel}
          onIncrement={
            onIncrementQuantity === undefined
              ? undefined
              : () =>
                  onIncrementQuantity({
                    productId: line.productId,
                    selectionId: line.selectionId,
                  })
          }
          onDecrement={
            onDecrementQuantity === undefined
              ? undefined
              : () =>
                  onDecrementQuantity({
                    productId: line.productId,
                    selectionId: line.selectionId,
                  })
          }
          min={line.isRequired ? 1 : 0}
          isDisabled={line.isRequired === true}
        />
      )}

      <div className="review-line__price">
        {compareAtTotal !== undefined && <s>{compareAtTotal}</s>}
        <strong>{activePrice}</strong>
      </div>
    </article>
  )
}
