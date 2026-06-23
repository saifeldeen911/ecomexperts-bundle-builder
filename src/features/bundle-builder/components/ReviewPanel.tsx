import {
  formatCurrency,
} from '../lib/bundleCalculations'
import satisfactionBadge from '../../../assets/bundle/Satisfaction-Badge.svg'
import type {
  BundleSelectionTarget,
  BundleTotals,
  ReviewCategory,
  ReviewLine,
  ShippingLine,
} from '../types'
import { ReviewLineItem } from './ReviewLineItem'

interface ReviewPanelProps {
  lines: ReviewLine[]
  shippingLine: ShippingLine
  totals: BundleTotals
  onIncrementQuantity?: (target: BundleSelectionTarget) => void
  onDecrementQuantity?: (target: BundleSelectionTarget) => void
  onSaveConfiguration?: () => void
  isSaveConfirmed?: boolean
}

const reviewCategoryLabels: Record<ReviewCategory, string> = {
  cameras: 'Cameras',
  sensors: 'Sensors',
  accessories: 'Accessories',
  plan: 'Plan',
}

const reviewCategoryOrder: ReviewCategory[] = [
  'cameras',
  'sensors',
  'accessories',
  'plan',
]

export function ReviewPanel({
  lines,
  shippingLine,
  totals,
  onIncrementQuantity,
  onDecrementQuantity,
  onSaveConfiguration,
  isSaveConfirmed = false,
}: ReviewPanelProps) {
  const handleCheckout = () => {
    window.alert('Checkout is a prototype placeholder.')
  }

  return (
    <aside className="review-panel" aria-labelledby="review-panel-title">
      <span className="review-panel__eyebrow">Review</span>

      <div className="review-panel__body">
        <div className="review-panel__list">
          <h2 id="review-panel-title">Your security system</h2>
          <p className="review-panel__intro">
            Review your personalized protection system designed to keep what matters
            most safe.
          </p>

          <div className="review-panel__groups">
            {reviewCategoryOrder.map((category) => {
              const categoryLines = lines.filter((line) => line.category === category)

              if (categoryLines.length === 0) {
                return null
              }

              return (
                <section className="review-group" key={category}>
                  <h3>{reviewCategoryLabels[category]}</h3>
                  {categoryLines.map((line) => (
                    <ReviewLineItem
                      key={line.id}
                      line={line}
                      onIncrementQuantity={onIncrementQuantity}
                      onDecrementQuantity={onDecrementQuantity}
                    />
                  ))}
                </section>
              )
            })}
          </div>

          <div className="review-panel__shipping">
            <span className="review-panel__shipping-media" aria-hidden="true">
              <img src={shippingLine.iconSrc} alt="" />
            </span>
            <span className="review-panel__shipping-label">
              {shippingLine.label}
            </span>
            <s>{formatCurrency(shippingLine.compareAtCents)}</s>
            <strong>
              {shippingLine.activeCents === 0
                ? 'FREE'
                : formatCurrency(shippingLine.activeCents)}
            </strong>
          </div>
        </div>

        <div className="review-panel__actions">
          <div className="review-panel__summary-row">
            <div className="review-panel__satisfaction-container">
              <img
                className="review-panel__satisfaction"
                src={satisfactionBadge}
                alt="Satisfaction guarantee"
              />
              <p className="review-panel__returns-text">
                <strong>30-day hassle-free returns</strong> If you're not totally in
                love with the product, we will refund you 100%.
              </p>
            </div>

            <div className="review-panel__summary-copy">
              <p className="review-panel__financing">as low as $19.19/mo</p>

              <div className="review-panel__total">
                <span>Total</span>
                <s>{formatCurrency(totals.compareAtCents)}</s>
                <strong>{formatCurrency(totals.activeCents)}</strong>
              </div>
            </div>
          </div>

          <p className="review-panel__savings">
            Congrats! You’re saving {formatCurrency(totals.savingsCents)} on your
            security bundle!
          </p>

          <button
            className="review-panel__checkout"
            type="button"
            onClick={handleCheckout}
          >
            Checkout
          </button>
          <button
            className="review-panel__save"
            type="button"
            onClick={onSaveConfiguration}
            data-saved={isSaveConfirmed}
            aria-live="polite"
          >
            {isSaveConfirmed ? 'Saved! Your system is ready for later' : 'Save my system for later'}
          </button>
        </div>
      </div>
    </aside>
  )
}
