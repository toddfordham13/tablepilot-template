"use client"
import type { ReactNode } from "react"
import Link from "next/link"

import HeroEngagementDonut from "@/components/kpi/HeroEngagementDonut"
import type { TrendComparison } from "@/lib/analytics/getTrendComparison"
import type {
  RestaurantAction,
  RestaurantInsight,
} from "@/lib/analytics/getRestaurantInsights"

type RangeKey = "today" | "7d" | "30d"

const RANGE_OPTIONS: Array<{ key: RangeKey; label: string }> = [
  { key: "today", label: "Today" },
  { key: "7d", label: "Last 7 days" },
  { key: "30d", label: "Last 30 days" },
]

type TrendData = {
  delta: number
  deltaPercent: number
  direction: "up" | "down" | "flat"
}

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
  actions: RestaurantAction[]
  trends: TrendComparison
}

const NAV_BG = "#0B1728"
const PANEL_BG = "#122033"
const PANEL_BG_SOFT = "#16263B"
const PANEL_BG_SUBTLE = "rgba(255,255,255,0.03)"
const BORDER = "rgba(255,255,255,0.10)"
const BORDER_STRONG = "rgba(201,162,74,0.18)"
const MUTED = "rgba(255,255,255,0.64)"
const SOFT = "rgba(255,255,255,0.45)"
const GOLD = "#C9A24A"
const GREEN = "#78A84F"
const RED = "#D16C6C"
const BLUE = "#7DA2D6"

const heroPanelStyles = {
  background:
    "linear-gradient(180deg, rgba(18,32,51,1) 0%, rgba(17,30,48,1) 100%)",
  border: `1px solid ${BORDER}`,
  boxShadow: "0 28px 70px rgba(0,0,0,0.30)",
} as const

