import iconCamera from '../assets/bundle/icon-camera.svg'
import iconPlan from '../assets/bundle/icon-plan.svg'
import iconProtection from '../assets/bundle/icon-protection.svg'
import iconSensors from '../assets/bundle/icon-sensors.svg'
import iconShipping from '../assets/bundle/icon-shipping.svg'
import planImage from '../assets/bundle/wyze-plan.svg'
import microSdImage from '../assets/images/Black 256GB microSD card with the Wyze logo on it. Includes Class 10 and UHS-3 (U3) labelling..png'
import senseHubImage from '../assets/images/Wyze Sense Hub.png'
import senseMotionImage from '../assets/images/Wyze Sense Motion Sensor.png'
import camV4BlackVariantImage from '../assets/images/Wyze-Cam-v4-black.png'
import camV4GreyVariantImage from '../assets/images/Wyze-Cam-v4-grey.png'
import camV4WhiteVariantImage from '../assets/images/Wyze-Cam-v4-white.png'
import panV3BlackVariantImage from '../assets/images/Wyze-cam-pan-v3-black.png'
import panV3WhiteVariantImage from '../assets/images/Wyze-cam-pan-v3-white.png'
import batteryCamImage from '../assets/images/Wyze-cam-pro.png'
import batteryCamBlackVariantImage from '../assets/images/Wyze-cam-pro-black.png'
import batteryCamWhiteVariantImage from '../assets/images/Wyze-cam-pro-white.png'
import floodlightImage from '../assets/images/Wyze-cam-v2.png'
import floodlightVerticalCardImage from '../assets/images/Wyze-cam-v2-vertical-card.png'
import floodlightBlackVariantImage from '../assets/images/Wyze-cam-v2-black.png'
import floodlightWhiteVariantImage from '../assets/images/Wyze-cam-v2-white.png'
import panV3Image from '../assets/images/Wyze-cam-pan-v3.png'
import panV3VerticalCardImage from '../assets/images/Wyze-cam-pan-v3-vertical-card.png'
import doorbellImage from '../assets/images/Wyze-doorbell.png'
import doorbellVerticalCardImage from '../assets/images/Wyze-doorbell-vertical-card.png'
import camV4ReviewImage from '../assets/images/Wyze_Cam_V4_review.png'
import panV3ReviewImage from '../assets/images/Wyze-cam-pan-v3-review.png'
import camV4Image from '../assets/images/Wyze_Cam_V4_01.0001.png'
import camV4VerticalCardImage from '../assets/images/Wyze_Cam_V4_01.0001_vertical_card.png'
import bundleDataJson from './bundleData.json'
import type {
  ActiveVariantByProduct,
  BundleCatalog,
  BundleProduct,
  BundleQuantities,
  BundleSection,
  ProductImage,
  ProductPricing,
  ProductVariant,
  ShippingLine,
} from '../features/bundle-builder/types'

const assets = {
  iconCamera,
  iconPlan,
  iconProtection,
  iconSensors,
  iconShipping,
  planImage,
  microSdImage,
  senseHubImage,
  senseMotionImage,
  camV4BlackVariantImage,
  camV4GreyVariantImage,
  camV4WhiteVariantImage,
  panV3BlackVariantImage,
  panV3WhiteVariantImage,
  batteryCamImage,
  batteryCamBlackVariantImage,
  batteryCamWhiteVariantImage,
  floodlightImage,
  floodlightVerticalCardImage,
  floodlightBlackVariantImage,
  floodlightWhiteVariantImage,
  panV3Image,
  panV3VerticalCardImage,
  doorbellImage,
  doorbellVerticalCardImage,
  camV4ReviewImage,
  panV3ReviewImage,
  camV4Image,
  camV4VerticalCardImage,
} as const

type AssetKey = keyof typeof assets

interface ImageMetadata {
  alt: string
  width: number
  height: number
}

