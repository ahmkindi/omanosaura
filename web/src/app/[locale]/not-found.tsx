import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <main className="flex min-h-[60svh] flex-col items-center justify-center gap-6 px-4 text-center">
      <Image src="/404.svg" alt="404" width={280} height={200} />
      <Button asChild>
        <Link href="/">Omanosaura</Link>
      </Button>
    </main>
  )
}
