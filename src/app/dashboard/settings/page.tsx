"use client"

import { useEffect, useState } from "react"

type SettingsContent = {
  slug: string
  name: string
  tagline: string
  addressLine: string
  phone: string
  email: string
  bookingUrl: string
  instagramUrl: string
  facebookUrl: string
  mapUrl: string
  openingHours: string
  seoTitle: string
  seoDescription: string
}

type SettingsField = Exclude<keyof SettingsContent, "slug">

export default function DashboardSettingsPage() {
  const [concept, setConcept] = useState("bodega")
  const [settings, setSettings] = useState<SettingsContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  async function loadSettings(selectedConcept: string) {
    setLoading(true)
    setMessage("")

    try {
      const response = await fetch(
        `/api/dashboard/settings?concept=${selectedConcept}`,
        {
          cache: "no-store",
        },
      )

      if (!response.ok) {
        throw new Error("Failed to load settings")
      }

      const data = (await response.json()) as {
        settings?: SettingsContent
      }

      setSettings(data.settings ?? null)
    } catch {
      setSettings(null)
      setMessage("Failed to load settings.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadSettings(concept)
  }, [concept])

  function updateField(field: SettingsField, value: string) {
    if (!settings) {
      return
    }

    setSettings({
      ...settings,
      [field]: value,
    })
  }

  async function saveSettings() {
    if (!settings) {
      return
    }

    setSaving(true)
    setMessage("")

    try {
      const response = await fetch("/api/dashboard/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          concept,
          settings,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save settings")
      }

      const data = (await response.json()) as {
        settings?: SettingsContent
      }

      setSettings(data.settings ?? settings)
      setMessage("Settings saved.")
    } catch {
      setMessage("Failed to save settings.")
    } finally {
      setSaving(false)
    }
  }

  async function resetSettings() {
    setMessage("")

    try {
      const response = await fetch(
        `/api/dashboard/settings?concept=${concept}`,
        {
          method: "DELETE",
        },
      )

      if (!response.ok) {
        throw new Error("Failed to reset settings")
      }

      const data = (await response.json()) as {
        settings?: SettingsContent
      }

      setSettings(data.settings ?? null)
      setMessage("Settings reset to default.")
    } catch {
      setMessage("Failed to reset settings.")
    }
  }

  if (loading) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-2xl font-semibold text-white">Settings</h1>
        <p className="mt-2 text-sm text-white/70">Loading settings…</p>
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-2xl font-semibold text-white">Settings</h1>
        <p className="mt-2 text-sm text-red-300">
          {message || "Settings could not be loaded."}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white">Settings</h1>
            <p className="mt-2 text-sm text-white/70">
              Safe operational settings for each restaurant concept.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <select
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              className="rounded-xl border border-white/10 bg-[#111827] px-4 py-2.5 text-sm text-white outline-none"
            >
              <option value="bodega" className="bg-[#111827] text-white">
                Bodega
              </option>
              <option value="fuego" className="bg-[#111827] text-white">
                Fuego
              </option>
            </select>

            <button
              type="button"
              onClick={saveSettings}
              disabled={saving}
              className="rounded-xl bg-[#C9A24A] px-4 py-2.5 text-sm font-medium text-[#0F1F3D] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save settings"}
            </button>

            <button
              type="button"
              onClick={resetSettings}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Reset to default
            </button>
          </div>
        </div>

        {message ? (
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/75">
            {message}
          </div>
        ) : null}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-medium text-white">
            Brand & contact
          </h2>

          <div className="mt-5 space-y-4">
            <Field
              label="Restaurant name"
              value={settings.name}
              onChange={(value) => updateField("name", value)}
            />
            <Field
              label="Tagline"
              value={settings.tagline}
              onChange={(value) => updateField("tagline", value)}
            />
            <Field
              label="Phone"
              value={settings.phone}
              onChange={(value) => updateField("phone", value)}
            />
            <Field
              label="Email"
              value={settings.email}
              onChange={(value) => updateField("email", value)}
            />
            <Field
              label="Address"
              value={settings.addressLine}
              onChange={(value) => updateField("addressLine", value)}
            />
            <Field
              label="Opening hours"
              value={settings.openingHours}
              onChange={(value) => updateField("openingHours", value)}
            />
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-medium text-white">
            Links & discoverability
          </h2>

          <div className="mt-5 space-y-4">
            <Field
              label="Booking URL"
              value={settings.bookingUrl}
              onChange={(value) => updateField("bookingUrl", value)}
            />
            <Field
              label="Instagram URL"
              value={settings.instagramUrl}
              onChange={(value) => updateField("instagramUrl", value)}
            />
            <Field
              label="Facebook URL"
              value={settings.facebookUrl}
              onChange={(value) => updateField("facebookUrl", value)}
            />
            <Field
              label="Google Maps URL"
              value={settings.mapUrl}
              onChange={(value) => updateField("mapUrl", value)}
            />
            <Field
              label="SEO title"
              value={settings.seoTitle}
              onChange={(value) => updateField("seoTitle", value)}
            />
            <TextAreaField
              label="SEO description"
              value={settings.seoDescription}
              onChange={(value) => updateField("seoDescription", value)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-white/75">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-[#111827] px-4 py-3 text-sm text-white outline-none placeholder:text-white/30"
      />
    </div>
  )
}

function TextAreaField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-white/75">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[120px] w-full rounded-xl border border-white/10 bg-[#111827] px-4 py-3 text-sm text-white outline-none placeholder:text-white/30"
      />
    </div>
  )
}