import Link from "next/link"

import type { TrendComparison } from "@/lib/analytics/getTrendComparison"
import type { RestaurantInsight } from "@/lib/analytics/getRestaurantInsights"

type RangeKey = "today" | "7d" | "30d"

const RANGE_OPTIONS: Array<{ key: RangeKey; label: string }> = [
  { key: "today", label: "Today" },
  { key: "7d", label: "Last 7 days" },
  { key: "30d", label: "Last 30 days" },
]

type KpiDashboardProps = {
  concept: string
  range: RangeKey
  health: {
    score: number
    status: string
    summary: string
  }
  summary: {
    totalEvents: number
    visits: number
    menuViews: number
    bookingClicks: number
    phoneClicks: number
    directionsClicks: number
    galleryViews: number
    contactSectionViews: number
    scrollDepthEvents: number
    menuCategoryClicks: number
    ctaViews: number
    contactActions: number
    avgScrollDepth: number
    maxScrollDepth: number
    guestJourney: {
      visits: number
      menuViews: number
      bookingClicks: number
    }
  }
  kpis: {
    visits: number
    menuViews: number
    bookingClicks: number
    phoneClicks: number
    directionsClicks: number
    galleryViews: number
    contactSectionViews: number
    menuCategoryClicks: number
    ctaViews: number
    contactActions: number
    menuInterestRate: number
    menuToBookingRate: number
    bookingIntentRate: number
    contactActionRate: number
    galleryEngagementRate: number
    contactSectionReachRate: number
    avgScrollDepth: number
    maxScrollDepth: number
  }
  insights: RestaurantInsight[]
  trends: TrendComparison
}

const SHELL_BG = "#08111F"
const NAV_BG = "#0B1728"
const PANEL_BG = "#122033"
const PANEL_BG_SOFT = "#16263B"
const PANEL_BG_SOFTER = "#1A2B42"
const BORDER = "rgba(255,255,255,0.10)"
const MUTED = "rgba(255,255,255,0.60)"
const SOFT = "rgba(255,255,255,0.45)"
const GOLD = "#C9A24A"
const GREEN = "#78A84F"
const RED = "#D16C6C"
const BLUE = "#7DA2D6"

