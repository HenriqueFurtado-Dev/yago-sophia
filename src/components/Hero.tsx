import type { Settings } from '../types'

interface HeroProps {
  settings: Settings
}

const POLAROIDS = [
  { src: '/image1.jpeg', cls: 'polaroid-1', label: 'foto 1' },
  { src: '/image2.jpeg', cls: 'polaroid-2', label: 'foto 2' },
  { src: '/image3.jpeg', cls: 'polaroid-3', label: 'foto 3' },
]

export function Hero({ settings }: HeroProps) {
  const date = new Date(settings.data + 'T12:00:00')
  const formattedDate = date.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden px-5 py-16"
      id="top"
    >
      {/* Gradient background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 50% 0%, rgba(168,196,171,0.18) 0%, transparent 70%),
            radial-gradient(ellipse 60% 40% at 80% 100%, rgba(184,150,90,0.12) 0%, transparent 60%),
            radial-gradient(ellipse 50% 50% at 10% 60%, rgba(184,150,90,0.08) 0%, transparent 60%)
          `,
        }}
      />

      {/* Ornament circles — hidden on very small screens */}
      <div className="hidden sm:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-gold/[0.12] pointer-events-none" />
      <div className="hidden sm:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] rounded-full border border-gold/[0.07] pointer-events-none" />
      <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[940px] h-[940px] rounded-full border border-gold/[0.04] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-xl mx-auto">
        <p className="font-jost font-light text-[11px] tracking-[0.35em] uppercase text-gold mb-5">
          {formattedDate}
        </p>

        {/* Divider */}
        <div className="flex items-center gap-4 mx-auto mb-6 w-[200px] sm:w-[280px]">
          <span className="flex-1 h-px bg-gradient-to-r from-transparent via-gold-light to-transparent" />
          <span className="text-gold text-sm">✦</span>
          <span className="flex-1 h-px bg-gradient-to-r from-transparent via-gold-light to-transparent" />
        </div>

        <h1
          className="font-playfair font-normal leading-[1.05] text-brown tracking-[-0.01em] mb-3"
          style={{ fontSize: 'clamp(44px, 12vw, 88px)' }}
        >
          <em className="italic text-gold">{settings.nome1}</em>
          {' & '}
          <em className="italic text-gold">{settings.nome2}</em>
        </h1>

        <p className="font-cormorant text-lg sm:text-xl font-light italic text-muted mb-10 px-2">
          {settings.frase}
        </p>

        {/* Polaroid photos */}
        <div className="flex items-end justify-center gap-3 sm:gap-5 mb-10 px-2">
          {POLAROIDS.map(({ src, cls, label }) => (
            <div
              key={label}
              className={`${cls} bg-white p-2 pb-8 shadow-[0_8px_32px_rgba(92,74,50,0.18)] shrink-0`}
              style={{ width: 'clamp(110px, 30vw, 180px)' }}
            >
              <div
                className="w-full overflow-hidden bg-cream2"
                style={{ aspectRatio: '1 / 1' }}
              >
                <img
                  src={src}
                  alt={label}
                  className="w-full h-full object-cover"
                  onError={e => {
                    const t = e.currentTarget
                    t.style.display = 'none'
                    const parent = t.parentElement
                    if (parent) {
                      parent.style.display = 'flex'
                      parent.style.alignItems = 'center'
                      parent.style.justifyContent = 'center'
                      parent.style.fontSize = '2rem'
                      parent.textContent = '💛'
                    }
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Scroll CTA */}
        <a
          href="#lista"
          className="inline-flex flex-col items-center gap-2.5 text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-muted no-underline animate-float"
        >
          <svg
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            className="opacity-50"
          >
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
          Ver lista de presentes
        </a>
      </div>
    </section>
  )
}
