import type { ReactNode } from 'react'

// The actual <html>/<body> shell lives in [locale]/layout.tsx so the lang and
// dir attributes can depend on the active locale.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children
}
