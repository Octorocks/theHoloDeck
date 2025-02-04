import { Environment } from '@/components/3d/Environment'

export default function Home() {
  return (
    <div className="w-full h-screen overflow-hidden bg-black">
      <Environment />
      
      <div className="fixed top-4 left-4 z-10">
        <h1 className="text-2xl font-bold text-primary">3D Portfolio</h1>
        <p className="text-sm text-muted-foreground">
          Navigate using mouse/touch controls
        </p>
      </div>
    </div>
  )
}
