'use client'

import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <section className="container grid lg:grid-cols-2 place-items-center py-20 md:py-32 gap-10">
      <div className="text-center lg:text-start space-y-6">
        <main className="text-5xl md:text-6xl font-bold">
          <h1 className="inline">
            Collaborate{" "}
            <span className="inline bg-gradient-to-r from-[#F596D3] to-[#D247BF] text-transparent bg-clip-text">
              Smarter
            </span>{" "}
          </h1>{" "}
          <h2 className="inline">
            <span className="inline bg-gradient-to-r from-[#61DAFB] via-[#1fc0f1] to-[#03a3d7] text-transparent bg-clip-text">
              Build Faster
            </span>{" "}
          </h2>
        </main>

        <p className="text-xl text-muted-foreground md:w-10/12 mx-auto lg:mx-0">
          SAIDIDSpace est la plateforme moderne de gestion de projets qui booste la productivité de votre équipe avec des outils de collaboration en temps réel.
        </p>

        <div className="space-y-4 md:space-y-0 md:space-x-4 md:flex">
          <Button className="w-full md:w-1/3">Get Started</Button>
          <Button
            variant="outline"
            className="w-full md:w-1/3"
          >
            View Demo
          </Button>
        </div>
      </div>

      {/* Hero Image */}
      <div className="z-10">
        <div className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg p-8">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-background rounded-lg p-4 shadow-lg">
              <div className="h-3 bg-primary/50 rounded mb-2"></div>
              <div className="h-2 bg-muted rounded mb-2"></div>
              <div className="h-2 bg-muted rounded"></div>
            </div>
            <div className="bg-background rounded-lg p-4 shadow-lg">
              <div className="h-3 bg-secondary/50 rounded mb-2"></div>
              <div className="h-2 bg-muted rounded mb-2"></div>
              <div className="h-2 bg-muted rounded"></div>
            </div>
            <div className="bg-background rounded-lg p-4 shadow-lg">
              <div className="h-3 bg-accent/50 rounded mb-2"></div>
              <div className="h-2 bg-muted rounded mb-2"></div>
              <div className="h-2 bg-muted rounded"></div>
            </div>
            <div className="bg-background rounded-lg p-4 shadow-lg">
              <div className="h-3 bg-destructive/50 rounded mb-2"></div>
              <div className="h-2 bg-muted rounded mb-2"></div>
              <div className="h-2 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