const imageMetadata: Record<AssetKey, ImageMetadata> = {
  iconCamera: { alt: '', width: 26, height: 26 },
  iconPlan: { alt: '', width: 26, height: 26 },
  iconProtection: { alt: '', width: 26, height: 26 },
  iconSensors: { alt: '', width: 26, height: 26 },
  iconShipping: { alt: '', width: 32, height: 32 },
  planImage: { alt: 'Cam Unlimited plan', width: 41, height: 41 },
  microSdImage: { alt: 'Wyze MicroSD Card 256GB', width: 41, height: 41 },
  senseHubImage: { alt: 'Wyze Sense Hub', width: 41, height: 40 },
  senseMotionImage: {
    alt: 'Wyze Sense Motion Sensor',
    width: 41,
    height: 41,
  },
  camV4BlackVariantImage: { alt: 'Black Wyze Cam v4', width: 23, height: 22 },
  camV4GreyVariantImage: { alt: 'Grey Wyze Cam v4', width: 28, height: 27 },
  camV4WhiteVariantImage: { alt: 'White Wyze Cam v4', width: 28, height: 28 },
  panV3BlackVariantImage: {
    alt: 'Black Wyze Cam Pan v3',
    width: 22,
    height: 22,
  },
  panV3WhiteVariantImage: {
    alt: 'White Wyze Cam Pan v3',
    width: 22,
    height: 22,
  },
  batteryCamImage: { alt: 'Wyze Battery Cam Pro', width: 101, height: 101 },
  batteryCamBlackVariantImage: {
    alt: 'Black Wyze Battery Cam Pro',
    width: 22,
    height: 22,
  },
  batteryCamWhiteVariantImage: {
    alt: 'White Wyze Battery Cam Pro',
    width: 22,
    height: 22,
  },
  floodlightImage: { alt: 'Wyze Cam Floodlight v2', width: 100, height: 151 },
  floodlightVerticalCardImage: {
    alt: 'Wyze Cam Floodlight v2',
    width: 225,
    height: 207,
  },
  floodlightBlackVariantImage: {
    alt: 'Black Wyze Cam Floodlight v2',
    width: 22,
    height: 22,
  },
  floodlightWhiteVariantImage: {
    alt: 'White Wyze Cam Floodlight v2',
    width: 24,
    height: 25,
  },
  panV3Image: { alt: 'Wyze Cam Pan v3', width: 101, height: 137 },
  panV3VerticalCardImage: { alt: 'Wyze Cam Pan v3', width: 207, height: 176 },
  doorbellImage: { alt: 'Wyze Duo Cam Doorbell', width: 101, height: 101 },
  doorbellVerticalCardImage: {
    alt: 'Wyze Duo Cam Doorbell',
    width: 153,
    height: 153,
  },
  camV4ReviewImage: { alt: 'Wyze Cam v4', width: 41, height: 41 },
  panV3ReviewImage: { alt: 'Wyze Cam Pan v3', width: 41, height: 41 },
  camV4Image: { alt: 'Wyze Cam v4', width: 101, height: 137 },
  camV4VerticalCardImage: { alt: 'Wyze Cam v4', width: 203, height: 118 },
}

interface JsonDiscount {
  type: 'percentage'
  value: number
}

interface JsonVariant {
  id: string
  label: string
  imageKey?: string
}

type JsonPricing = ProductPricing

interface JsonProduct
  extends Omit<
    BundleProduct,
    'badge' | 'image' | 'stackedImage' | 'reviewImage' | 'variants'
  > {
  discount?: JsonDiscount
  imageKey: string
  stackedImageKey?: string
  reviewImageKey?: string
  pricing: JsonPricing
  reviewPricing?: JsonPricing
  variants?: JsonVariant[]
}

interface JsonSection extends Omit<BundleSection, 'iconSrc'> {
  iconKey: string
}

interface JsonShippingLine extends Omit<ShippingLine, 'iconSrc'> {
  iconKey: string
}

interface BundleDataJson {
  defaults: {
    selectionId: string
  }
  sections: JsonSection[]
  products: JsonProduct[]
  initialConfiguration: {
    quantities: BundleQuantities
    activeVariantByProduct: ActiveVariantByProduct
  }
  shippingLine: JsonShippingLine
}

const bundleData = bundleDataJson as BundleDataJson

const resolveAsset = (assetKey: string) => {
  const asset = assets[assetKey as AssetKey]

  if (asset === undefined) {
    throw new Error(`Missing bundle data asset: ${assetKey}`)
  }

  return asset
}

const resolveImageMetadata = (assetKey: string) => {
  const metadata = imageMetadata[assetKey as AssetKey]

  if (metadata === undefined) {
    throw new Error(`Missing bundle image metadata: ${assetKey}`)
  }

  return metadata
}

const productImage = (assetKey: string): ProductImage => ({
  path: resolveAsset(assetKey),
  ...resolveImageMetadata(assetKey),
  isExported: true,
})

const productVariant = (variant: JsonVariant): ProductVariant => ({
  id: variant.id,
  label: variant.label,
  image:
    variant.imageKey === undefined ? undefined : productImage(variant.imageKey),
})

const discountBadge = (discount: JsonDiscount | undefined) => {
  if (discount === undefined) {
    return undefined
  }

  return `Save ${discount.value}%`
}

export const DEFAULT_SELECTION_ID = bundleData.defaults.selectionId

export const bundleSections: BundleSection[] = bundleData.sections.map(
  ({ iconKey, ...section }) => ({
    ...section,
    iconSrc: resolveAsset(iconKey),
  }),
)

export const bundleProducts: BundleProduct[] = bundleData.products.map(
  ({ discount, imageKey, stackedImageKey, reviewImageKey, variants, ...product }) => ({
    ...product,
    badge: discountBadge(discount),
    image: productImage(imageKey),
    stackedImage:
      stackedImageKey === undefined ? undefined : productImage(stackedImageKey),
    reviewImage:
      reviewImageKey === undefined ? undefined : productImage(reviewImageKey),
    variants: variants?.map(productVariant),
  }),
)

export const initialBundleQuantities =
  bundleData.initialConfiguration.quantities

export const initialActiveVariantByProduct =
  bundleData.initialConfiguration.activeVariantByProduct

const { iconKey: shippingIconKey, ...shippingLine } = bundleData.shippingLine

export const bundleCatalog: BundleCatalog = {
  sections: bundleSections,
  products: bundleProducts,
  shippingLine: {
    ...shippingLine,
    iconSrc: resolveAsset(shippingIconKey),
  },
}
