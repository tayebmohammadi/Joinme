import { useNavigation } from '../../context/NavigationContext'
import { PAGES } from '../../utils/constants'
import { JoinmeEmblem } from '../branding/JoinmeWordmark'
import DartmouthGoogleAuthCard from '../auth/DartmouthGoogleAuthCard'

export default function PublicCloudHome() {
  const { navigate } = useNavigation()

  return (
    <div className="relative z-10 grid lg:grid-cols-[1.08fr,min(26rem,100%)] gap-14 lg:gap-20 items-center lg:min-h-[min(88vh,52rem)] animate-fade-in">
      <div className="order-2 lg:order-1 space-y-8 lg:pr-4">
        <div className="flex items-center gap-3">
          <JoinmeEmblem className="h-12 w-12 sm:h-14 sm:w-14 shadow-ring" />
          <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-warm-gray-500">
            Dartmouth
          </span>
        </div>

        <div>
          <h1 className="font-serif text-[2.65rem] sm:text-6xl lg:text-[4rem] text-bark leading-[0.92] tracking-tight">
            Find your people
            <span className="block mt-1 text-forest font-serif italic font-black text-[0.92em]">
              under open sky
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-warm-gray-600 font-medium leading-relaxed max-w-xl">
            Study circles, outings, club nights—quietly organized for campus. Sign in with your Dartmouth Google to browse and host.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate(PAGES.EVENTS)}
          className="group inline-flex items-center gap-2 text-sm font-semibold text-forest hover:text-bark transition-colors"
        >
          <span className="border-b border-forest/30 group-hover:border-bark/40 pb-0.5">
            Peek at the campus events teaser
          </span>
          <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
        </button>
      </div>

      <div className="order-1 lg:order-2 w-full lg:sticky lg:top-28">
        <DartmouthGoogleAuthCard />
      </div>
    </div>
  )
}
