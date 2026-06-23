export type BundleSectionId = 'cameras' | 'plan' | 'sensors' | 'protection'

export type ReviewCategory = 'cameras' | 'sensors' | 'accessories' | 'plan'

export type ProductId = string

export type SelectionId = string

export interface BundleSelectionTarget {
  productId: ProductId
  selectionId: SelectionId
}

export interface ProductImage {
  path: string
  alt: string
  isExported: boolean
  width: number
  height: number
}

export interface ProductVariant {
  id: SelectionId
  label: string
  image?: ProductImage
}

export interface ProductPricing {
  activeCents: number
  compareAtCents?: number
  cadence?: 'monthly'
}

export interface BundleProduct {
  id: ProductId
  sectionId: BundleSectionId
  reviewCategory: ReviewCategory
  name: string
  description?: string
  learnMoreHref?: string
  badge?: string
  image: ProductImage
  stackedImage?: ProductImage
  reviewImage?: ProductImage
  pricing: ProductPricing
  reviewPricing?: ProductPricing
  variants?: ProductVariant[]
  defaultSelectionId: SelectionId
  isRequired?: boolean
}

export interface BundleSection {
  id: BundleSectionId
  stepNumber: number
  eyebrow: string
  title: string
  iconSrc: string
  productIds: ProductId[]
  nextLabel?: string
}

export interface ShippingLine {
  id: string
  label: string
  compareAtCents: number
  activeCents: number
  iconSrc: string
  includeCompareAtInTotals: boolean
}

export interface BundleCatalog {
  sections: BundleSection[]
  products: BundleProduct[]
  shippingLine: ShippingLine
}

export type BundleQuantities = Record<ProductId, Record<SelectionId, number>>

export type ActiveVariantByProduct = Record<ProductId, SelectionId>

export interface ReviewLine {
  id: string
  productId: ProductId
  selectionId: SelectionId
  category: ReviewCategory
  name: string
  variantLabel?: string
  quantity: number
  image: ProductImage
  pricing: ProductPricing
  isRequired?: boolean
}

export interface BundleTotals {
  activeCents: number
  compareAtCents: number
  savingsCents: number
}

export interface StepProductView {
  product: BundleProduct
  activeSelectionId: SelectionId
  activeQuantity: number
  isSelected: boolean
}
