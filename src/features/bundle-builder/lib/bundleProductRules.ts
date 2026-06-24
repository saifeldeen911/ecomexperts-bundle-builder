import type { BundleProduct } from '../types'

type ProductRuleSource = Pick<BundleProduct, 'sectionId'>

export const isSingleSelectProduct = (product: ProductRuleSource) =>
  product.sectionId === 'plan'

export const isQuantityEditableProduct = (product: ProductRuleSource) =>
  !isSingleSelectProduct(product)