export default function KpiDashboard({
  concept,
  range,
  health,
  summary,
  kpis,
  insights,
  trends,
}: KpiDashboardProps) {
  const topInsights = insights.slice(0, 3)
  const actionInsights = insights.slice(0, 4)

  const menuLeaders = [
    {
      name: "Menu engagement",
      value: `${kpis.menuInterestRate.toFixed(1)}%`,
      helper: "Visit → menu interest",
    },
    {
      name: "Menu → booking",
      value: `${kpis.menuToBookingRate.toFixed(1)}%`,
      helper: "Menu viewers who clicked booking",
    },
    {
      name: "Menu item clicks",
      value: String(summary.menuCategoryClicks),
      helper: "Preview card interactions",
    },
  ]

  const marketingRows = [
    {
      label: "Phone click rate",
      value: `${safePercent(summary.phoneClicks, summary.visits).toFixed(1)}%`,
      helper: `${summary.phoneClicks} total phone actions`,
    },
    {
      label: "Directions click rate",
      value: `${safePercent(summary.directionsClicks, summary.visits).toFixed(1)}%`,
      helper: `${summary.directionsClicks} total directions actions`,
    },
    {
      label: "Booking click rate",
      value: `${safePercent(summary.bookingClicks, summary.visits).toFixed(1)}%`,
      helper: `${summary.bookingClicks} total booking actions`,
    },
  ]

  const engagementRows = [
    {
      label: "Gallery engagement",
      value: `${kpis.galleryEngagementRate.toFixed(1)}%`,
      helper: `${summary.galleryViews} gallery views`,
    },
    {
      label: "Contact section reach",
      value: `${kpis.contactSectionReachRate.toFixed(1)}%`,
      helper: `${summary.contactSectionViews} section views`,
    },
    {
      label: "Avg. scroll depth",
      value: `${kpis.avgScrollDepth.toFixed(0)}%`,
      helper: `Max depth ${kpis.maxScrollDepth.toFixed(0)}%`,
    },
  ]

  const confidence = getDataConfidence(summary.visits)
  const scoreTone = getScoreTone(health.score)

  return (
    <main
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(circle at top left, rgba(20,40,67,0.45), transparent 30%), linear-gradient(180deg, #08111F 0%, #07101C 100%)",
        color: "#FFFFFF",
      }}
    >
      <div className="flex min-h-screen">
        <aside
          className="hidden w-[240px] shrink-0 lg:flex lg:flex-col"
          style={{
            backgroundColor: NAV_BG,
            borderRight: `1px solid ${BORDER}`,
          }}
        >
          <div
            className="px-5 py-6"
            style={{ borderBottom: `1px solid ${BORDER}` }}
          >
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold"
                style={{ backgroundColor: GOLD, color: "#0F1F3D" }}
              >
                T
              </div>

              <div>
                <div className="text-[28px] leading-none font-semibold text-white">
                  TablePilot
                </div>
                <div className="mt-1 text-xs" style={{ color: SOFT }}>
                  Restaurant Control Panel
                </div>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-3 py-6">
            <div className="space-y-2">
              <SidebarItem label="Dashboard" active />
              <SidebarItem label="Menu" />
              <SidebarItem label="Gallery" />
              <SidebarItem label="Insights" />
              <SidebarItem label="Settings" />
            </div>
          </nav>

          <div
            className="px-5 py-5"
            style={{ borderTop: `1px solid ${BORDER}` }}
          >
            <div
              className="text-[11px] uppercase tracking-[0.18em]"
              style={{ color: SOFT }}
            >
              Active concept
            </div>
            <div className="mt-2 text-base font-medium capitalize text-white">
              {concept}
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header
            className="sticky top-0 z-20 backdrop-blur"
            style={{
              backgroundColor: "rgba(11,23,40,0.92)",
              borderBottom: `1px solid ${BORDER}`,
            }}
          >
            <div className="flex flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between md:px-8">
              <div className="flex flex-wrap items-center gap-3">
                <div
                  className="inline-flex items-center gap-2 rounded-2xl px-4 py-3"
                  style={{
                    backgroundColor: "#0F1F3D",
                    border: `1px solid rgba(201,162,74,0.35)`,
                  }}
                >
                  <span className="text-sm" style={{ color: GOLD }}>
                    ↗
                  </span>
                  <span className="text-sm font-medium capitalize text-white">
                    {concept}
                  </span>
                </div>

                <div
                  className="hidden rounded-2xl px-4 py-3 text-sm md:block"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.04)",
                    border: `1px solid ${BORDER}`,
                    color: SOFT,
                  }}
                >
                  Premium KPI dashboard
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {RANGE_OPTIONS.map((option) => {
                  const isActive = option.key === range

                  return (
                    <Link
                      key={option.key}
                      href={`/${concept}/kpi?range=${option.key}`}
                      className="rounded-2xl px-4 py-2.5 text-sm font-medium transition"
                      style={
                        isActive
                          ? {
                            backgroundColor: GOLD,
                            color: "#0F1F3D",
                            border: `1px solid ${GOLD}`,
                            fontWeight: 700,
                          }
                          : {
                            backgroundColor: "rgba(255,255,255,0.04)",
                            color: "rgba(255,255,255,0.78)",
                            border: `1px solid ${BORDER}`,
                          }
                      }
                    >
                      {option.label}
                    </Link>
                  )
                })}
              </div>
            </div>
          </header>

          <div className="flex-1 px-5 py-6 md:px-8 md:py-8">
            <div className="grid gap-6 xl:grid-cols-12">
              <div className="xl:col-span-12">
                <section className="grid gap-6 xl:grid-cols-12">
                  <div className="xl:col-span-8">
                    <section
                      className="rounded-[32px] p-7 md:p-8"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(18,32,51,1) 0%, rgba(17,30,48,1) 100%)",
                        border: `1px solid ${BORDER}`,
                        boxShadow: "0 28px 70px rgba(0,0,0,0.30)",
                      }}
                    >
                      <div className="grid gap-8 lg:grid-cols-[1.25fr_0.8fr] lg:items-center">
                        <div>
                          <div className="flex flex-wrap items-center gap-3">
                            <SectionEyebrow>Restaurant Health Score</SectionEyebrow>
                            <ConfidenceBadge label={confidence.label} tone={confidence.tone} />
                          </div>

                          <div className="mt-6 space-y-4">
                            <HealthBullet
                              tone={toBulletTone(topInsights[0]?.tone)}
                              text={topInsights[0]?.title ?? health.status}
                            />
                            <HealthBullet
                              tone={toBulletTone(topInsights[1]?.tone)}
                              text={topInsights[1]?.title ?? health.summary}
                            />
                            <HealthBullet
                              tone={toBulletTone(topInsights[2]?.tone)}
                              text={topInsights[2]?.title ?? "Analytics pipeline active"}
                            />
                          </div>

                          <div
                            className="mt-6 max-w-2xl text-[15px] leading-8"
                            style={{ color: MUTED }}
                          >
                            {health.summary}
                          </div>
                        </div>

                        <div className="flex justify-center lg:justify-end">
                          <ScoreGauge score={health.score} tone={scoreTone} />
                        </div>
                      </div>
                    </section>
                  </div>

                  <div className="xl:col-span-4">
                    <Panel className="h-full">
                      <SectionEyebrow>Health Snapshot</SectionEyebrow>

                      <div className="mt-5 space-y-4">
                        <StatLine label="Current score" value={`${health.score}/100`} />
                        <StatLine label="Status" value={health.status} />
                        <StatLine label="Visits in range" value={String(summary.visits)} />
                        <StatLine label="Contact actions" value={String(kpis.contactActions)} />
                        <StatLine label="Total events" value={String(summary.totalEvents)} />
                      </div>
                    </Panel>
                  </div>
                </section>
              </div>

              <div className="xl:col-span-12">
                <Panel>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <SectionEyebrow>Recommended Actions</SectionEyebrow>
                      <div className="mt-3 text-sm" style={{ color: MUTED }}>
                        Priority actions generated from current guest behaviour and conversion performance.
                      </div>
                    </div>

                    <div className="text-xl" style={{ color: SOFT }}>
                      •••
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 lg:grid-cols-2">
                    {(actionInsights.length ? actionInsights : insights.slice(0, 2)).map(
                      (insight, index) => (
                        <ActionCard
                          key={`${insight.title}-${index}`}
                          index={index + 1}
                          title={insight.title}
                          body={insight.body}
                          tone={insight.tone}
                        />
                      )
                    )}

                    {!insights.length && (
                      <>
                        <ActionCard
                          index={1}
                          title="No actions generated yet"
                          body="Add more tracked interaction data to surface specific recommendations."
                          tone="neutral"
                        />
                        <ActionCard
                          index={2}
                          title="Next best move"
                          body="Drive more visits and track more guest behaviour before making strong conversion decisions."
                          tone="warning"
                        />
                      </>
                    )}
                  </div>
                </Panel>
              </div>

              <div className="xl:col-span-12">
                <section className="grid gap-6 xl:grid-cols-12">
                  <div className="xl:col-span-4">
                    <Panel className="h-full">
                      <div className="flex items-center justify-between">
                        <SectionEyebrow>Guest Journey Funnel</SectionEyebrow>
                        <MutedLabel>Visits → Menu → Booking</MutedLabel>
                      </div>

                      <div className="mt-6 space-y-4">
                        <FunnelStep
                          label="Visits"
                          value={summary.guestJourney.visits}
                          helper="Top of funnel"
                        />
                        <FunnelArrow />
                        <FunnelStep
                          label="Menu views"
                          value={summary.guestJourney.menuViews}
                          helper={`${kpis.menuInterestRate.toFixed(1)}% of visits`}
                        />
                        <FunnelArrow />
                        <FunnelStep
                          label="Booking clicks"
                          value={summary.guestJourney.bookingClicks}
                          helper={`${kpis.bookingIntentRate.toFixed(1)}% of visits`}
                        />
                      </div>
                    </Panel>
                  </div>

                  <div className="xl:col-span-4">
                    <Panel className="h-full">
                      <div className="flex items-center justify-between">
                        <SectionEyebrow>Core Metrics</SectionEyebrow>
                        <MutedLabel>Customer activity</MutedLabel>
                      </div>

                      <div className="mt-6 grid grid-cols-3 gap-4">
                        <MiniMetric
                          label="Visits"
                          value={summary.visits}
                          trend={trends.visits}
                        />
                        <MiniMetric label="Menu views" value={summary.menuViews} />
                        <MiniMetric label="Bookings" value={summary.bookingClicks} />
                      </div>

                      <div
                        className="mt-6 border-t pt-5"
                        style={{ borderColor: BORDER }}
                      >
                        <TrendRow label="Phone clicks" value={summary.phoneClicks} />
                        <TrendRow
                          label="Directions clicks"
                          value={summary.directionsClicks}
                        />
                        <TrendRow
                          label="Contact actions"
                          value={kpis.contactActions}
                        />
                      </div>
                    </Panel>
                  </div>

                  <div className="xl:col-span-4">
                    <Panel className="h-full">
                      <div className="flex items-center justify-between">
                        <SectionEyebrow>Engagement Signals</SectionEyebrow>
                        <MutedLabel>Depth + discovery</MutedLabel>
                      </div>

                      <div className="mt-6 space-y-4">
                        {engagementRows.map((item) => (
                          <MetricRow
                            key={item.label}
                            label={item.label}
                            value={item.value}
                            helper={item.helper}
                          />
                        ))}
                      </div>
                    </Panel>
                  </div>
                </section>
              </div>

              <div className="xl:col-span-4">
                <Panel>
                  <div className="flex items-center justify-between">
                    <SectionEyebrow>Conversion Metrics</SectionEyebrow>
                    <MutedLabel>Intent efficiency</MutedLabel>
                  </div>

                  <div className="mt-6 space-y-4">
                    <MetricRow
                      label="Visit → Menu"
                      value={`${kpis.menuInterestRate.toFixed(1)}%`}
                      trend={trends.menuInterestRate}
                    />
                    <MetricRow
                      label="Menu → Booking"
                      value={`${kpis.menuToBookingRate.toFixed(1)}%`}
                      trend={trends.menuToBookingRate}
                    />
                    <MetricRow
                      label="Visit → Booking"
                      value={`${kpis.bookingIntentRate.toFixed(1)}%`}
                      trend={trends.bookingIntentRate}
                    />
                    <MetricRow
                      label="Visit → Contact"
                      value={`${kpis.contactActionRate.toFixed(1)}%`}
                      trend={trends.contactActionRate}
                    />
                  </div>
                </Panel>
              </div>

              <div className="xl:col-span-4">
                <Panel>
                  <div className="flex items-center justify-between">
                    <SectionEyebrow>Discovery Metrics</SectionEyebrow>
                    <MutedLabel>Visibility signals</MutedLabel>
                  </div>

                  <div className="mt-6 space-y-4">
                    <MetricRow
                      label="Visits"
                      value={String(summary.visits)}
                      helper="Top of funnel traffic"
                    />
                    <MetricRow
                      label="Menu views"
                      value={String(summary.menuViews)}
                      helper="Mid-funnel engagement"
                    />
                    <MetricRow
                      label="Contact reach"
                      value={`${kpis.contactSectionReachRate.toFixed(1)}%`}
                      helper={`${summary.contactSectionViews} contact section views`}
                    />
                  </div>
                </Panel>
              </div>

              <div className="xl:col-span-4">
                <Panel>
                  <div className="flex items-center justify-between">
                    <SectionEyebrow>Guest Actions</SectionEyebrow>
                    <MutedLabel>What guests actually do</MutedLabel>
                  </div>

                  <div className="mt-6 space-y-4">
                    <MetricRow
                      label="Phone clicks"
                      value={String(summary.phoneClicks)}
                      helper={`${safePercent(summary.phoneClicks, summary.visits).toFixed(1)}% of visits`}
                    />
                    <MetricRow
                      label="Directions clicks"
                      value={String(summary.directionsClicks)}
                      helper={`${safePercent(summary.directionsClicks, summary.visits).toFixed(1)}% of visits`}
                    />
                    <MetricRow
                      label="Booking clicks"
                      value={String(summary.bookingClicks)}
                      helper={`${safePercent(summary.bookingClicks, summary.visits).toFixed(1)}% of visits`}
                    />
                  </div>
                </Panel>
              </div>

              <div className="xl:col-span-4">
                <Panel>
                  <div className="flex items-center justify-between">
                    <SectionEyebrow>Menu Intelligence</SectionEyebrow>
                    <MutedLabel>What to push</MutedLabel>
                  </div>

                  <div className="mt-6 space-y-4">
                    {menuLeaders.map((item, index) => (
                      <ListMetric
                        key={item.name}
                        index={index + 1}
                        title={item.name}
                        value={item.value}
                        helper={item.helper}
                      />
                    ))}
                  </div>
                </Panel>
              </div>

              <div className="xl:col-span-4">
                <Panel>
                  <div className="flex items-center justify-between">
                    <SectionEyebrow>Marketing Performance</SectionEyebrow>
                    <MutedLabel>Traffic actions</MutedLabel>
                  </div>

                  <div className="mt-6 space-y-4">
                    {marketingRows.map((item) => (
                      <MetricRow
                        key={item.label}
                        label={item.label}
                        value={item.value}
                        helper={item.helper}
                      />
                    ))}
                  </div>
                </Panel>
              </div>

              <div className="xl:col-span-4">
                <Panel>
                  <div className="flex items-center justify-between">
                    <SectionEyebrow>Trend Overview</SectionEyebrow>
                    <MutedLabel>Vs previous period</MutedLabel>
                  </div>

                  <div className="mt-6">
                    <div className="text-5xl font-semibold text-white">
                      {formatSignedPercent(trends.visits.deltaPercent)}%
                    </div>
                    <div className="mt-3 text-base" style={{ color: MUTED }}>
                      Movement in visits against the previous comparison window.
                    </div>

                    <div className="mt-8 space-y-4">
                      <TrendBullet trend={trends.visits} label="Visits trend" />
                      <TrendBullet
                        trend={trends.menuInterestRate}
                        label="Menu engagement trend"
                      />
                      <TrendBullet
                        trend={trends.bookingIntentRate}
                        label="Booking intent trend"
                      />
                    </div>
                  </div>
                </Panel>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

