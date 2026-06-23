import type {
  BundleCatalog,
  BundleProduct,
  BundleQuantities,
  BundleSectionId,
  BundleTotals,
  ActiveVariantByProduct,
  ProductPricing,
  ReviewLine,
  SelectionId,
  ShippingLine,
  StepProductView,
} from '../types'

const getProductSelectionEntries = (
  product: BundleProduct,
  quantities: BundleQuantities,
) => {
  const selections = quantities[product.id] ?? {}

  return Object.entries(selections).filter(([, quantity]) => quantity > 0)
}

export const getProductQuantityTotal = (
  product: BundleProduct,
  quantities: BundleQuantities,
) =>
  getProductSelectionEntries(product, quantities).reduce(
    (total, [, quantity]) => total + quantity,
    0,
  )

export const getSelectionQuantity = (
  product: BundleProduct,
  selectionId: SelectionId,
  quantities: BundleQuantities,
) => quantities[product.id]?.[selectionId] ?? 0

export const getStepProductViews = (
  catalog: BundleCatalog,
  sectionId: BundleSectionId,
  activeVariantByProduct: ActiveVariantByProduct,
  quantities: BundleQuantities,
): StepProductView[] => {
  const section = catalog.sections.find(({ id }) => id === sectionId)

  if (section === undefined) {
    throw new Error(`Missing bundle section: ${sectionId}`)
  }

  return section.productIds.map((productId) => {
    const product = catalog.products.find(({ id }) => id === productId)

    if (product === undefined) {
      throw new Error(`Missing bundle product: ${productId}`)
    }

    const activeSelectionId =
      activeVariantByProduct[product.id] ?? product.defaultSelectionId

    return {
      product,
      activeSelectionId,
      activeQuantity: getSelectionQuantity(
        product,
        activeSelectionId,
        quantities,
      ),
      isSelected: getProductQuantityTotal(product, quantities) > 0,
    }
  })
}

export const getSelectedCountForSection = (
  catalog: BundleCatalog,
  sectionId: BundleSectionId,
  quantities: BundleQuantities,
) =>
  catalog.products.filter(
    (product) =>
      product.sectionId === sectionId &&
      getProductQuantityTotal(product, quantities) > 0,
  ).length

const getReviewPricing = (product: BundleProduct): ProductPricing =>
  product.reviewPricing ?? product.pricing

const getReviewImage = (
  product: BundleProduct,
  selectionId: SelectionId,
): BundleProduct['image'] => {
  if (selectionId === product.defaultSelectionId) {
    return product.reviewImage ?? product.image
  }

  const variant = product.variants?.find(({ id }) => id === selectionId)

  return variant?.image ?? product.reviewImage ?? product.image
}

export const deriveReviewLines = (
  catalog: BundleCatalog,
  quantities: BundleQuantities,
): ReviewLine[] =>
  catalog.products.flatMap((product) => {
    const selectedEntries = getProductSelectionEntries(product, quantities)
    const shouldShowVariantLabel = selectedEntries.length > 1

    return selectedEntries.map(([selectionId, quantity]) => {
      const variant = product.variants?.find(({ id }) => id === selectionId)

      return {
        id: `${product.id}:${selectionId}`,
        productId: product.id,
        selectionId,
        category: product.reviewCategory,
        name: product.name,
        variantLabel: shouldShowVariantLabel ? variant?.label : undefined,
        quantity,
        image: getReviewImage(product, selectionId),
        pricing: getReviewPricing(product),
        isRequired: product.isRequired,
      }
    })
  })

const getLineActiveTotal = (line: ReviewLine) =>
  line.pricing.activeCents * line.quantity

const getLineCompareAtTotal = (line: ReviewLine) =>
  (line.pricing.compareAtCents ?? line.pricing.activeCents) * line.quantity

export const calculateBundleTotals = (
  reviewLines: ReviewLine[],
  shippingLine: ShippingLine,
): BundleTotals => {
  const lineTotals = reviewLines.reduce(
    (totals, line) => ({
      activeCents: totals.activeCents + getLineActiveTotal(line),
      compareAtCents: totals.compareAtCents + getLineCompareAtTotal(line),
    }),
    { activeCents: 0, compareAtCents: 0 },
  )

  const activeCents = lineTotals.activeCents + shippingLine.activeCents
  const compareAtCents =
    lineTotals.compareAtCents +
    (shippingLine.includeCompareAtInTotals ? shippingLine.compareAtCents : 0)

  return {
    activeCents,
    compareAtCents,
    savingsCents: Math.max(compareAtCents - activeCents, 0),
  }
}

export const formatCurrency = (cents: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100)

export const formatPrice = (pricing: ProductPricing) => {
  const value = formatCurrency(pricing.activeCents)

  return pricing.cadence === 'monthly' ? `${value}/mo` : value
}

export const formatCompareAtPrice = (pricing: ProductPricing) => {
  if (pricing.compareAtCents === undefined) {
    return undefined
  }

  const value = formatCurrency(pricing.compareAtCents)

  return pricing.cadence === 'monthly' ? `${value}/mo` : value
}
