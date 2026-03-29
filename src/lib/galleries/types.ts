export type GalleryImage = {
  id: string
  src: string
  alt: string
  visible: boolean
  sortOrder: number
}

export type GalleryContent = {
  title: string
  description: string
  images: GalleryImage[]
}

export function sanitiseGalleryContent(
  input: GalleryContent | null | undefined
): GalleryContent | null {
  if (!input) return null

  if (!Array.isArray(input.images)) return null

  const images = input.images
    .filter((img) => img.src)
    .map((img, index) => ({
      id: img.id || `image-${index + 1}`,
      src: img.src,
      alt: img.alt || "",
      visible: img.visible ?? true,
      sortOrder: img.sortOrder ?? index + 1,
    }))

  return {
    title: input.title || "",
    description: input.description || "",
    images,
  }
}

export function cloneGalleryContent(content: GalleryContent): GalleryContent {
  return JSON.parse(JSON.stringify(content))
}