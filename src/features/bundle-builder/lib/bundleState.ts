import type {
  ActiveVariantByProduct,
  BundleCatalog,
  BundleProduct,
  BundleQuantities,
  BundleSectionId,
  BundleSelectionTarget,
  ProductId,
  SelectionId,
} from '../types'
import { isSingleSelectProduct } from './bundleProductRules'

const STORAGE_KEY = 'ecomexperts.bundleBuilder.configuration.v1'
const STORAGE_VERSION = 1

export interface BundleBuilderState {
  openSectionId: BundleSectionId | null
  activeVariantByProduct: ActiveVariantByProduct
  quantities: BundleQuantities
}

export interface BundleBuilderInitialStateInput {
  catalog: BundleCatalog
  quantities: BundleQuantities
  activeVariantByProduct: ActiveVariantByProduct
}

export type BundleBuilderAction =
  | { type: 'open_step'; sectionId: BundleSectionId }
  | { type: 'advance_step'; nextSectionId: BundleSectionId }
  | { type: 'select_variant'; target: BundleSelectionTarget }
  | { type: 'increment_quantity'; target: BundleSelectionTarget }
  | { type: 'decrement_quantity'; target: BundleSelectionTarget }
  | {
      type: 'set_quantity'
      target: BundleSelectionTarget
      quantity: number
    }
  | { type: 'restore_configuration'; state: BundleBuilderState }

