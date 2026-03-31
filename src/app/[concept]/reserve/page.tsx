import ReserveBookingClient from "./reserve-booking-client"

export default async function ReservePage({
  params,
}: {
  params: Promise<{ concept: string }>
}) {
  const { concept } = await params

  return <ReserveBookingClient concept={concept} />
}