function SidebarItem({
  label,
  active = false,
}: {
  label: string
  active?: boolean
}) {
  return (
    <div
      className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm"
      style={
        active
          ? {
            backgroundColor: "rgba(201,162,74,0.10)",
            border: `1px solid rgba(201,162,74,0.30)`,
            color: "#FFFFFF",
            fontWeight: 600,
          }
          : {
            color: "rgba(255,255,255,0.68)",
          }
      }
    >
      <span style={{ color: "rgba(255,255,255,0.72)" }}>
        {active ? "■" : "•"}
      </span>
      <span>{label}</span>
    </div>
  )
}

function Panel({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <section
      className={`rounded-[28px] p-6 md:p-7 ${className}`}
      style={{
        backgroundColor: PANEL_BG,
        border: `1px solid ${BORDER}`,
        boxShadow: "0 20px 60px rgba(0,0,0,0.28)",
      }}
    >
      {children}
    </section>
  )
}

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="text-xs uppercase tracking-[0.24em]"
      style={{ color: SOFT }}
    >
      {children}
    </div>
  )
}

function MutedLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-xs" style={{ color: SOFT }}>
      {children}
    </div>
  )
}

function ConfidenceBadge({
  label,
  tone,
}: {
  label: string
  tone: "low" | "medium" | "high"
}) {
  const styles =
    tone === "high"
      ? {
        backgroundColor: "rgba(120,168,79,0.16)",
        color: "#A5D26F",
        border: "1px solid rgba(120,168,79,0.28)",
      }
      : tone === "medium"
        ? {
          backgroundColor: "rgba(201,162,74,0.14)",
          color: "#E0C16C",
          border: "1px solid rgba(201,162,74,0.28)",
        }
        : {
          backgroundColor: "rgba(125,162,214,0.14)",
          color: "#9FBDE3",
          border: "1px solid rgba(125,162,214,0.24)",
        }

  return (
    <div className="rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em]" style={styles}>
      {label}
    </div>
  )
}

