import {
  createMenuContent,
  type MenuItem,
  type MenuSection,
} from "@/lib/menus/types"

const signatureSandwiches: MenuItem[] = [
  {
    id: "laughing-cow",
    name: "The Laughing Cow",
    description:
      "Sticky black treacle braised beef shin, garlic & chive cream cheese, beer battered onion rings, pickled chillies, rocket.",
    category: "Signature Sandwiches",
    featured: true,
    image: "/images/bodega/menu/laughing-cow.jpg",
    tag: "Featured Stack",
    meta: "Served in brown bread",
    accent: "#f0b323",
    visible: true,
    sortOrder: 1,
  },
  {
    id: "studio-54",
    name: "Studio 54",
    description:
      "Roast chicken & bacon in dill mayo, cheddar, hash brown, beef tomato, cucumber, garlic breadcrumbs, charred tomato relish.",
    category: "Signature Sandwiches",
    featured: true,
    image: "/images/bodega/menu/studio-54.jpg",
    tag: "Featured Stack",
    meta: "Served in white bread",
    accent: "#ef4335",
    visible: true,
    sortOrder: 2,
  },
  {
    id: "unbrieleivable-jeff",
    name: "Unbrieleivable, Jeff",
    description:
      "Roast chicken in caramelised onion mayo, chorizo, brie, crispy onions, chilli & olive jam, rocket.",
    category: "Signature Sandwiches",
    featured: true,
    image: "/images/bodega/menu/unbrieleivable-jeff.jpg",
    tag: "Featured Stack",
    meta: "Served in white or brown bread",
    accent: "#f0b323",
    visible: true,
    sortOrder: 3,
  },
  {
    id: "coq-joke",
    name: "Coq Joke",
    description:
      "Fried chicken breast, smoked cheese, hash browns, hot maple syrup, lettuce and Big Deal sauce.",
    category: "Signature Sandwiches",
    featured: true,
    image: "/images/bodega/menu/coq-joke.jpg",
    tag: "Featured Stack",
    meta: "Served in thick white bread",
    accent: "#ef4335",
    visible: true,
    sortOrder: 4,
  },
]

const sections: MenuSection[] = [
  {
    id: "signature-sandwiches",
    title: "Signature Sandwiches",
    description: "Big hitters from the Bodega line-up.",
    items: signatureSandwiches,
  },
]

export const menu = createMenuContent({
  title: "Signature Sandwiches",
  description: "Big hitters from the Bodega line-up.",
  displayMode: "featured-grid",
  sections,
})