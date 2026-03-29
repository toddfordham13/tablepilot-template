"use client"

const BORDER = "rgba(255,255,255,0.10)"
const MUTED = "rgba(255,255,255,0.64)"
const SOFT = "rgba(255,255,255,0.45)"
const GOLD = "#C9A24A"
const GREEN = "#78A84F"
const BLUE = "#7DA2D6"

function trimDecimals(value: number, decimals: number) {
  return value
    .toFixed(decimals)
    .replace(/\.00$/, "")
    .replace(/(\.\d)0$/, "$1")
}

function formatSmallNumber(value: number) {
  const abs = Math.abs(value)

  if (abs >= 1000) return `${Math.round(value)}`
  if (abs >= 100) return `${Math.round(value)}`
  if (abs >= 10) return trimDecimals(value, 1)
  if (abs >= 1) return trimDecimals(value, 2)
  if (abs === 0) return "0"
  return trimDecimals(value, 2)
}

function formatCount(value: number) {
  return formatSmallNumber(value)
}

function LegendMiniChip({
  label,
  colour,
}: {
  label: string
  colour: string
}) {
  return (
    <div
      className="flex items-center justify-center gap-2 rounded-2xl px-3 py-2.5"
      style={{
        backgroundColor: "rgba(255,255,255,0.04)",
        border: `1px solid ${BORDER}`,
      }}
    >
      <span
        className="h-2.5 w-2.5 rounded-full"
        style={{ backgroundColor: colour }}
      />
      <span
        className="text-xs font-medium"
        style={{ color: "rgba(255,255,255,0.82)" }}
      >
        {label}
      </span>
    </div>
  )
}

export default function HeroEngagementDonut({
  menu,
  bookings,
  contact,
  gallery,
}: {
  menu: number
  bookings: number
  contact: number
  gallery: number
}) {
  const safeMenu = Math.max(menu, 0)
  const safeBookings = Math.max(bookings, 0)
  const safeContact = Math.max(contact, 0)
  const safeGallery = Math.max(gallery, 0)

  const total = safeMenu + safeBookings + safeContact + safeGallery
  const displayTotal = Math.max(total, 0)
  const resolvedTotal = Math.max(total, 1)

  const menuAngle = (safeMenu / resolvedTotal) * 360
  const bookingsAngle = (safeBookings / resolvedTotal) * 360
  const contactAngle = (safeContact / resolvedTotal) * 360
  const galleryAngle = (safeGallery / resolvedTotal) * 360

  const gradient = `conic-gradient(
    ${GOLD} 0deg ${menuAngle}deg,
    ${GREEN} ${menuAngle}deg ${menuAngle + bookingsAngle}deg,
    ${BLUE} ${menuAngle + bookingsAngle}deg ${menuAngle + bookingsAngle + contactAngle}deg,
    rgba(255,255,255,0.30) ${menuAngle + bookingsAngle + contactAngle}deg ${menuAngle + bookingsAngle + contactAngle + galleryAngle}deg
  )`

  return (
    <div className="w-full max-w-[260px]">
      <div
        className="rounded-[28px] p-5"
        style={{
          backgroundColor: "rgba(255,255,255,0.03)",
          border: `1px solid ${BORDER}`,
          boxShadow: "0 20px 48px rgba(0,0,0,0.24)",
        }}
      >
        <div className="flex items-center justify-between gap-3">
          <div
            className="text-xs uppercase tracking-[0.24em]"
            style={{ color: SOFT }}
          >
            Engagement Mix
          </div>
          <div className="text-xs" style={{ color: SOFT }}>
            Top right read
          </div>
        </div>

        <div className="mt-5 flex justify-center">
          <div
            className="relative h-[190px] w-[190px] rounded-full"
            style={{
              background: gradient,
              boxShadow: "0 18px 40px rgba(0,0,0,0.28)",
            }}
          >
            <div
              className="absolute inset-[22px] rounded-full"
              style={{
                background:
                  "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.05), rgba(11,23,40,0.98) 72%)",
                border: `1px solid ${BORDER}`,
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="px-4 text-center">
                <div className="text-[40px] leading-none font-semibold text-white">
                  {formatCount(displayTotal)}
                </div>
                <div
                  className="mt-2 text-[10px] uppercase tracking-[0.22em]"
                  style={{ color: SOFT }}
                >
                  Total actions
                </div>
                <div className="mt-2 text-sm" style={{ color: MUTED }}>
                  engagement mix
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2.5">
          <LegendMiniChip label={`Menu ${formatCount(safeMenu)}`} colour={GOLD} />
          <LegendMiniChip
            label={`Bookings ${formatCount(safeBookings)}`}
            colour={GREEN}
          />
          <LegendMiniChip
            label={`Contact ${formatCount(safeContact)}`}
            colour={BLUE}
          />
          <LegendMiniChip
            label={`Gallery ${formatCount(safeGallery)}`}
            colour="rgba(255,255,255,0.68)"
          />
        </div>
      </div>
    </div>
  )
}