function HealthBullet({
  text,
  tone,
}: {
  text: string
  tone: "good" | "warning" | "neutral"
}) {
  const colour =
    tone === "good"
      ? GREEN
      : tone === "warning"
        ? GOLD
        : BLUE

  return (
    <div className="flex items-center gap-4">
      <span
        className="h-3.5 w-3.5 rounded-full"
        style={{ backgroundColor: colour }}
      />
      <div className="text-[18px] font-medium" style={{ color: "rgba(255,255,255,0.92)" }}>
        {text}
      </div>
    </div>
  )
}

function ScoreGauge({
  score,
  tone,
}: {
  score: number
  tone: "weak" | "fair" | "strong"
}) {
  const clamped = Math.max(0, Math.min(100, score))
  const angle = Math.round((clamped / 100) * 360)

  const primaryColour =
    tone === "strong" ? GREEN : tone === "fair" ? GOLD : RED

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className="relative flex h-[250px] w-[250px] items-center justify-center rounded-full"
        style={{
          background: `conic-gradient(${primaryColour} 0deg ${Math.max(
            angle - 55,
            0
          )}deg, ${GOLD} ${Math.max(angle - 55, 0)}deg ${angle}deg, rgba(255,255,255,0.09) ${angle}deg 360deg)`,
          boxShadow: "0 16px 40px rgba(0,0,0,0.24)",
        }}
      >
        <div
          className="absolute h-[182px] w-[182px] rounded-full"
          style={{ backgroundColor: NAV_BG }}
        />
        <div className="relative z-10 text-center">
          <div className="text-7xl font-semibold text-white">{clamped}</div>
          <div
            className="mt-1 text-sm uppercase tracking-[0.22em]"
            style={{ color: SOFT }}
          >
            Out of 100
          </div>
        </div>
      </div>
    </div>
  )
}

