type Theme = {
  primary: string
  accent: string
  background: string
  surface: string
  text: string
}

type TemplateFooterProps = {
  name: string
  address: string
  phone: string
  email: string
  instagramUrl?: string
  facebookUrl?: string
  theme: Theme
}

export default function TemplateFooter({
  name,
  address,
  phone,
  email,
  instagramUrl,
  facebookUrl,
  theme,
}: TemplateFooterProps) {
  const year = new Date().getFullYear()

  return (
    <footer
      className="border-t"
      style={{
        backgroundColor: theme.background,
        borderColor: "rgba(0,0,0,0.10)",
        color: theme.text,
      }}
    >
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <h3 className="text-2xl font-black uppercase tracking-tight">
              {name}
            </h3>

            <p className="mt-4 max-w-sm text-sm leading-6 opacity-70">
              Great food, good drinks, and a place worth coming back to.
            </p>
          </div>

          <div>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] opacity-50">
              Contact
            </p>

            <div className="space-y-2 text-sm opacity-80">
              <p>{address}</p>

              <a
                href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                className="block transition hover:opacity-60"
              >
                {phone}
              </a>

              <a
                href={`mailto:${email}`}
                className="block transition hover:opacity-60"
              >
                {email}
              </a>
            </div>
          </div>

          <div>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] opacity-50">
              Follow
            </p>

            <div className="flex gap-4 text-sm">
              {instagramUrl && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:opacity-60"
                >
                  Instagram
                </a>
              )}

              {facebookUrl && (
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:opacity-60"
                >
                  Facebook
                </a>
              )}
            </div>
          </div>
        </div>

        <div
          className="mt-12 border-t pt-6 text-xs opacity-50"
          style={{ borderColor: "rgba(0,0,0,0.10)" }}
        >
          © {year} {name}. All rights reserved.
        </div>
      </div>
    </footer>
  )
}