import { Routes, Route, Link } from 'react-router-dom'
import Home from './Pages/Home'
//import MovieDetail from './Pages/MovieDetail'

function App() {
  return (
    <>
      <nav>
        <Link to="/">Inicio</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/movie/:id" element={<MovieDetail />} /> */}
      </Routes>
    </>
  )
}

export default App