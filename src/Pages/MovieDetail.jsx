import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  getMovieById,
  getMovieCredits,
  getSimilarMovies,
  getRecommendedMovies,
} from '../api/tmdb'
import CastCard from '../components/CastCard'
import RelatedCard from '../components/RelatedCard'
import Loader from '../components/Loader'
import '../styles/Detail.css'

const IMG_BACKDROP = 'https://image.tmdb.org/t/p/w1280'
const IMG_POSTER   = 'https://image.tmdb.org/t/p/w400'

function MovieDetail() {
  const { id } = useParams()
  const [movie,    setMovie]    = useState(null)
  const [cast,     setCast]     = useState([])
  const [similar,  setSimilar]  = useState([])
  const [recommended, setRecommended] = useState([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    setLoading(true)
    window.scrollTo(0, 0)
    Promise.all([
      getMovieById(id),
      getMovieCredits(id),
      getSimilarMovies(id),
      getRecommendedMovies(id),
    ]).then(([movieRes, creditsRes, similarRes, recRes]) => {
      setMovie(movieRes.data)
      setCast(creditsRes.data.cast.slice(0, 12))
      setSimilar(similarRes.data.results.slice(0, 12))
      setRecommended(recRes.data.results.slice(0, 12))
    }).finally(() => setLoading(false))
  }, [id])

  if (loading) return <Loader />
  if (!movie)  return <p className="error-msg">No se encontró la película.</p>

  const genres  = movie.genres?.map(g => g.name).join(', ')
  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : 'N/D'

  return (
    <div className="detail-page">

      {/* Backdrop */}
      {movie.backdrop_path && (
        <div className="detail-backdrop">
          <img src={`${IMG_BACKDROP}${movie.backdrop_path}`} alt="" aria-hidden="true" />
          <div className="backdrop-overlay" />
        </div>
      )}

      {/* Info principal */}
      <div className="detail-main">
        <div className="detail-poster">
          {movie.poster_path
            ? <img src={`${IMG_POSTER}${movie.poster_path}`} alt={movie.title} />
            : <div className="detail-noimg">?</div>
          }
        </div>

        <div className="detail-info">
          <h1 className="detail-title">{movie.title}</h1>
          {movie.tagline && <p className="detail-tagline">"{movie.tagline}"</p>}

          <div className="detail-badges">
            {movie.vote_average > 0 && (
              <span className="dbadge green">⭐ {movie.vote_average.toFixed(1)}</span>
            )}
            <span className="dbadge gray">{movie.release_date?.slice(0, 4)}</span>
            <span className="dbadge gray">{runtime}</span>
            {movie.status && <span className="dbadge blue">{movie.status}</span>}
          </div>

          {genres && <p className="detail-genres">{genres}</p>}

          <div className="detail-section">
            <h2>Sinopsis</h2>
            <p>{movie.overview || 'Sin descripción disponible.'}</p>
          </div>

          <div className="detail-stats">
            {movie.budget > 0 && (
              <div className="stat">
                <span className="stat-label">Presupuesto</span>
                <span className="stat-value">${movie.budget.toLocaleString()}</span>
              </div>
            )}
            {movie.revenue > 0 && (
              <div className="stat">
                <span className="stat-label">Recaudación</span>
                <span className="stat-value">${movie.revenue.toLocaleString()}</span>
              </div>
            )}
            {movie.original_language && (
              <div className="stat">
                <span className="stat-label">Idioma original</span>
                <span className="stat-value">{movie.original_language.toUpperCase()}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reparto */}
      {cast.length > 0 && (
        <section className="detail-section">
          <h2>Reparto principal</h2>
          <div className="cast-scroll">
            {cast.map(p => <CastCard key={p.id} person={p} />)}
          </div>
        </section>
      )}

      {/* Recomendadas */}
      {recommended.length > 0 && (
        <section className="detail-section">
          <h2>Recomendadas para ti</h2>
          <div className="related-scroll">
            {recommended.map(m => <RelatedCard key={m.id} item={m} type="movie" />)}
          </div>
        </section>
      )}

      {/* Similares */}
      {similar.length > 0 && (
        <section className="detail-section">
          <h2>Películas similares</h2>
          <div className="related-scroll">
            {similar.map(m => <RelatedCard key={m.id} item={m} type="movie" />)}
          </div>
        </section>
      )}

    </div>
  )
}

export default MovieDetail