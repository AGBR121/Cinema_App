import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  getTrending,
  getPopularMovies,
  getPopularTvShows,
} from '../api/tmdb'
import Loader from '../components/Loader'
import '../styles/Home.css'

const IMAGE_BASE = 'https://image.tmdb.org/t/p/w300'

function HorizontalCard({ item, type }) {
  const title = item.title || item.name
  const year  = (item.release_date || item.first_air_date || '').slice(0, 4)
  const path  = type === 'movie' ? `/movies/${item.id}` : `/tv/${item.id}`

  return (
    <Link to={path} className="h-card">
      <div className="h-card-poster">
        {item.poster_path
          ? <img src={`${IMAGE_BASE}${item.poster_path}`} alt={title} loading="lazy" />
          : <span className="h-card-noimg">?</span>
        }
      </div>
      <div className="h-card-body">
        <p className="h-card-title">{title}</p>
        <p className="h-card-meta">
          {item.vote_average ? `⭐ ${item.vote_average.toFixed(1)}  ` : ''}
          {year}
        </p>
      </div>
    </Link>
  )
}

function Section({ title, items, type, linkTo }) {
  return (
    <section className="home-section">
      <div className="section-header">
        <h2>{title}</h2>
        <Link to={linkTo} className="see-all">Ver todo →</Link>
      </div>
      <div className="scroll-row">
        {items.map(item => (
          <HorizontalCard
            key={item.id}
            item={item}
            type={item.media_type || type}
          />
        ))}
      </div>
    </section>
  )
}

function Home() {
  const [trending, setTrending] = useState([])
  const [movies,   setMovies]   = useState([])
  const [tvShows,  setTvShows]  = useState([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    Promise.all([
      getTrending(),
      getPopularMovies(),
      getPopularTvShows(),
    ])
      .then(([trendRes, movieRes, tvRes]) => {
        setTrending(trendRes.data.results.slice(0, 10))
        setMovies(movieRes.data.results.slice(0, 10))
        setTvShows(tvRes.data.results.slice(0, 10))
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loader />

  return (
    <div className="home">

      {/* Hero */}
      <div className="hero">
        <h1>Bienvenido a StreamDB</h1>
        <p>Explora películas, series y personas del mundo del entretenimiento.</p>
        <div className="hero-actions">
          <Link to="/movies" className="btn-primary">Ver películas</Link>
          <Link to="/tv"     className="btn-outline">Ver series</Link>
        </div>
      </div>

      <Section
        title="Tendencias hoy"
        items={trending}
        type="movie"
        linkTo="/movies"
      />
      <Section
        title="Películas populares"
        items={movies}
        type="movie"
        linkTo="/movies"
      />
      <Section
        title="Series populares"
        items={tvShows}
        type="tv"
        linkTo="/tv"
      />

    </div>
  )
}

export default Home