import './App.css'
import TheNavbar from '@/components/TheNavbar.jsx'

function App() {
  return ( // cant use StrictMode, because of Material-UI
    <div className="App">
      <TheNavbar />
    </div>
  )
}

export default App
