import './App.css'
import { isCloudEnabled } from './lib/cloud'
import { useAuth } from './context/AuthContext'
import { useNavigation } from './context/NavigationContext'
import { PAGES } from './utils/constants'
import AuthPage from './components/auth/AuthPage'
import AppShell from './components/layout/AppShell'
import GroupList from './components/groups/GroupList'
import GroupForm from './components/groups/GroupForm'
import GroupDetail from './components/groups/GroupDetail'
import ProfilePage from './components/profile/ProfilePage'
import EventFeed from './components/events/EventFeed'
import { ToastProvider } from './components/shared/Toast'
import PublicCloudShell from './components/layout/PublicCloudShell'
import PublicCloudContent from './components/public/PublicCloudContent'

function ProtectedAppContent() {
  const { page, params } = useNavigation()

  switch (page) {
    case PAGES.BROWSE:
      return <GroupList />
    case PAGES.CREATE_GROUP:
      return <GroupForm />
    case PAGES.GROUP_DETAIL:
      return <GroupDetail groupId={params.groupId} />
    case PAGES.PROFILE:
      return <ProfilePage />
    case PAGES.EVENTS:
      return <EventFeed />
    default:
      return <GroupList />
  }
}

export default function App() {
  const { currentUser, cloudAuthBusy } = useAuth()

  const dartmouthGateOpen = Boolean(currentUser && currentUser.verified !== false)

  if (cloudAuthBusy) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-2 bg-[#fdfbf7] px-6">
        <div className="h-9 w-9 rounded-full border-2 border-ember/30 border-t-ember animate-spin" aria-hidden />
        <p className="text-sm text-warm-gray-600 font-medium">Checking your Dartmouth session…</p>
      </div>
    )
  }

  if (!dartmouthGateOpen && !isCloudEnabled) {
    return (
      <ToastProvider>
        <AuthPage />
      </ToastProvider>
    )
  }

  if (!dartmouthGateOpen && isCloudEnabled) {
    return (
      <ToastProvider>
        <PublicCloudShell>
          <PublicCloudContent />
        </PublicCloudShell>
      </ToastProvider>
    )
  }

  return (
    <ToastProvider>
      <AppShell>
        <ProtectedAppContent />
      </AppShell>
    </ToastProvider>
  )
}
