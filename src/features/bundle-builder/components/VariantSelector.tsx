import type { ProductVariant, SelectionId } from '../types'

interface VariantSelectorProps {
  variants: ProductVariant[]
  activeVariantId: SelectionId
  onSelect?: (variantId: SelectionId) => void
}

export function VariantSelector({
  variants,
  activeVariantId,
  onSelect,
}: VariantSelectorProps) {
  return (
    <div className="variant-selector" aria-label="Choose color">
      {variants.map((variant) => {
        const isActive = variant.id === activeVariantId
        const isGrey = variant.label.toLowerCase() === 'grey'
        const buttonWidth = isGrey ? 63 : 65

        return (
          <button
            type="button"
            key={variant.id}
            className="variant-selector__option"
            data-variant={variant.id}
            aria-pressed={isActive}
            disabled={onSelect === undefined}
            onClick={() => onSelect?.(variant.id)}
            style={{ width: buttonWidth }}
          >
            <span
              className="variant-selector__swatch"
              aria-hidden="true"
              style={{
                width: variant.image?.width,
                height: variant.image?.height,
              }}
            >
              {variant.image !== undefined && (
                <img src={variant.image.path} alt="" />
              )}
            </span>
            <span>{variant.label}</span>
          </button>
        )
      })}
    </div>
  )
}
