import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <main className="flex min-h-[60svh] items-center justify-center">
      <Loader2 className="text-muted-foreground size-8 animate-spin" />
    </main>
  )
}
