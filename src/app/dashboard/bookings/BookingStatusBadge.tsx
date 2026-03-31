type BookingStatusBadgeProps = {
  status: string
}

const STATUS_STYLES: Record<
  string,
  {
    label: string
    className: string
  }
> = {
  pending: {
    label: "Pending",
    className:
      "border border-[#C9A24A]/35 bg-[#C9A24A]/14 text-[#F3D78A]",
  },
  confirmed: {
    label: "Confirmed",
    className:
      "border border-emerald-400/30 bg-emerald-400/12 text-emerald-200",
  },
  declined: {
    label: "Declined",
    className:
      "border border-rose-400/30 bg-rose-400/12 text-rose-200",
  },
  cancelled: {
    label: "Cancelled",
    className:
      "border border-white/15 bg-white/8 text-white/70",
  },
  arrived: {
    label: "Arrived",
    className:
      "border border-sky-400/30 bg-sky-400/12 text-sky-200",
  },
  seated: {
    label: "Seated",
    className:
      "border border-indigo-400/30 bg-indigo-400/12 text-indigo-200",
  },
  completed: {
    label: "Completed",
    className:
      "border border-emerald-500/30 bg-emerald-500/12 text-emerald-100",
  },
  no_show: {
    label: "No Show",
    className:
      "border border-amber-400/30 bg-amber-400/12 text-amber-100",
  },
}

export default function BookingStatusBadge({
  status,
}: BookingStatusBadgeProps) {
  const config = STATUS_STYLES[status] ?? {
    label: status,
    className: "border border-white/15 bg-white/8 text-white/70",
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${config.className}`}
    >
      {config.label}
    </span>
  )
}