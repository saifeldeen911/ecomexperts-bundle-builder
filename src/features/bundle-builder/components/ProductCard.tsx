import {
  formatCompareAtPrice,
  formatPrice,
} from '../lib/bundleCalculations'
import { isQuantityEditableProduct } from '../lib/bundleProductRules'
import type {
  BundleProduct,
  BundleSelectionTarget,
  SelectionId,
} from '../types'
import { QuantityStepper } from './QuantityStepper'
import { VariantSelector } from './VariantSelector'

interface ProductCardProps {
  product: BundleProduct
  activeSelectionId: SelectionId
  quantity: number
  isSelected: boolean
  onSelectVariant: (target: BundleSelectionTarget) => void
  onIncrementQuantity: (target: BundleSelectionTarget) => void
  onDecrementQuantity: (target: BundleSelectionTarget) => void
}

export function ProductCard({
  product,
  activeSelectionId,
  quantity,
  isSelected,
  onSelectVariant,
  onIncrementQuantity,
  onDecrementQuantity,
}: ProductCardProps) {
  const compareAtPrice = formatCompareAtPrice(product.pricing)
  const variants = product.variants ?? []
  const hasVariants = variants.length > 0
  const isQuantityEditable = isQuantityEditableProduct(product)
  const visibleSelectionId = hasVariants
    ? activeSelectionId
    : product.defaultSelectionId
  const selectionTarget: BundleSelectionTarget = {
    productId: product.id,
    selectionId: visibleSelectionId,
  }

  return (
    <article
      className="product-card"
      data-selected={isSelected}
      data-product-id={product.id}
      data-stacked-image={product.stackedImage !== undefined}
    >
      <div
        className="product-card__media"
        aria-label={product.image.alt}
        style={{
          width: product.image.width,
          height: product.image.height,
        }}
      >
        {product.badge !== undefined && (
          <span className="product-card__badge">{product.badge}</span>
        )}
        {product.image.isExported && (
          <img
            className="product-card__image product-card__image--default"
            src={product.image.path}
            alt={product.image.alt}
          />
        )}
        {product.stackedImage?.isExported === true && (
          <img
            className="product-card__image product-card__image--stacked"
            src={product.stackedImage.path}
            alt={product.stackedImage.alt}
          />
        )}
      </div>

      <div className="product-card__details">
        <div className="product-card__content">
          <h3>{product.name}</h3>
          {product.description !== undefined && (
            <p>
              {product.description}{' '}
              {product.learnMoreHref !== undefined && (
                <a href={product.learnMoreHref}>Learn More</a>
              )}
            </p>
          )}
        </div>

        {hasVariants && (
          <VariantSelector
            variants={variants}
            activeVariantId={visibleSelectionId}
            productName={product.name}
            onSelect={(variantId) =>
              onSelectVariant({
                productId: product.id,
                selectionId: variantId,
              })
            }
          />
        )}

        <div
          className="product-card__footer"
          data-quantity-editable={isQuantityEditable}
        >
          {isQuantityEditable && (
            <QuantityStepper
              value={quantity}
              label={`${product.name} quantity`}
              onIncrement={() => onIncrementQuantity(selectionTarget)}
              onDecrement={() => onDecrementQuantity(selectionTarget)}
              min={product.isRequired ? 1 : 0}
              isDisabled={product.isRequired === true}
            />
          )}
          <div className="product-card__price">
            {compareAtPrice !== undefined && <s>{compareAtPrice}</s>}
            <strong>{formatPrice(product.pricing)}</strong>
          </div>
        </div>
      </div>
    </article>
  )
}
