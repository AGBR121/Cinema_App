import { Routes, Route } from 'react-router-dom'

import Header from './Components/header'

import Home         from './Pages/home'
import Movies       from './Pages/movies'
import MovieDetail  from './Pages/MovieDetail'
import TvShows      from './Pages/TvShows'
import TvDetail     from './Pages/TvDetail'
import People       from './Pages/People'
import PersonDetail from './Pages/PersonDetail'
import Search       from './Pages/Search'
import NotFound     from './Pages/NotFound'

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