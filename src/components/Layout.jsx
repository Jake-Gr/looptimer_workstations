import TopNav from './TopNav'
import LeftNav from './LeftNav'
import Dashboard from './screens/Dashboard'
import Intent from './screens/Intent'
import Session from './screens/Session'
import Transition from './screens/Transition'
import Close from './screens/Close'

export default function Layout() {
  return (
    <div className="app">
      <TopNav />
      <LeftNav />
      <main className="main">
        <Dashboard />
        <Intent />
        <Session />
        <Transition />
        <Close />
      </main>
    </div>
  )
}