interface SavedBundleBuilderState {
  version: typeof STORAGE_VERSION
  state: BundleBuilderState
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const cloneQuantities = (quantities: BundleQuantities): BundleQuantities => {
  const cloned: BundleQuantities = {}

  Object.entries(quantities).forEach(([productId, selections]) => {
    cloned[productId] = { ...selections }
  })

  return cloned
}

const cloneActiveVariants = (
  activeVariantByProduct: ActiveVariantByProduct,
): ActiveVariantByProduct => ({ ...activeVariantByProduct })

const cloneState = (state: BundleBuilderState): BundleBuilderState => ({
  openSectionId: state.openSectionId,
  activeVariantByProduct: cloneActiveVariants(state.activeVariantByProduct),
  quantities: cloneQuantities(state.quantities),
})

const getProductById = (catalog: BundleCatalog, productId: ProductId) =>
  catalog.products.find(({ id }) => id === productId)

const getValidSelectionIds = (
  catalog: BundleCatalog,
  productId: ProductId,
): Set<SelectionId> => {
  const product = getProductById(catalog, productId)

  if (product === undefined) {
    return new Set()
  }

  const selectionIds = product.variants?.map(({ id }) => id) ?? [
    product.defaultSelectionId,
  ]

  return new Set(selectionIds)
}

const clampQuantityForProduct = (
  catalog: BundleCatalog,
  productId: ProductId,
  quantity: number,
) => {
  const product = getProductById(catalog, productId)

  if (product === undefined || !Number.isFinite(quantity)) {
    return 0
  }

  const integerQuantity = Math.max(0, Math.trunc(quantity))

  return isSingleSelectProduct(product) && integerQuantity > 0
    ? 1
    : integerQuantity
}

const getFirstSelectionId = (
  selections: Record<SelectionId, number> | undefined,
) => Object.keys(selections ?? {})[0] as SelectionId | undefined

const enforceSingleSelectProducts = (
  catalog: BundleCatalog,
  quantities: BundleQuantities,
  fallback?: BundleQuantities,
): BundleQuantities => {
  const normalized = cloneQuantities(quantities)

  catalog.sections.forEach((section) => {
    const singleSelectProducts = section.productIds
      .map((productId) => getProductById(catalog, productId))
      .filter(
        (product): product is BundleProduct =>
          product !== undefined && isSingleSelectProduct(product),
      )

    if (singleSelectProducts.length === 0) {
      return
    }

    const selectedProduct =
      singleSelectProducts.find(
        (product) => getFirstSelectionId(normalized[product.id]) !== undefined,
      ) ??
      singleSelectProducts.find(
        (product) => getFirstSelectionId(fallback?.[product.id]) !== undefined,
      )

    singleSelectProducts.forEach(({ id }) => {
      delete normalized[id]
    })

    if (selectedProduct === undefined) {
      return
    }

    const selectedSelections =
      quantities[selectedProduct.id] ?? fallback?.[selectedProduct.id]
    const selectionId = getFirstSelectionId(selectedSelections)

    if (
      selectionId !== undefined &&
      getValidSelectionIds(catalog, selectedProduct.id).has(selectionId)
    ) {
      normalized[selectedProduct.id] = { [selectionId]: 1 }
    }
  })

  return normalized
}

const isValidSectionId = (
  catalog: BundleCatalog,
  sectionId: unknown,
): sectionId is BundleSectionId =>
  typeof sectionId === 'string' &&
  catalog.sections.some(({ id }) => id === sectionId)

const normalizeActiveVariants = (
  catalog: BundleCatalog,
  activeVariantByProduct: unknown,
  fallback: ActiveVariantByProduct,
): ActiveVariantByProduct => {
  const normalized = cloneActiveVariants(fallback)

  if (!isRecord(activeVariantByProduct)) {
    return normalized
  }

  Object.entries(activeVariantByProduct).forEach(([productId, selectionId]) => {
    if (
      typeof selectionId === 'string' &&
      getValidSelectionIds(catalog, productId).has(selectionId)
    ) {
      normalized[productId] = selectionId
    }
  })

  return normalized
}

const normalizeQuantities = (
  catalog: BundleCatalog,
  quantities: unknown,
  fallback?: BundleQuantities,
): BundleQuantities => {
  if (!isRecord(quantities)) {
    return enforceSingleSelectProducts(catalog, {}, fallback)
  }

  const normalized: BundleQuantities = {}

  Object.entries(quantities).forEach(([productId, selections]) => {
    if (!isRecord(selections)) {
      return
    }

    const validSelectionIds = getValidSelectionIds(catalog, productId)
    const normalizedSelections: Record<SelectionId, number> = {}

    Object.entries(selections).forEach(([selectionId, quantity]) => {
      if (
        validSelectionIds.has(selectionId) &&
        typeof quantity === 'number' &&
        Number.isInteger(quantity) &&
        quantity > 0
      ) {
        normalizedSelections[selectionId] = clampQuantityForProduct(
          catalog,
          productId,
          quantity,
        )
      }
    })

    if (Object.keys(normalizedSelections).length > 0) {
      normalized[productId] = normalizedSelections
    }
  })

  return enforceSingleSelectProducts(catalog, normalized, fallback)
}

const normalizeSavedState = (
  catalog: BundleCatalog,
  value: unknown,
  fallback: BundleBuilderState,
): BundleBuilderState | undefined => {
  if (!isRecord(value) || value.version !== STORAGE_VERSION) {
    return undefined
  }

  const state = value.state

  if (!isRecord(state)) {
    return undefined
  }

  return {
    openSectionId: isValidSectionId(catalog, state.openSectionId)
      ? state.openSectionId
      : fallback.openSectionId,
    activeVariantByProduct: normalizeActiveVariants(
      catalog,
      state.activeVariantByProduct,
      fallback.activeVariantByProduct,
    ),
    quantities: normalizeQuantities(
      catalog,
      state.quantities,
      fallback.quantities,
    ),
  }
}

const getSelectionQuantity = (
  quantities: BundleQuantities,
  target: BundleSelectionTarget,
) => quantities[target.productId]?.[target.selectionId] ?? 0

const setSelectionQuantity = (
  catalog: BundleCatalog,
  quantities: BundleQuantities,
  target: BundleSelectionTarget,
  quantity: number,
): BundleQuantities => {
  const product = getProductById(catalog, target.productId)

  if (
    product === undefined ||
    !getValidSelectionIds(catalog, target.productId).has(target.selectionId)
  ) {
    return quantities
  }

  const nextQuantity = clampQuantityForProduct(
    catalog,
    target.productId,
    quantity,
  )

  if (isSingleSelectProduct(product) && nextQuantity === 0) {
    return quantities
  }

  const productQuantities = isSingleSelectProduct(product)
    ? {}
    : { ...(quantities[target.productId] ?? {}) }
  const nextQuantities = { ...quantities }

  if (isSingleSelectProduct(product) && nextQuantity > 0) {
    catalog.products.forEach((catalogProduct) => {
      if (
        catalogProduct.sectionId === product.sectionId &&
        catalogProduct.id !== product.id
      ) {
        delete nextQuantities[catalogProduct.id]
      }
    })
  }

  if (nextQuantity === 0) {
    delete productQuantities[target.selectionId]
  } else {
    productQuantities[target.selectionId] = nextQuantity
  }

  if (Object.keys(productQuantities).length === 0) {
    delete nextQuantities[target.productId]
  } else {
    nextQuantities[target.productId] = productQuantities
  }

  return nextQuantities
}

export const createInitialBundleBuilderState = ({
  catalog,
  quantities,
  activeVariantByProduct,
}: BundleBuilderInitialStateInput): BundleBuilderState => {
  const firstSection = catalog.sections[0]

  if (firstSection === undefined) {
    throw new Error('Bundle catalog requires at least one section')
  }

  return {
    openSectionId: firstSection.id,
    activeVariantByProduct: cloneActiveVariants(activeVariantByProduct),
    quantities: normalizeQuantities(catalog, quantities),
  }
}

export const loadSavedBundleBuilderState = (
  catalog: BundleCatalog,
  fallback: BundleBuilderState,
): BundleBuilderState | undefined => {
  if (typeof window === 'undefined') {
    return undefined
  }

  const savedValue = window.localStorage.getItem(STORAGE_KEY)

  if (savedValue === null) {
    return undefined
  }

  try {
    return normalizeSavedState(catalog, JSON.parse(savedValue), fallback)
  } catch {
    return undefined
  }
}

export const saveBundleBuilderState = (state: BundleBuilderState) => {
  if (typeof window === 'undefined') {
    return
  }

  const savedState: SavedBundleBuilderState = {
    version: STORAGE_VERSION,
    state,
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(savedState))
}

export const createBundleBuilderReducer = (catalog: BundleCatalog) => {
  return (
    state: BundleBuilderState,
    action: BundleBuilderAction,
  ): BundleBuilderState => {
    switch (action.type) {
      case 'open_step':
        return {
          ...state,
          openSectionId:
            state.openSectionId === action.sectionId ? null : action.sectionId,
        }

      case 'advance_step':
        return {
          ...state,
          openSectionId: action.nextSectionId,
        }

      case 'select_variant':
        return {
          ...state,
          activeVariantByProduct: {
            ...state.activeVariantByProduct,
            [action.target.productId]: action.target.selectionId,
          },
        }

      case 'increment_quantity':
        return {
          ...state,
          quantities: setSelectionQuantity(
            catalog,
            state.quantities,
            action.target,
            getSelectionQuantity(state.quantities, action.target) + 1,
          ),
        }

      case 'decrement_quantity':
        return {
          ...state,
          quantities: setSelectionQuantity(
            catalog,
            state.quantities,
            action.target,
            getSelectionQuantity(state.quantities, action.target) - 1,
          ),
        }

      case 'set_quantity':
        return {
          ...state,
          quantities: setSelectionQuantity(
            catalog,
            state.quantities,
            action.target,
            action.quantity,
          ),
        }

      case 'restore_configuration':
        return cloneState(action.state)

      default:
        throw new Error('Unknown bundle builder action')
    }
  }
}
