import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { NavigationProvider } from './context/NavigationContext'
import { AuthProvider } from './context/AuthContext'
import { GroupsProvider } from './context/GroupsContext'
import { seedIfEmpty } from './utils/seedData'

seedIfEmpty()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <NavigationProvider>
        <GroupsProvider>
          <App />
        </GroupsProvider>
      </NavigationProvider>
    </AuthProvider>
  </StrictMode>,
)
