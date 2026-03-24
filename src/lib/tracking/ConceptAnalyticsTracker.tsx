"use client"

import { useEffect, useRef } from "react"
import { trackEvent } from "@/lib/tracking/trackEvent"

type ConceptAnalyticsTrackerProps = {
  concept: string
}

const SCROLL_MARKERS = [25, 50, 75, 100] as const

export default function ConceptAnalyticsTracker({
  concept,
}: ConceptAnalyticsTrackerProps) {
  const sentScrollMilestones = useRef<Set<number>>(new Set())

  useEffect(() => {
    trackEvent({
      event: "page_view",
      concept,
      metadata: {
        title: document.title,
      },
    })
  }, [concept])

  useEffect(() => {
    function handleScroll() {
      const scrollTop = window.scrollY
      const viewportHeight = window.innerHeight
      const fullHeight = document.documentElement.scrollHeight

      const maxScrollable = fullHeight - viewportHeight
      if (maxScrollable <= 0) return

      const percent = Math.round((scrollTop / maxScrollable) * 100)

      for (const marker of SCROLL_MARKERS) {
        if (percent >= marker && !sentScrollMilestones.current.has(marker)) {
          sentScrollMilestones.current.add(marker)

          trackEvent({
            event: "scroll_depth",
            concept,
            metadata: {
              percent: marker,
            },
          })
        }
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [concept])

  return null
}