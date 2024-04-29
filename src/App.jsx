import './App.css'
import AppRouter from '@/router'
import TheNavbar from '@/components/TheNavbar.jsx'

function App() {
  return (
    <div className="App">
      <TheNavbar />
      <AppRouter />
    </div>
  )
}

export default App
