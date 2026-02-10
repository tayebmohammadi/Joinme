import './App.css'
import { useAuth } from './context/AuthContext'
import { useNavigation } from './context/NavigationContext'
import { PAGES } from './utils/constants'
import AuthPage from './components/auth/AuthPage'
import AppShell from './components/layout/AppShell'
import GroupList from './components/groups/GroupList'
import GroupForm from './components/groups/GroupForm'
import GroupDetail from './components/groups/GroupDetail'
import ProfilePage from './components/profile/ProfilePage'

function AppContent() {
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
    default:
      return <GroupList />
  }
}

export default function App() {
  const { currentUser } = useAuth()

  if (!currentUser || currentUser.verified === false) {
    return <AuthPage />
  }

  return (
    <AppShell>
      <AppContent />
    </AppShell>
  )
}
