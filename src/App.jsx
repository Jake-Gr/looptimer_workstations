import { AppProvider } from './context/AppContext'
import Layout from './components/Layout'
import MiniTimer from './components/MiniTimer'

const isMini = new URLSearchParams(window.location.search).has('mini')

export default function App() {
  return (
    <AppProvider>
      {isMini ? <MiniTimer /> : <Layout />}
    </AppProvider>
  )
}
