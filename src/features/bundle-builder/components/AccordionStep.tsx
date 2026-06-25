import {
  useId,
  useState,
  type TransitionEvent,
} from 'react'
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
  onOpen: (sectionId: BundleSectionId) => void
  onNext: (sectionId: BundleSectionId) => void
  onSelectVariant: (target: BundleSelectionTarget) => void
  onIncrementQuantity: (target: BundleSelectionTarget) => void
  onDecrementQuantity: (target: BundleSelectionTarget) => void
}

interface CollapseOverflowState {
  isOpen: boolean
  isVisible: boolean
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
  const headerId = useId()
  const collapseId = useId()
  const [collapseOverflow, setCollapseOverflow] =
    useState<CollapseOverflowState>(() => ({
      isOpen,
      isVisible: isOpen,
    }))

  // Keep overflow hidden during the accordion transition, then release it for shadows.
  if (collapseOverflow.isOpen !== isOpen) {
    setCollapseOverflow({
      isOpen,
      isVisible: false,
    })
  }

  const isOverflowVisible = isOpen && collapseOverflow.isVisible

  const handleCollapseTransitionEnd = (
    event: TransitionEvent<HTMLDivElement>,
  ) => {
    if (
      event.currentTarget === event.target &&
      event.propertyName === 'grid-template-rows' &&
      isOpen
    ) {
      setCollapseOverflow((current) =>
        current.isOpen === isOpen && current.isVisible
          ? current
          : {
              isOpen,
              isVisible: true,
            },
      )
    }
  }

  return (
    <section
      className="accordion-step"
      data-open={isOpen}
      aria-labelledby={headerId}
    >
      <div className="accordion-step__eyebrow">{section.eyebrow}</div>

      <div className="accordion-step__frame">
        <button
          id={headerId}
          className="accordion-step__header"
          type="button"
          aria-expanded={isOpen}
          aria-controls={collapseId}
          onClick={() => onOpen(section.id)}
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
          id={collapseId}
          className="accordion-step__collapse"
          role="region"
          aria-labelledby={headerId}
          inert={!isOpen}
          data-overflow-visible={isOverflowVisible}
          onTransitionEnd={handleCollapseTransitionEnd}
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
                onClick={() => onNext(section.id)}
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
