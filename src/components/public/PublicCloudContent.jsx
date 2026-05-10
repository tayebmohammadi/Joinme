import { useNavigation } from '../../context/NavigationContext'
import { PAGES } from '../../utils/constants'
import { focusDartmouthSignIn } from '../../utils/focusDartmouthSignIn'
import DartmouthGoogleAuthCard from '../auth/DartmouthGoogleAuthCard'
import EventFeed from '../events/EventFeed'
import PublicCloudHome from './PublicCloudHome'

export default function PublicCloudContent() {
  const { page } = useNavigation()

  switch (page) {
    case PAGES.EVENTS:
      return (
        <div className="max-w-4xl mx-auto space-y-10 animate-fade-in">
          <div className="rounded-3xl border border-warm-gray-200/70 bg-white/70 px-6 py-8 sm:px-10">
            <h2 className="font-serif text-3xl text-bark mb-2">Campus happenings</h2>
            <p className="text-sm text-warm-gray-700 leading-relaxed max-w-xl">
              A lightweight snapshot of gatherings around Hanover—no attendee lists here. The{' '}
              <strong className="text-bark">Dartmouth Google</strong> sign-in below matches Discover: same warm page, same{' '}
              <strong className="text-bark">@dartmouth.edu</strong> requirement.
            </p>
            <button
              type="button"
              onClick={focusDartmouthSignIn}
              className="mt-5 text-sm font-semibold text-forest hover:text-bark border-b border-forest/35 hover:border-bark/40 pb-0.5 transition-colors"
            >
              Jump to Dartmouth sign-in
            </button>
          </div>
          <DartmouthGoogleAuthCard />
          <EventFeed />
        </div>
      )
    default:
      return <PublicCloudHome />
  }
}
