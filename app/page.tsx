import Roulette from '@/components/Roulette'
import AdminMenu from '@/components/AdminMenu'
import EnvSwitcher from '@/components/EnvSwitcher'

export default function Home() {
  return (
    <main>
      <AdminMenu />
      <EnvSwitcher />
      <Roulette />
    </main>
  )
}
