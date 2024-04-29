import './App.css'
import AppRouter from '@/router/index.jsx'
import TheNavbar from '@/components/TheNavbar.jsx'

function App() {
  return ( // cant use StrictMode, because of Material-UI
    <div className="App">
      <TheNavbar />
      <AppRouter />
    </div>
  )
}

export default App