export default function KpiDashboard({
  concept,
  range,
  health,
  summary,
  kpis,
  insights,
  actions: _actions,
  trends,
}: KpiDashboardProps) {
  const confidence = getDataConfidence(summary.visits)
  const scoreTone = getScoreTone(health.score)
  const scoreLabel = getScoreLabel(health.score)
  const scoreDescriptor = getScoreDescriptor(health.score)
  const scoreBand = getScoreBand(health.score)

  const primaryInsight = getPrimaryInsight(insights, health)
  const supportingInsight = getSupportingInsight(insights, primaryInsight)
  const positiveInsight = getPositiveInsight(
    insights,
    primaryInsight,
    supportingInsight
  )

  const heroBullets = [
    primaryInsight,
    supportingInsight,
    positiveInsight,
  ].filter(Boolean) as RestaurantInsight[]

  const executiveSummary = buildExecutiveSummary({
    healthSummary: health.summary,
    primaryInsight,
    supportingInsight,
  })

  const guestActionTotal =
    summary.bookingClicks + summary.phoneClicks + summary.directionsClicks

  const guestJourney = summary.guestJourney
  const visitsToMenuDrop = Math.max(
    guestJourney.visits - guestJourney.menuViews,
    0
  )
  const menuToBookingDrop = Math.max(
    guestJourney.menuViews - guestJourney.bookingClicks,
    0
  )

  const businessSignals = [
    {
      label: "Bookings",
      value: formatCount(summary.bookingClicks),
      helper: `${formatPercent(safePercent(summary.bookingClicks, summary.visits))} of visits`,
      trend: trends.bookingIntentRate,
      emphasis: true,
      current: summary.bookingClicks,
      previous: Math.max(
        summary.bookingClicks - trends.bookingIntentRate.delta,
        0
      ),
    },
    {
      label: "Calls",
      value: formatCount(summary.phoneClicks),
      helper: `${formatPercent(safePercent(summary.phoneClicks, summary.visits))} of visits`,
      trend: undefined,
      emphasis: false,
      current: summary.phoneClicks,
      previous: 0,
    },
    {
      label: "Directions",
      value: formatCount(summary.directionsClicks),
      helper: `${formatPercent(safePercent(summary.directionsClicks, summary.visits))} of visits`,
      trend: undefined,
      emphasis: false,
      current: summary.directionsClicks,
      previous: 0,
    },
    {
      label: "Guest actions",
      value: formatCount(guestActionTotal),
      helper: "Bookings + calls + directions",
      trend: trends.contactActionRate,
      emphasis: true,
      current: guestActionTotal,
      previous: Math.max(guestActionTotal - trends.contactActionRate.delta, 0),
    },
  ]

  const supportingSignals = [
    {
      label: "Gallery engagement",
      value: formatPercent(kpis.galleryEngagementRate),
      helper: `${formatCount(summary.galleryViews)} gallery views`,
    },
    {
      label: "Contact section reach",
      value: formatPercent(kpis.contactSectionReachRate),
      helper: `${formatCount(summary.contactSectionViews)} section views`,
    },
    {
      label: "Avg. scroll depth",
      value: formatPercent(kpis.avgScrollDepth),
      helper: `Max depth ${formatPercent(kpis.maxScrollDepth)}`,
    },
    {
      label: "Menu item interest",
      value: formatCount(summary.menuCategoryClicks),
      helper: "Preview menu interactions",
    },
  ]

  const movementRows = [
    {
      label: "Visits",
      trend: trends.visits,
      current: summary.visits,
      previous: Math.max(summary.visits - trends.visits.delta, 0),
    },
    {
      label: "Menu engagement",
      trend: trends.menuInterestRate,
      current: summary.menuViews,
      previous: estimatePreviousCountFromRate(
        summary.menuViews,
        trends.menuInterestRate
      ),
    },
    {
      label: "Booking intent",
      trend: trends.bookingIntentRate,
      current: summary.bookingClicks,
      previous: Math.max(
        summary.bookingClicks - trends.bookingIntentRate.delta,
        0
      ),
    },
    {
      label: "Contact action",
      trend: trends.contactActionRate,
      current: summary.contactActions,
      previous: Math.max(
        summary.contactActions - trends.contactActionRate.delta,
        0
      ),
    },
  ]

  const activityBars = [
    { label: "Visitors", value: summary.visits, tone: "blue" as const },
    { label: "Menu views", value: summary.menuViews, tone: "gold" as const },
    { label: "Bookings", value: summary.bookingClicks, tone: "green" as const },
    {
      label: "Contact actions",
      value: summary.contactActions,
      tone: "gold" as const,
    },
  ]

  const engagementLegend = [
    { label: "Menu", value: summary.menuViews, colour: GOLD },
    { label: "Bookings", value: summary.bookingClicks, colour: GREEN },
    { label: "Contact", value: summary.contactActions, colour: BLUE },
    {
      label: "Gallery",
      value: summary.galleryViews,
      colour: "rgba(255,255,255,0.68)",
    },
  ]

  const engagementBars = [
    {
      label: "Menu reach",
      value: kpis.menuInterestRate,
      helper: `${formatCount(summary.menuViews)} menu views`,
    },
    {
      label: "Booking intent",
      value: kpis.bookingIntentRate,
      helper: `${formatCount(summary.bookingClicks)} booking clicks`,
    },
    {
      label: "Contact reach",
      value: kpis.contactActionRate,
      helper: `${formatCount(summary.contactActions)} contact actions`,
    },
    {
      label: "Gallery engagement",
      value: kpis.galleryEngagementRate,
      helper: `${formatCount(summary.galleryViews)} gallery views`,
    },
  ]

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
              <SidebarItem label="Overview" active />
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
                  Performance overview
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {RANGE_OPTIONS.map((option) => {
                  const isActive = option.key === range

                  return (
                    <Link
                      key={option.key}
                      href={`/dashboard?range=${option.key}`}
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
            <div className="space-y-6">
              <section
                className="rounded-[32px] p-7 md:p-8 xl:p-10"
                style={heroPanelStyles}
              >
                <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_280px] xl:items-start">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <SectionEyebrow>Site Performance Score</SectionEyebrow>
                      <ConfidenceBadge
                        label={confidence.label}
                        tone={confidence.tone}
                      />
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3">
                      <ScorePill
                        label={scoreBand}
                        value={`${Math.round(health.score)}/100`}
                        tone={scoreTone}
                      />
                      <ScorePill
                        label="Status"
                        value={scoreLabel}
                        tone={scoreTone}
                      />
                      <ScorePill
                        label="Read"
                        value={scoreDescriptor}
                        tone="neutral"
                      />
                    </div>

                    <div className="mt-6 space-y-4">
                      {heroBullets.map((insight, index) => (
                        <HealthBullet
                          key={`${insight.title}-${index}`}
                          tone={toBulletTone(insight.tone)}
                          text={softenInsightTitle(insight.title)}
                        />
                      ))}

                      {!heroBullets.length && (
                        <HealthBullet tone="neutral" text={health.status} />
                      )}
                    </div>

                    <div
                      className="mt-6 max-w-2xl text-[15px] leading-8"
                      style={{ color: MUTED }}
                    >
                      {softenExecutiveSummary(executiveSummary)}
                    </div>

                    <div className="mt-8 grid gap-3 sm:grid-cols-3">
                      <HealthMiniStat
                        label="Visitors"
                        value={formatCount(summary.visits)}
                        helper={confidence.label.replace("Confidence ", "")}
                      />
                      <HealthMiniStat
                        label="Menu rate"
                        value={formatPercent(kpis.menuInterestRate)}
                        helper="Visit → menu"
                      />
                      <HealthMiniStat
                        label="Booking rate"
                        value={formatPercent(kpis.bookingIntentRate)}
                        helper="Visit → booking"
                      />
                    </div>
                  </div>

                  <div className="flex justify-center xl:justify-end xl:self-start">
                    <HeroEngagementDonut
                      menu={summary.menuViews}
                      bookings={summary.bookingClicks}
                      contact={summary.contactActions}
                      gallery={summary.galleryViews}
                    />
                  </div>
                </div>
              </section>

              <Panel>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <SectionEyebrow>Quick Read</SectionEyebrow>
                    <div className="mt-3 text-sm" style={{ color: MUTED }}>
                      Plain-English summary of current site performance in this
                      range.
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  <SummaryCard
                    title="Visitors"
                    body={`${formatCount(summary.visits)} people visited the site in this period.`}
                  />
                  <SummaryCard
                    title="Menu interest"
                    body={`${formatCount(summary.menuViews)} reached the menu, which is ${formatPercent(kpis.menuInterestRate)} of visits.`}
                  />
                  <SummaryCard
                    title="Guest action"
                    body={`${formatCount(summary.bookingClicks)} booking click${summary.bookingClicks === 1 ? "" : "s"} and ${formatCount(guestActionTotal)} total guest action${guestActionTotal === 1 ? "" : "s"} were recorded.`}
                  />
                </div>
              </Panel>

              <Panel>
                <div className="flex items-center justify-between">
                  <SectionEyebrow>Business Signals</SectionEyebrow>
                  <MutedLabel>What matters most</MutedLabel>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {businessSignals.map((signal) => (
                    <SignalCard
                      key={signal.label}
                      label={signal.label}
                      value={signal.value}
                      helper={signal.helper}
                      trend={signal.trend}
                      emphasis={signal.emphasis}
                      current={signal.current}
                      previous={signal.previous}
                    />
                  ))}
                </div>
              </Panel>

              <section className="grid gap-6 xl:grid-cols-2">
                <Panel className="h-full">
                  <div className="flex items-center justify-between">
                    <SectionEyebrow>Guest Journey</SectionEyebrow>
                    <MutedLabel>Visitors → menu → bookings</MutedLabel>
                  </div>

                  <div className="mt-6 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
                    <div className="grid gap-3">
                      <JourneyStep
                        step={1}
                        label="Visitors"
                        value={formatCount(guestJourney.visits)}
                        helper="Entered the site"
                        rate="100%"
                        tone="base"
                      />
                      <JourneyDropRow
                        label="Progression into menu discovery"
                        lost={visitsToMenuDrop}
                        retained={guestJourney.menuViews}
                        retentionRate={safePercent(
                          guestJourney.menuViews,
                          guestJourney.visits
                        )}
                      />
                      <JourneyStep
                        step={2}
                        label="Menu views"
                        value={formatCount(guestJourney.menuViews)}
                        helper="Reached the menu"
                        rate={`${formatPercent(kpis.menuInterestRate)} of visitors`}
                        tone="mid"
                      />
                      <JourneyDropRow
                        label="Progression into booking intent"
                        lost={menuToBookingDrop}
                        retained={guestJourney.bookingClicks}
                        retentionRate={safePercent(
                          guestJourney.bookingClicks,
                          guestJourney.menuViews
                        )}
                      />
                      <JourneyStep
                        step={3}
                        label="Bookings"
                        value={formatCount(guestJourney.bookingClicks)}
                        helper="Clicked through to book"
                        rate={`${formatPercent(kpis.menuToBookingRate)} of menu viewers`}
                        tone="end"
                      />
                    </div>

                    <div
                      className="rounded-[24px] p-5"
                      style={{
                        backgroundColor: PANEL_BG_SOFT,
                        border: `1px solid ${BORDER}`,
                      }}
                    >
                      <div className="text-sm font-semibold text-white">
                        Journey snapshot
                      </div>

                      <div className="mt-4 grid gap-3">
                        <JourneySnapshotStat
                          label="Visit → menu"
                          value={formatPercent(kpis.menuInterestRate)}
                          helper={`${formatCount(guestJourney.menuViews)} of ${formatCount(guestJourney.visits)}`}
                        />
                        <JourneySnapshotStat
                          label="Menu → booking"
                          value={formatPercent(kpis.menuToBookingRate)}
                          helper={`${formatCount(guestJourney.bookingClicks)} of ${formatCount(guestJourney.menuViews)}`}
                        />
                        <JourneySnapshotStat
                          label="Visit → booking"
                          value={formatPercent(kpis.bookingIntentRate)}
                          helper={`${formatCount(guestJourney.bookingClicks)} of ${formatCount(guestJourney.visits)}`}
                        />
                      </div>

                      <div
                        className="mt-5 border-t pt-5"
                        style={{ borderColor: BORDER }}
                      >
                        <div className="flex items-center justify-between gap-4 text-sm">
                          <span style={{ color: MUTED }}>Strongest stage</span>
                          <span className="font-medium text-white">
                            {getStrongestStageLabel(kpis)}
                          </span>
                        </div>
                        <div
                          className="mt-2 text-sm leading-6"
                          style={{ color: SOFT }}
                        >
                          {getJourneyRead(kpis, guestJourney)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className="mt-6 border-t pt-6"
                    style={{ borderColor: BORDER }}
                  >
                    <div className="flex items-center justify-between">
                      <SectionEyebrow>Visual Conversion Funnel</SectionEyebrow>
                      <MutedLabel>Where demand narrows</MutedLabel>
                    </div>

                    <div className="mt-5 space-y-4">
                      <FunnelBar
                        label="Visitors"
                        value={guestJourney.visits}
                        width={100}
                        note="Base audience"
                      />
                      <FunnelBar
                        label="Menu views"
                        value={guestJourney.menuViews}
                        width={getFunnelWidth(
                          guestJourney.menuViews,
                          guestJourney.visits
                        )}
                        note={`${formatPercent(kpis.menuInterestRate)} of visitors`}
                      />
                      <FunnelBar
                        label="Bookings"
                        value={guestJourney.bookingClicks}
                        width={getFunnelWidth(
                          guestJourney.bookingClicks,
                          guestJourney.visits
                        )}
                        note={`${formatPercent(kpis.bookingIntentRate)} of visitors`}
                      />
                    </div>
                  </div>
                </Panel>

                <div className="grid gap-6">
                  <Panel>
                    <div className="flex items-center justify-between">
                      <SectionEyebrow>Conversion Metrics</SectionEyebrow>
                      <MutedLabel>How efficiently the site converts</MutedLabel>
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                      <MetricRow
                        label="Visit → Booking"
                        value={formatPercent(kpis.bookingIntentRate)}
                        trend={trends.bookingIntentRate}
                        current={summary.bookingClicks}
                        previous={Math.max(
                          summary.bookingClicks - trends.bookingIntentRate.delta,
                          0
                        )}
                      />
                      <MetricRow
                        label="Visit → Contact"
                        value={formatPercent(kpis.contactActionRate)}
                        trend={trends.contactActionRate}
                        current={summary.contactActions}
                        previous={Math.max(
                          summary.contactActions - trends.contactActionRate.delta,
                          0
                        )}
                      />
                      <MetricRow
                        label="Visit → Menu"
                        value={formatPercent(kpis.menuInterestRate)}
                        trend={trends.menuInterestRate}
                        current={summary.menuViews}
                        previous={estimatePreviousCountFromRate(
                          summary.menuViews,
                          trends.menuInterestRate
                        )}
                      />
                      <MetricRow
                        label="Menu → Booking"
                        value={formatPercent(kpis.menuToBookingRate)}
                        trend={trends.menuToBookingRate}
                        current={summary.bookingClicks}
                        previous={estimatePreviousCountFromRate(
                          summary.bookingClicks,
                          trends.menuToBookingRate
                        )}
                      />
                    </div>
                  </Panel>

                  <Panel>
                    <div className="flex items-center justify-between">
                      <SectionEyebrow>What Changed</SectionEyebrow>
                      <MutedLabel>Movement vs previous period</MutedLabel>
                    </div>

                    <div
                      className="mt-4 rounded-2xl px-4 py-3 text-sm"
                      style={{
                        backgroundColor: "rgba(255,255,255,0.04)",
                        border: `1px solid ${BORDER}`,
                        color: SOFT,
                      }}
                    >
                      Lower-volume ranges automatically switch to count-based
                      movement so short periods stay readable and commercially
                      useful.
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                      {movementRows.map((item) => (
                        <TrendTile
                          key={item.label}
                          label={item.label}
                          trend={item.trend}
                          current={item.current}
                          previous={item.previous}
                        />
                      ))}
                    </div>
                  </Panel>
                </div>
              </section>

              <section className="grid gap-6 xl:grid-cols-2">
                <Panel>
                  <div className="flex items-center justify-between">
                    <SectionEyebrow>Activity Snapshot</SectionEyebrow>
                    <MutedLabel>Volume at a glance</MutedLabel>
                  </div>

                  <div className="mt-6">
                    <VerticalBarChart items={activityBars} />
                  </div>
                </Panel>

                <Panel>
                  <div className="flex items-center justify-between">
                    <SectionEyebrow>Engagement Mix</SectionEyebrow>
                    <MutedLabel>How guests are interacting</MutedLabel>
                  </div>

                  <div className="mt-6">
                    <div className="grid gap-3 sm:grid-cols-2">
                      {engagementLegend.map((item) => (
                        <LegendCard
                          key={item.label}
                          label={item.label}
                          value={formatCount(item.value)}
                          colour={item.colour}
                        />
                      ))}
                    </div>

                    <div className="mt-5 space-y-4">
                      {engagementBars.map((item) => (
                        <ProgressMetric
                          key={item.label}
                          label={item.label}
                          value={item.value}
                          helper={item.helper}
                        />
                      ))}
                    </div>
                  </div>
                </Panel>
              </section>

              <section className="grid gap-6 xl:grid-cols-2">
                <Panel>
                  <div className="flex items-center justify-between">
                    <SectionEyebrow>Supporting Signals</SectionEyebrow>
                    <MutedLabel>Diagnostics and supporting context</MutedLabel>
                  </div>

                  <div className="mt-6 space-y-4">
                    {supportingSignals.map((item) => (
                      <MetricRow
                        key={item.label}
                        label={item.label}
                        value={item.value}
                        helper={item.helper}
                      />
                    ))}
                  </div>
                </Panel>

                <Panel>
                  <div className="flex items-center justify-between">
                    <SectionEyebrow>Menu Performance</SectionEyebrow>
                    <MutedLabel>Food discovery and conversion</MutedLabel>
                  </div>

                  <div className="mt-6 space-y-4">
                    <MetricRow
                      label="Menu engagement"
                      value={formatPercent(kpis.menuInterestRate)}
                      helper="Visit → menu interest"
                      trend={trends.menuInterestRate}
                      current={summary.menuViews}
                      previous={estimatePreviousCountFromRate(
                        summary.menuViews,
                        trends.menuInterestRate
                      )}
                    />
                    <MetricRow
                      label="Menu → booking"
                      value={formatPercent(kpis.menuToBookingRate)}
                      helper="Menu viewers who clicked booking"
                      trend={trends.menuToBookingRate}
                      current={summary.bookingClicks}
                      previous={estimatePreviousCountFromRate(
                        summary.bookingClicks,
                        trends.menuToBookingRate
                      )}
                    />
                  </div>

                  <div
                    className="mt-6 border-t pt-5"
                    style={{ borderColor: BORDER }}
                  >
                    <TrendRow
                      label="Visitors"
                      value={formatCount(summary.visits)}
                    />
                    <TrendRow
                      label="Menu views"
                      value={formatCount(summary.menuViews)}
                    />
                    <TrendRow
                      label="Contact actions"
                      value={formatCount(summary.contactActions)}
                    />
                  </div>
                </Panel>
              </section>
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
  children: ReactNode
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

function SectionEyebrow({ children }: { children: ReactNode }) {
  return (
    <div
      className="text-xs uppercase tracking-[0.24em]"
      style={{ color: SOFT }}
    >
      {children}
    </div>
  )
}

function MutedLabel({ children }: { children: ReactNode }) {
  return (
    <div className="text-xs" style={{ color: SOFT }}>
      {children}
    </div>
  )
}

function SummaryCard({
  title,
  body,
}: {
  title: string
  body: string
}) {
  return (
    <div
      className="rounded-[24px] p-5"
      style={{
        backgroundColor: PANEL_BG_SOFT,
        border: `1px solid ${BORDER}`,
      }}
    >
      <div className="text-sm font-semibold text-white">{title}</div>
      <div className="mt-3 text-[15px] leading-7" style={{ color: MUTED }}>
        {body}
      </div>
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
    <div
      className="rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em]"
      style={styles}
    >
      {label}
    </div>
  )
}

function ScorePill({
  label,
  value,
  tone,
}: {
  label: string
  value: string
  tone: "weak" | "fair" | "strong" | "neutral"
}) {
  const styles =
    tone === "strong"
      ? {
        border: "1px solid rgba(120,168,79,0.28)",
        backgroundColor: "rgba(120,168,79,0.10)",
        valueColor: "#B6DA8D",
      }
      : tone === "fair"
        ? {
          border: "1px solid rgba(201,162,74,0.28)",
          backgroundColor: "rgba(201,162,74,0.10)",
          valueColor: "#E4C67A",
        }
        : tone === "weak"
          ? {
            border: "1px solid rgba(209,108,108,0.24)",
            backgroundColor: "rgba(209,108,108,0.10)",
            valueColor: "#E89A9A",
          }
          : {
            border: `1px solid ${BORDER}`,
            backgroundColor: "rgba(255,255,255,0.04)",
            valueColor: "#FFFFFF",
          }

  return (
    <div
      className="rounded-2xl px-4 py-3"
      style={{
        border: styles.border,
        backgroundColor: styles.backgroundColor,
      }}
    >
      <div
        className="text-[10px] uppercase tracking-[0.18em]"
        style={{ color: SOFT }}
      >
        {label}
      </div>
      <div
        className="mt-1 text-sm font-semibold"
        style={{ color: styles.valueColor }}
      >
        {value}
      </div>
    </div>
  )
}

function HealthMiniStat({
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
      className="rounded-[22px] px-4 py-4"
      style={{
        backgroundColor: PANEL_BG_SOFT,
        border: `1px solid ${BORDER}`,
      }}
    >
      <div
        className="text-[10px] uppercase tracking-[0.18em]"
        style={{ color: SOFT }}
      >
        {label}
      </div>
      <div className="mt-2 text-[28px] leading-none font-semibold text-white">
        {value}
      </div>
      <div className="mt-2 text-sm" style={{ color: MUTED }}>
        {helper}
      </div>
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
  const colour = tone === "good" ? GREEN : tone === "warning" ? GOLD : BLUE

  return (
    <div className="flex items-center gap-4">
      <span
        className="h-3.5 w-3.5 rounded-full"
        style={{ backgroundColor: colour }}
      />
      <div
        className="text-[18px] font-medium"
        style={{ color: "rgba(255,255,255,0.92)" }}
      >
        {text}
      </div>
    </div>
  )
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

function SignalCard({
  label,
  value,
  helper,
  trend,
  emphasis,
  current,
  previous,
}: {
  label: string
  value: string
  helper: string
  trend?: TrendData
  emphasis?: boolean
  current: number
  previous: number
}) {
  return (
    <div
      className="rounded-[20px] px-5 py-4"
      style={{
        backgroundColor: emphasis ? PANEL_BG_SOFT : PANEL_BG_SUBTLE,
        border: `1px solid ${emphasis ? BORDER_STRONG : BORDER}`,
      }}
    >
      <div className="text-xs uppercase tracking-[0.18em]" style={{ color: SOFT }}>
        {label}
      </div>

      <div className="mt-3 text-[42px] leading-none font-semibold text-white">
        {value}
      </div>

      <div className="mt-2 text-sm" style={{ color: MUTED }}>
        {helper}
      </div>

      {trend ? (
        <>
          <div
            className="mt-3 text-sm font-medium"
            style={{ color: trendColour(trend.direction, current, previous) }}
          >
            {formatTrendMessage(current, previous, trend)}
          </div>
          <MiniComparisonChart current={current} previous={previous} />
        </>
      ) : null}
    </div>
  )
}

function MetricRow({
  label,
  value,
  trend,
  helper,
  current,
  previous,
}: {
  label: string
  value: string
  trend?: TrendData
  helper?: string
  current?: number
  previous?: number
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

        <div className="max-w-[180px] text-right">
          <div className="text-2xl font-semibold text-white">{value}</div>
          {trend && current !== undefined && previous !== undefined ? (
            <div
              className="mt-1 text-xs leading-5"
              style={{ color: trendColour(trend.direction, current, previous) }}
            >
              {formatTrendMessage(current, previous, trend)}
            </div>
          ) : null}
        </div>
      </div>

      {current !== undefined && previous !== undefined ? (
        <div className="mt-4">
          <MiniComparisonChart current={current} previous={previous} />
        </div>
      ) : null}
    </div>
  )
}

function TrendTile({
  label,
  trend,
  current,
  previous,
}: {
  label: string
  trend: TrendData
  current: number
  previous: number
}) {
  const earlySignal = isLowSample(current, previous)

  return (
    <div
      className="rounded-2xl p-5"
      style={{
        backgroundColor: PANEL_BG_SOFT,
        border: `1px solid ${BORDER}`,
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-semibold text-white">{label}</div>
        {earlySignal ? <EarlySignalBadge /> : null}
      </div>

      <div
        className="mt-4 text-3xl font-semibold"
        style={{ color: trendColour(trend.direction, current, previous) }}
      >
        {trendArrow(trend.direction, current, previous)}{" "}
        {formatTrendHeadline(current, previous, trend)}
      </div>

      <div className="mt-2 text-sm" style={{ color: MUTED }}>
        {formatTrendSubline(current, previous)}
      </div>

      <div className="mt-4">
        <ComparisonBars current={current} previous={previous} />
      </div>
    </div>
  )
}

function EarlySignalBadge() {
  return (
    <div
      className="rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em]"
      style={{
        backgroundColor: "rgba(125,162,214,0.14)",
        border: "1px solid rgba(125,162,214,0.24)",
        color: "#9FBDE3",
      }}
    >
      Early signal
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

function JourneyStep({
  step,
  label,
  value,
  helper,
  rate,
  tone,
}: {
  step: number
  label: string
  value: string | number
  helper: string
  rate: string
  tone: "base" | "mid" | "end"
}) {
  const accent = tone === "base" ? BLUE : tone === "mid" ? GOLD : GREEN

  return (
    <div
      className="rounded-[22px] px-5 py-5"
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
            Step {step}
          </div>
          <div className="mt-2 text-[18px] font-semibold text-white">
            {label}
          </div>
        </div>

        <div
          className="rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em]"
          style={{
            backgroundColor: "rgba(255,255,255,0.05)",
            border: `1px solid ${BORDER}`,
            color: accent,
          }}
        >
          {rate}
        </div>
      </div>

      <div className="mt-4 text-5xl leading-none font-semibold text-white">
        {value}
      </div>

      <div className="mt-3 text-sm" style={{ color: MUTED }}>
        {helper}
      </div>
    </div>
  )
}

function JourneyDropRow({
  label,
  lost,
  retained,
  retentionRate,
}: {
  label: string
  lost: number
  retained: number
  retentionRate: number
}) {
  return (
    <div
      className="rounded-[18px] px-4 py-3"
      style={{
        backgroundColor: "rgba(255,255,255,0.03)",
        border: `1px solid ${BORDER}`,
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm" style={{ color: MUTED }}>
          {label}
        </div>

        <div className="flex flex-wrap gap-2">
          <JourneyChip
            label="Progressed"
            value={`${formatCount(retained)} • ${formatPercent(retentionRate)}`}
            tone="good"
          />
          <JourneyChip
            label="Not yet progressed"
            value={formatCount(lost)}
            tone="neutral"
          />
        </div>
      </div>
    </div>
  )
}

function JourneyChip({
  label,
  value,
  tone,
}: {
  label: string
  value: string
  tone: "good" | "neutral"
}) {
  return (
    <div
      className="rounded-full px-3 py-1.5 text-xs"
      style={{
        backgroundColor:
          tone === "good"
            ? "rgba(120,168,79,0.12)"
            : "rgba(255,255,255,0.05)",
        border:
          tone === "good"
            ? "1px solid rgba(120,168,79,0.24)"
            : `1px solid ${BORDER}`,
        color: tone === "good" ? "#B6DA8D" : "rgba(255,255,255,0.82)",
      }}
    >
      <span style={{ color: SOFT }}>{label}</span> <span>{value}</span>
    </div>
  )
}

function JourneySnapshotStat({
  label,
  value,
  helper,
}: {
  label: string
  value: string
  helper: string
}) {
  return (
    <div
      className="rounded-2xl px-4 py-4"
      style={{
        backgroundColor: "rgba(255,255,255,0.04)",
        border: `1px solid ${BORDER}`,
      }}
    >
      <div className="text-xs uppercase tracking-[0.16em]" style={{ color: SOFT }}>
        {label}
      </div>
      <div className="mt-2 text-2xl font-semibold text-white">{value}</div>
      <div className="mt-1.5 text-sm" style={{ color: MUTED }}>
        {helper}
      </div>
    </div>
  )
}

function FunnelBar({
  label,
  value,
  width,
  note,
}: {
  label: string
  value: number
  width: number
  note: string
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-4 text-sm">
        <span style={{ color: "rgba(255,255,255,0.88)" }}>{label}</span>
        <span className="font-medium text-white">{formatCount(value)}</span>
      </div>

      <div
        className="h-3 overflow-hidden rounded-full"
        style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${width}%`,
            minWidth: value > 0 ? "10px" : "0px",
            background: `linear-gradient(90deg, ${GOLD} 0%, #E6C778 100%)`,
          }}
        />
      </div>

      <div className="mt-2 text-xs" style={{ color: SOFT }}>
        {note}
      </div>
    </div>
  )
}

function MiniComparisonChart({
  current,
  previous,
}: {
  current: number
  previous: number
}) {
  const currentValue = Math.max(current, 0)
  const previousValue = Math.max(previous, 0)
  const max = Math.max(currentValue, previousValue, 1)
  const previousWidth = (previousValue / max) * 100
  const currentWidth = (currentValue / max) * 100

  return (
    <div className="mt-4 space-y-2">
      <div className="flex items-center gap-3">
        <div className="w-[52px] text-[11px]" style={{ color: SOFT }}>
          Previous
        </div>
        <div
          className="h-2.5 flex-1 overflow-hidden rounded-full"
          style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
        >
          <div
            className="h-full rounded-full"
            style={{
              width: `${previousWidth}%`,
              backgroundColor: "rgba(125,162,214,0.72)",
            }}
          />
        </div>
        <div className="w-[54px] text-right text-[11px]" style={{ color: SOFT }}>
          {formatSmallNumber(previous)}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-[52px] text-[11px]" style={{ color: SOFT }}>
          Current
        </div>
        <div
          className="h-2.5 flex-1 overflow-hidden rounded-full"
          style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
        >
          <div
            className="h-full rounded-full"
            style={{
              width: `${currentWidth}%`,
              background: `linear-gradient(90deg, ${GOLD} 0%, #E6C778 100%)`,
            }}
          />
        </div>
        <div className="w-[54px] text-right text-[11px]" style={{ color: SOFT }}>
          {formatSmallNumber(current)}
        </div>
      </div>
    </div>
  )
}

function ComparisonBars({
  current,
  previous,
}: {
  current: number
  previous: number
}) {
  const currentValue = Math.max(current, 0)
  const previousValue = Math.max(previous, 0)
  const max = Math.max(currentValue, previousValue, 1)
  const previousWidth = (previousValue / max) * 100
  const currentWidth = (currentValue / max) * 100

  return (
    <div className="space-y-3">
      <div>
        <div className="mb-1 flex items-center justify-between text-xs">
          <span style={{ color: SOFT }}>Previous</span>
          <span style={{ color: MUTED }}>{formatSmallNumber(previous)}</span>
        </div>
        <div
          className="h-2.5 overflow-hidden rounded-full"
          style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
        >
          <div
            className="h-full rounded-full"
            style={{
              width: `${previousWidth}%`,
              backgroundColor: "rgba(125,162,214,0.7)",
            }}
          />
        </div>
      </div>

      <div>
        <div className="mb-1 flex items-center justify-between text-xs">
          <span style={{ color: SOFT }}>Current</span>
          <span style={{ color: MUTED }}>{formatSmallNumber(current)}</span>
        </div>
        <div
          className="h-2.5 overflow-hidden rounded-full"
          style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
        >
          <div
            className="h-full rounded-full"
            style={{
              width: `${currentWidth}%`,
              background: `linear-gradient(90deg, ${GOLD} 0%, #E6C778 100%)`,
            }}
          />
        </div>
      </div>
    </div>
  )
}

function VerticalBarChart({
  items,
}: {
  items: Array<{
    label: string
    value: number
    tone: "blue" | "gold" | "green"
  }>
}) {
  const max = Math.max(...items.map((item) => item.value), 1)

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {items.map((item) => {
        const height = Math.max((item.value / max) * 140, item.value > 0 ? 18 : 0)
        const background =
          item.tone === "green"
            ? `linear-gradient(180deg, ${GREEN} 0%, #A4D774 100%)`
            : item.tone === "blue"
              ? `linear-gradient(180deg, ${BLUE} 0%, #A9C2E8 100%)`
              : `linear-gradient(180deg, ${GOLD} 0%, #E6C778 100%)`

        return (
          <div
            key={item.label}
            className="rounded-[22px] p-4"
            style={{
              backgroundColor: PANEL_BG_SOFT,
              border: `1px solid ${BORDER}`,
            }}
          >
            <div className="flex h-[170px] items-end">
              <div
                className="w-full rounded-[16px]"
                style={{
                  height,
                  minHeight: item.value > 0 ? 18 : 0,
                  background,
                  boxShadow: "0 10px 24px rgba(0,0,0,0.22)",
                }}
              />
            </div>
            <div className="mt-4 text-sm font-semibold text-white">
              {formatCount(item.value)}
            </div>
            <div className="mt-1 text-sm" style={{ color: MUTED }}>
              {item.label}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function LegendCard({
  label,
  value,
  colour,
}: {
  label: string
  value: string
  colour: string
}) {
  return (
    <div
      className="rounded-2xl px-4 py-4"
      style={{
        backgroundColor: PANEL_BG_SOFT,
        border: `1px solid ${BORDER}`,
      }}
    >
      <div className="flex items-center gap-2">
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: colour }}
        />
        <span
          className="text-[11px] uppercase tracking-[0.14em]"
          style={{ color: SOFT }}
        >
          {label}
        </span>
      </div>
      <div className="mt-3 text-2xl font-semibold text-white">{value}</div>
    </div>
  )
}

function ProgressMetric({
  label,
  value,
  helper,
}: {
  label: string
  value: number
  helper: string
}) {
  const width = Math.max(Math.min(value, 100), value > 0 ? 4 : 0)

  return (
    <div
      className="rounded-2xl px-4 py-4"
      style={{
        backgroundColor: PANEL_BG_SOFT,
        border: `1px solid ${BORDER}`,
      }}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="text-[16px] font-semibold text-white">{label}</div>
        <div className="text-lg font-semibold text-white">
          {formatPercent(value)}
        </div>
      </div>

      <div
        className="mt-3 h-3 overflow-hidden rounded-full"
        style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${width}%`,
            background: `linear-gradient(90deg, ${GOLD} 0%, #E6C778 100%)`,
          }}
        />
      </div>

      <div className="mt-2 text-sm" style={{ color: MUTED }}>
        {helper}
      </div>
    </div>
  )
}

function trendColour(
  direction: "up" | "down" | "flat",
  current?: number,
  previous?: number
) {
  if (
    current !== undefined &&
    previous !== undefined &&
    isLowSample(current, previous)
  ) {
    return "#9FBDE3"
  }

  if (direction === "up") return "#86C65C"
  if (direction === "down") return "#E27C7C"
  return "rgba(255,255,255,0.45)"
}

function trendArrow(
  direction: "up" | "down" | "flat",
  current?: number,
  previous?: number
) {
  if (
    current !== undefined &&
    previous !== undefined &&
    isLowSample(current, previous)
  ) {
    return "•"
  }

  if (direction === "up") return "▲"
  if (direction === "down") return "▼"
  return "•"
}

function safePercent(value: number, total: number) {
  if (!total) return 0
  return (value / total) * 100
}

function getFunnelWidth(value: number, total: number) {
  if (!total || value <= 0) return 0
  return Math.max((value / total) * 100, 6)
}

function getDataConfidence(visits: number): {
  label: string
  tone: "low" | "medium" | "high"
} {
  if (visits >= 150) return { label: "Confidence High", tone: "high" }
  if (visits >= 50) return { label: "Confidence Medium", tone: "medium" }
  return { label: "Confidence Early", tone: "low" }
}

function getScoreTone(score: number): "weak" | "fair" | "strong" {
  if (score >= 75) return "strong"
  if (score >= 50) return "fair"
  return "weak"
}

function getScoreLabel(score: number) {
  if (score >= 80) return "Excellent"
  if (score >= 60) return "Strong"
  if (score >= 40) return "Developing"
  return "Building"
}

function getScoreBand(score: number) {
  if (score >= 80) return "Top band"
  if (score >= 60) return "Healthy band"
  if (score >= 40) return "Developing band"
  return "Building band"
}

function getScoreDescriptor(score: number) {
  if (score >= 80) return "Very strong current performance"
  if (score >= 60) return "Healthy commercial performance"
  if (score >= 40) return "Commercial performance building steadily"
  return "Early signal, building momentum"
}

function toBulletTone(
  tone?: "good" | "warning" | "neutral"
): "good" | "warning" | "neutral" {
  return tone ?? "neutral"
}

function getPrimaryInsight(
  insights: RestaurantInsight[],
  health: { status: string; summary: string }
) {
  const priorityWarning =
    insights.find((insight) => insight.tone === "warning") ?? insights[0]

  if (priorityWarning) return priorityWarning

  return {
    title: health.status,
    body: health.summary,
    tone: "neutral" as const,
  }
}

function getSupportingInsight(
  insights: RestaurantInsight[],
  primaryInsight?: RestaurantInsight
) {
  return insights.find(
    (insight) =>
      insight.title !== primaryInsight?.title && insight.tone !== "good"
  )
}

function getPositiveInsight(
  insights: RestaurantInsight[],
  primaryInsight?: RestaurantInsight,
  supportingInsight?: RestaurantInsight
) {
  return insights.find(
    (insight) =>
      insight.title !== primaryInsight?.title &&
      insight.title !== supportingInsight?.title &&
      insight.tone === "good"
  )
}

function buildExecutiveSummary({
  healthSummary,
  primaryInsight,
  supportingInsight,
}: {
  healthSummary: string
  primaryInsight?: RestaurantInsight
  supportingInsight?: RestaurantInsight
}) {
  if (primaryInsight?.body && supportingInsight?.body) {
    return `${primaryInsight.body} ${supportingInsight.body}`
  }

  if (primaryInsight?.body) {
    return primaryInsight.body
  }

  return healthSummary
}

function softenInsightTitle(title: string) {
  const map: Record<string, string> = {
    "Menu reach is low": "Menu discovery opportunity identified",
    "Menu discovery is weak": "Menu can be surfaced earlier",
    "Too few guests reach the contact section":
      "Contact actions can capture more guests",
    "Scroll depth is shallow": "There is room to improve page progression",
    "Contact is outperforming booking":
      "Guests are choosing direct contact over booking",
    "Menu interest is not converting":
      "Menu interest can convert more strongly",
    "Conversion performance needs attention":
      "Next conversion opportunity identified",
    "Visual proof is underused": "Visual content can work harder",
    "Some guests are reaching deep content":
      "Some guests are exploring deeper content",
    "Some guests are reaching deep page content":
      "Some guests are exploring deeper content",
  }

  return map[title] ?? title
}

function softenExecutiveSummary(text: string) {
  return text
    .replaceAll(
      "not yet converting strongly enough",
      "not yet capturing as much conversion as it could"
    )
    .replaceAll("too far down the page", "later in the page journey")
    .replaceAll("weak", "underpowered")
    .replaceAll(
      "Guests may not be discovering",
      "There is an opportunity to help guests discover"
    )
    .replaceAll(
      "The lower page journey is not getting enough visibility.",
      "The lower page journey has room for stronger visibility."
    )
    .replaceAll(
      "Important contact actions may be sitting too far down the page for many visitors.",
      "Important contact actions could be surfaced earlier for more visitors."
    )
}

function isLowSample(current: number, previous: number) {
  return previous < 8 || current < 8
}

function formatTrendMessage(
  current: number,
  previous: number,
  trend: TrendData
) {
  if (previous === 0 && current === 0) return "No change"
  if (previous === 0 && current > 0) {
    return `New activity (${formatCount(current)})`
  }

  if (isLowSample(current, previous)) {
    const diff = current - previous
    if (Math.abs(diff) < 0.005) return "Early signal stable"
    return `${diff > 0 ? "+" : ""}${formatReadableDelta(diff)} vs previous period`
  }

  if (trend.direction === "flat") return "Stable"

  return `${trendArrow(trend.direction)} ${formatPercentChange(Math.abs(trend.deltaPercent))}`
}

function formatTrendHeadline(
  current: number,
  previous: number,
  trend: TrendData
) {
  if (previous === 0 && current === 0) return "No change"
  if (previous === 0 && current > 0) return `New activity (${formatCount(current)})`
  if (isLowSample(current, previous)) {
    return `${formatCount(previous)} → ${formatCount(current)}`
  }
  if (trend.direction === "flat") return "Stable"

  return `${formatPercentChange(Math.abs(trend.deltaPercent))}`
}

function formatTrendSubline(current: number, previous: number) {
  if (isLowSample(current, previous)) {
    return `Count-based read • Previous period ${formatCount(previous)} • Current period ${formatCount(current)}`
  }

  return `Previous period ${formatCount(previous)} • Current period ${formatCount(current)}`
}

function estimatePreviousCountFromRate(current: number, trend: TrendData) {
  if (trend.delta === 0) return current

  const estimated = current - trend.delta
  return estimated < 0 ? 0 : estimated
}

function getStrongestStageLabel(kpis: KpiDashboardProps["kpis"]) {
  const candidates = [
    { label: "Visit → menu", value: kpis.menuInterestRate },
    { label: "Menu → booking", value: kpis.menuToBookingRate },
    { label: "Visit → booking", value: kpis.bookingIntentRate },
  ].sort((a, b) => b.value - a.value)

  return candidates[0]?.label ?? "No stage yet"
}

function getJourneyRead(
  kpis: KpiDashboardProps["kpis"],
  guestJourney: KpiDashboardProps["summary"]["guestJourney"]
) {
  if (guestJourney.visits === 0) {
    return "Once traffic starts landing, TablePilot will identify where the journey is strongest."
  }

  if (kpis.menuInterestRate >= 40 && kpis.menuToBookingRate >= 15) {
    return "Guests are progressing well from discovery into action, with both menu reach and booking follow-through showing healthy movement."
  }

  if (kpis.menuInterestRate >= 40) {
    return "Initial interest is healthy. The next commercial opportunity is converting more of that menu attention into bookings."
  }

  if (kpis.menuInterestRate < 40) {
    return "The earliest opportunity is increasing menu discovery so more visitors reach the strongest commercial content sooner."
  }

  return "The guest journey is building steadily, with room to increase movement into higher-intent actions."
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

function formatPercent(value: number) {
  return `${trimDecimals(value, 2)}%`
}

function formatPercentChange(value: number) {
  return `${trimDecimals(value, 2)}%`
}

function formatReadableDelta(value: number) {
  return trimDecimals(value, 2)
}

function trimDecimals(value: number, decimals: number) {
  return value
    .toFixed(decimals)
    .replace(/\.00$/, "")
    .replace(/(\.\d)0$/, "$1")
}