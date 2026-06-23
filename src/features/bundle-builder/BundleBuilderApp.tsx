import { useReducer } from 'react'
import {
  bundleCatalog,
  initialActiveVariantByProduct,
  initialBundleQuantities,
} from '../../data/bundleData'
import {
  calculateBundleTotals,
  deriveReviewLines,
  getSelectedCountForSection,
  getStepProductViews,
} from './lib/bundleCalculations'
import {
  bundleBuilderReducer,
  createInitialBundleBuilderState,
  loadSavedBundleBuilderState,
  saveBundleBuilderState,
  type BundleBuilderInitialStateInput,
} from './lib/bundleState'
import './bundle-builder.css'
import { AccordionStep } from './components/AccordionStep'
import { ReviewPanel } from './components/ReviewPanel'
import type {
  BundleSectionId,
  BundleSelectionTarget,
} from './types'

const initialStateInput: BundleBuilderInitialStateInput = {
  catalog: bundleCatalog,
  quantities: initialBundleQuantities,
  activeVariantByProduct: initialActiveVariantByProduct,
}

const createHydratedInitialState = (input: BundleBuilderInitialStateInput) => {
  const fallbackState = createInitialBundleBuilderState(input)

  return loadSavedBundleBuilderState(input.catalog, fallbackState) ?? fallbackState
}

const getNextSectionId = (
  sectionId: BundleSectionId,
): BundleSectionId | undefined => {
  const sectionIndex = bundleCatalog.sections.findIndex(
    ({ id }) => id === sectionId,
  )
  const nextSection = bundleCatalog.sections[sectionIndex + 1]

  return nextSection?.id
}

export function BundleBuilderApp() {
  const [state, dispatch] = useReducer(
    bundleBuilderReducer,
    initialStateInput,
    createHydratedInitialState,
  )
  const reviewLines = deriveReviewLines(bundleCatalog, state.quantities)
  const totals = calculateBundleTotals(
    reviewLines,
    bundleCatalog.shippingLine,
  )
  const handleOpenStep = (sectionId: BundleSectionId) => {
    dispatch({ type: 'open_step', sectionId })
  }
  const handleNextStep = (sectionId: BundleSectionId) => {
    const nextSectionId = getNextSectionId(sectionId)

    if (nextSectionId !== undefined) {
      dispatch({ type: 'advance_step', nextSectionId })
    }
  }
  const handleSelectVariant = (target: BundleSelectionTarget) => {
    dispatch({ type: 'select_variant', target })
  }
  const handleIncrementQuantity = (target: BundleSelectionTarget) => {
    dispatch({ type: 'increment_quantity', target })
  }
  const handleDecrementQuantity = (target: BundleSelectionTarget) => {
    dispatch({ type: 'decrement_quantity', target })
  }
  const handleSaveConfiguration = () => {
    saveBundleBuilderState(state)
  }

  return (
    <main className="bundle-builder" aria-label="Bundle builder">
      <h1 className="bundle-builder__mobile-title">Let’s get started!</h1>
      <div className="bundle-builder__builder">
        {bundleCatalog.sections.map((section) => {
          return (
            <AccordionStep
              key={section.id}
              section={section}
              isOpen={state.openSectionId === section.id}
              selectedCount={getSelectedCountForSection(
                bundleCatalog,
                section.id,
                state.quantities,
              )}
              products={getStepProductViews(
                bundleCatalog,
                section.id,
                state.activeVariantByProduct,
                state.quantities,
              )}
              onOpen={handleOpenStep}
              onNext={handleNextStep}
              onSelectVariant={handleSelectVariant}
              onIncrementQuantity={handleIncrementQuantity}
              onDecrementQuantity={handleDecrementQuantity}
            />
          )
        })}
      </div>

      <ReviewPanel
        lines={reviewLines}
        shippingLine={bundleCatalog.shippingLine}
        totals={totals}
        onIncrementQuantity={handleIncrementQuantity}
        onDecrementQuantity={handleDecrementQuantity}
        onSaveConfiguration={handleSaveConfiguration}
      />
    </main>
  )
}
