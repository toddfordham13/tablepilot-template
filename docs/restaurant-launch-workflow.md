# Restaurant Template System — Launch Workflow

This system allows new restaurant websites to be launched quickly by duplicating a starter content folder and updating restaurant-specific content.

Typical launch time: **1–2 hours** once content and images are ready.

---

# System Overview

The project is split into two main parts.

## 1. Template Design System

These files control layout, styling, structure, and responsiveness.

Located in:

src/components/sections/

Main template components:

- TemplateHero.tsx
- TemplateMenuPreview.tsx
- TemplateGalleryPreview.tsx
- TemplateFindUs.tsx
- TemplateContact.tsx

These files should only be edited when improving the global template design.

Changes here affect **every restaurant site**.

---

## 2. Restaurant Content

Each restaurant has its own content folder.

Location:

src/content/restaurants/

Example:

- bodega
- fuego
- _starter

Each restaurant folder contains:

- config.ts
- hero.ts
- menu.ts
- gallery.ts
- index.ts

These files contain restaurant-specific content only.

---

# Standard Restaurant Folder Structure

Every restaurant must follow this structure exactly.

src/content/restaurants/{slug}/

config.ts  
hero.ts  
menu.ts  
gallery.ts  
index.ts  

---

# Image Structure

Images must follow this exact structure.

public/images/restaurants/{slug}/

hero.jpg  
gallery-1.jpg  
gallery-2.jpg  
gallery-3.jpg  
landing.jpg  

Do not rename these files.

The template expects these exact names.

---

# New Restaurant Launch Process

## Step 1 — Duplicate the starter

Copy the folder:

src/content/restaurants/_starter

Rename it to the restaurant slug.

Example:

src/content/restaurants/casa-verde

---

## Step 2 — Add images

Create this folder:

public/images/restaurants/{slug}/

Add the required files:

hero.jpg  
gallery-1.jpg  
gallery-2.jpg  
gallery-3.jpg  
landing.jpg  

---

## Step 3 — Update config.ts

Fill in:

- slug
- name
- tagline
- addressLine
- phone
- email
- openingHours
- bookingUrl
- instagramUrl
- facebookUrl
- mapUrl
- landingImage
- theme colours
- SEO title
- SEO description
- schema cuisine
- schema price range

This file controls business details and theme styling.

---

## Step 4 — Update hero.ts

Update:

- hero tagline
- hero description
- hero image
- CTA buttons

---

## Step 5 — Update menu.ts

Add a preview of the menu:

- section title
- section description
- featured dishes
- categories
- pricing

This is a **preview section**, not the full menu system.

---

## Step 6 — Update gallery.ts

Update:

- gallery title
- gallery description
- gallery images

---

## Step 7 — Register the restaurant

Open:

src/lib/restaurants/registry.ts

Add an import:

import { casaVerdeRestaurant } from "../../content/restaurants/casa-verde"

Then add to the registry:

"casa-verde": casaVerdeRestaurant

---

## Step 8 — Run local checks

Confirm:

- homepage shows the restaurant card
- concept page loads
- images load
- theme colours apply
- contact details correct
- map link works
- social links work

---

## Step 9 — Deploy

Deploy to Vercel and confirm:

- build succeeds
- concept page works
- images load
- metadata present
- schema rendered
- mobile layout correct

---

# Definition of Done

A restaurant launch is complete when:

- restaurant folder exists
- images folder exists
- restaurant registered
- homepage card visible
- concept page live
- images load correctly
- theme applied
- contact details correct
- metadata populated
- schema rendered

---

# Slug Rules

Slug must be:

lowercase  
hyphen-separated  
URL-safe  

Good:

ember-kitchen  
north-bar  
casa-verde  

Bad:

EmberKitchen  
north_bar  
Casa Verde