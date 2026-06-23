import { useRef, useEffect } from 'react'
import iconChevronDown from '../../../assets/bundle/icon-chevron-down.svg'
import type {
  BundleSection,
  BundleSectionId,
  BundleSelectionTarget,
  StepProductView,
} from '../types'
import { ProductCard } from './ProductCard'

interface AccordionStepProps {
  section: BundleSection
  isOpen: boolean
  selectedCount: number
  products: StepProductView[]
  onOpen?: (sectionId: BundleSectionId) => void
  onNext?: (sectionId: BundleSectionId) => void
  onSelectVariant?: (target: BundleSelectionTarget) => void
  onIncrementQuantity?: (target: BundleSelectionTarget) => void
  onDecrementQuantity?: (target: BundleSelectionTarget) => void
}

export function AccordionStep({
  section,
  isOpen,
  selectedCount,
  products,
  onOpen,
  onNext,
  onSelectVariant,
  onIncrementQuantity,
  onDecrementQuantity,
}: AccordionStepProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = contentRef.current
    if (!el) return

    if (isOpen) {
      // After transition ends, allow overflow so dropdowns/tooltips aren't clipped
      const handleEnd = () => {
        el.style.overflow = 'visible'
      }
      el.addEventListener('transitionend', handleEnd, { once: true })
      el.style.overflow = 'hidden'
      return () => el.removeEventListener('transitionend', handleEnd)
    } else {
      el.style.overflow = 'hidden'
    }
  }, [isOpen])

  return (
    <section className="accordion-step" data-open={isOpen}>
      <div className="accordion-step__eyebrow">{section.eyebrow}</div>

      <div className="accordion-step__frame">
        <button
          className="accordion-step__header"
          type="button"
          aria-expanded={isOpen}
          onClick={onOpen === undefined ? undefined : () => onOpen(section.id)}
        >
          <span className="accordion-step__title">
            <img src={section.iconSrc} alt="" aria-hidden="true" />
            <strong>{section.title}</strong>
          </span>
          <span className="accordion-step__status">
            <span className="accordion-step__count">{selectedCount} selected</span>
            <img
              src={iconChevronDown}
              alt=""
              aria-hidden="true"
            />
          </span>
        </button>

        <div
          className="accordion-step__collapse"
          ref={contentRef}
          aria-hidden={!isOpen}
          inert={!isOpen}
        >
          <div className="accordion-step__collapse-inner">
            <div className="accordion-step__products">
              {products.map((productView) => (
                <ProductCard
                  key={productView.product.id}
                  product={productView.product}
                  activeSelectionId={productView.activeSelectionId}
                  quantity={productView.activeQuantity}
                  isSelected={productView.isSelected}
                  onSelectVariant={onSelectVariant}
                  onIncrementQuantity={onIncrementQuantity}
                  onDecrementQuantity={onDecrementQuantity}
                />
              ))}
            </div>

            {section.nextLabel !== undefined && (
              <button
                className="accordion-step__next"
                type="button"
                onClick={onNext === undefined ? undefined : () => onNext(section.id)}
              >
                Next: {section.nextLabel}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
