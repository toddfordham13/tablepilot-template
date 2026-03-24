import type { ReactNode } from "react"

type Props = {
  children: ReactNode
}

export default function ConceptLayout({ children }: Props) {
  return <>{children}</>
}