function ActionCard({
  index,
  title,
  body,
  tone,
}: {
  index: number
  title: string
  body: string
  tone: "good" | "warning" | "neutral"
}) {
  const badgeStyles =
    tone === "good"
      ? { backgroundColor: "rgba(120,168,79,0.18)", color: "#9AD06A" }
      : tone === "warning"
        ? { backgroundColor: "rgba(201,162,74,0.18)", color: "#E5C36B" }
        : {
          backgroundColor: "rgba(125,162,214,0.16)",
          color: "#A8C2E6",
        }

  return (
    <div
      className="rounded-[24px] p-5"
      style={{
        backgroundColor: PANEL_BG_SOFT,
        border: `1px solid ${BORDER}`,
      }}
    >
      <div className="flex items-start gap-4">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
          style={badgeStyles}
        >
          {index}
        </div>

        <div className="min-w-0">
          <div className="text-[18px] font-semibold text-white">{title}</div>
          <div className="mt-3 text-[15px] leading-7" style={{ color: MUTED }}>
            {body}
          </div>
        </div>
      </div>
    </div>
  )
}

function MiniMetric({
  label,
  value,
  trend,
}: {
  label: string
  value: string | number
  trend?: {
    delta: number
    deltaPercent: number
    direction: "up" | "down" | "flat"
  }
}) {
  return (
    <div
      className="rounded-2xl p-4"
      style={{
        backgroundColor: PANEL_BG_SOFT,
        border: `1px solid ${BORDER}`,
      }}
    >
      <div className="text-xs uppercase tracking-wide" style={{ color: SOFT }}>
        {label}
      </div>
      <div className="mt-3 text-3xl font-semibold text-white">{value}</div>

      {trend ? (
        <div
          className="mt-2 text-xs"
          style={{ color: trendColour(trend.direction) }}
        >
          {trendArrow(trend.direction)} {formatSignedPercent(trend.deltaPercent)}%
        </div>
      ) : null}
    </div>
  )
}

