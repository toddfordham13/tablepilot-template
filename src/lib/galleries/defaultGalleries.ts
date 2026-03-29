import { gallery as bodegaGallery } from "@/content/restaurants/bodega/gallery"
import { gallery as fuegoGallery } from "@/content/restaurants/fuego/gallery"

import {
  cloneGalleryContent,
  sanitiseGalleryContent,
  type GalleryContent,
} from "./types"

function normaliseDefaultGallery(input: {
  title: string
  description: string
  images: Array<{ src: string; alt: string }>
}): GalleryContent {
  const safeGallery = sanitiseGalleryContent({
    title: input.title,
    description: input.description,
    images: input.images.map((image, index) => ({
      id: `image-${index + 1}`,
      src: image.src,
      alt: image.alt,
      visible: true,
      sortOrder: index + 1,
    })),
  })

  if (!safeGallery) {
    throw new Error("Invalid default gallery content")
  }

  return safeGallery
}

const defaultGalleries: Record<string, GalleryContent> = {
  bodega: normaliseDefaultGallery(bodegaGallery),
  fuego: normaliseDefaultGallery(fuegoGallery),
}

export function getAvailableGalleryConcepts() {
  return Object.keys(defaultGalleries)
}

export function getDefaultGalleryForConcept(concept: string): GalleryContent {
  const gallery = defaultGalleries[concept]

  if (!gallery) {
    throw new Error(`No default gallery for concept: ${concept}`)
  }

  return cloneGalleryContent(gallery)
}