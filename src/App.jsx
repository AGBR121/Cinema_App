import { Routes, Route } from 'react-router-dom'

import Header from './components/Header'

import Home         from './pages/home'
import Movies       from './pages/movies'
import MovieDetail  from './pages/MovieDetail'
import TvShows      from './pages/TvShows'
import TvDetail     from './pages/TvDetail'
import People       from './pages/People'
import PersonDetail from './pages/PersonDetail'
import Search       from './pages/Search'
import NotFound     from './pages/NotFound'

function App() {
  return (
    <>
      <Header />

      <main className="main-content">
        <Routes>
          {/* Inicio */}
          <Route path="/"  element={<Home />} />

          {/* Películas */}
          <Route path="/movies"     element={<Movies />}      />
          <Route path="/movies/:id" element={<MovieDetail />} />

          {/* Series */}
          <Route path="/tv"     element={<TvShows />}   />
          <Route path="/tv/:id" element={<TvDetail />}  />

          {/* Personas */}
          <Route path="/people"     element={<People />}       />
          <Route path="/people/:id" element={<PersonDetail />} />

          {/* Búsqueda */}
          <Route path="/search" element={<Search />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  )
}

export default App