function MetricRow({
  label,
  value,
  trend,
  helper,
}: {
  label: string
  value: string
  trend?: {
    delta: number
    deltaPercent: number
    direction: "up" | "down" | "flat"
  }
  helper?: string
}) {
  return (
    <div
      className="rounded-2xl px-4 py-4"
      style={{
        backgroundColor: PANEL_BG_SOFT,
        border: `1px solid ${BORDER}`,
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div
            className="text-[16px] font-semibold"
            style={{ color: "rgba(255,255,255,0.92)" }}
          >
            {label}
          </div>
          {helper ? (
            <div className="mt-1.5 text-sm" style={{ color: SOFT }}>
              {helper}
            </div>
          ) : null}
        </div>

        <div className="text-right">
          <div className="text-2xl font-semibold text-white">{value}</div>
          {trend ? (
            <div
              className="mt-1 text-xs"
              style={{ color: trendColour(trend.direction) }}
            >
              {trendArrow(trend.direction)}{" "}
              {formatSignedPercent(trend.deltaPercent)}%
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

function ListMetric({
  index,
  title,
  value,
  helper,
}: {
  index: number
  title: string
  value: string
  helper: string
}) {
  return (
    <div
      className="flex items-center justify-between gap-4 rounded-2xl px-4 py-4"
      style={{
        backgroundColor: PANEL_BG_SOFT,
        border: `1px solid ${BORDER}`,
      }}
    >
      <div className="flex min-w-0 items-center gap-4">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
          style={{
            backgroundColor: "rgba(201,162,74,0.15)",
            color: "#E5C36B",
          }}
        >
          {index}
        </div>

        <div className="min-w-0">
          <div className="truncate text-[16px] font-semibold text-white">
            {title}
          </div>
          <div className="mt-1 text-sm" style={{ color: SOFT }}>
            {helper}
          </div>
        </div>
      </div>

      <div className="text-[18px] font-semibold text-white">{value}</div>
    </div>
  )
}

function TrendRow({
  label,
  value,
}: {
  label: string
  value: string | number
}) {
  return (
    <div className="flex items-center justify-between py-2.5 text-sm">
      <div style={{ color: MUTED }}>{label}</div>
      <div className="font-medium text-white">{value}</div>
    </div>
  )
}

function TrendBullet({
  trend,
  label,
}: {
  trend: {
    delta: number
    deltaPercent: number
    direction: "up" | "down" | "flat"
  }
  label: string
}) {
  const bulletColour =
    trend.direction === "up"
      ? GREEN
      : trend.direction === "down"
        ? RED
        : "rgba(255,255,255,0.35)"

  return (
    <div className="flex items-center gap-3">
      <span
        className="h-3 w-3 rounded-full"
        style={{ backgroundColor: bulletColour }}
      />
      <div className="text-[16px]" style={{ color: "rgba(255,255,255,0.80)" }}>
        {label} —{" "}
        <span style={{ color: trendColour(trend.direction) }}>
          {trendArrow(trend.direction)} {formatSignedPercent(trend.deltaPercent)}%
        </span>
      </div>
    </div>
  )
}

function FunnelStep({
  label,
  value,
  helper,
}: {
  label: string
  value: string | number
  helper: string
}) {
  return (
    <div
      className="rounded-2xl px-5 py-5"
      style={{
        backgroundColor: PANEL_BG_SOFT,
        border: `1px solid ${BORDER}`,
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div
            className="text-xs uppercase tracking-[0.18em]"
            style={{ color: SOFT }}
          >
            {label}
          </div>
          <div className="mt-3 text-5xl font-semibold text-white">{value}</div>
          <div className="mt-2.5 text-base" style={{ color: MUTED }}>
            {helper}
          </div>
        </div>
      </div>
    </div>
  )
}

function FunnelArrow() {
  return (
    <div className="flex justify-center">
      <div
        className="flex h-10 w-10 items-center justify-center rounded-full"
        style={{
          backgroundColor: "rgba(255,255,255,0.06)",
          border: `1px solid ${BORDER}`,
          color: SOFT,
        }}
      >
        ↓
      </div>
    </div>
  )
}

function StatLine({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div
      className="flex items-center justify-between gap-4 border-b pb-4 last:border-b-0 last:pb-0"
      style={{ borderColor: BORDER }}
    >
      <div className="text-sm" style={{ color: MUTED }}>
        {label}
      </div>
      <div className="text-sm font-semibold text-white">{value}</div>
    </div>
  )
}

function trendColour(direction: "up" | "down" | "flat") {
  if (direction === "up") return "#86C65C"
  if (direction === "down") return "#E27C7C"
  return "rgba(255,255,255,0.45)"
}

function trendArrow(direction: "up" | "down" | "flat") {
  if (direction === "up") return "▲"
  if (direction === "down") return "▼"
  return "•"
}

function formatSignedPercent(value: number) {
  return `${value >= 0 ? "+" : ""}${value.toFixed(1)}`
}

function safePercent(value: number, total: number) {
  if (!total) return 0
  return (value / total) * 100
}

function getDataConfidence(visits: number): {
  label: string
  tone: "low" | "medium" | "high"
} {
  if (visits >= 150) return { label: "Confidence High", tone: "high" }
  if (visits >= 50) return { label: "Confidence Medium", tone: "medium" }
  return { label: "Confidence Low", tone: "low" }
}

function getScoreTone(score: number): "weak" | "fair" | "strong" {
  if (score >= 75) return "strong"
  if (score >= 50) return "fair"
  return "weak"
}

function toBulletTone(
  tone?: "good" | "warning" | "neutral"
): "good" | "warning" | "neutral" {
  return tone ?? "neutral"
}