import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  getTvShowById,
  getTvCredits,
  getSimilarTvShows,
  getRecommendedTvShows,
} from '../api/tmdb'
import CastCard from '../Components/CastCard'
import RelatedCard from '../Components/RelatedCard'
import Loader from '../Components/Loader'
import '../styles/Detail.css'

const IMG_BACKDROP = 'https://image.tmdb.org/t/p/w1280'
const IMG_POSTER   = 'https://image.tmdb.org/t/p/w400'

function TvDetail() {
  const { id } = useParams()
  const [show,        setShow]        = useState(null)
  const [cast,        setCast]        = useState([])
  const [similar,     setSimilar]     = useState([])
  const [recommended, setRecommended] = useState([])
  const [loading,     setLoading]     = useState(true)

  useEffect(() => {
    setLoading(true)
    window.scrollTo(0, 0)
    Promise.all([
      getTvShowById(id),
      getTvCredits(id),
      getSimilarTvShows(id),
      getRecommendedTvShows(id),
    ]).then(([showRes, creditsRes, similarRes, recRes]) => {
      setShow(showRes.data)
      setCast(creditsRes.data.cast.slice(0, 12))
      setSimilar(similarRes.data.results.slice(0, 12))
      setRecommended(recRes.data.results.slice(0, 12))
    }).finally(() => setLoading(false))
  }, [id])

  if (loading) return <Loader />
  if (!show)   return <p className="error-msg">No se encontró la serie.</p>

  const genres   = show.genres?.map(g => g.name).join(', ')
  const seasons  = show.number_of_seasons
  const episodes = show.number_of_episodes

  return (
    <div className="detail-page">

      {show.backdrop_path && (
        <div className="detail-backdrop">
          <img src={`${IMG_BACKDROP}${show.backdrop_path}`} alt="" aria-hidden="true" />
          <div className="backdrop-overlay" />
        </div>
      )}

      <div className="detail-main">
        <div className="detail-poster">
          {show.poster_path
            ? <img src={`${IMG_POSTER}${show.poster_path}`} alt={show.name} />
            : <div className="detail-noimg">?</div>
          }
        </div>

        <div className="detail-info">
          <h1 className="detail-title">{show.name}</h1>
          {show.tagline && <p className="detail-tagline">"{show.tagline}"</p>}

          <div className="detail-badges">
            {show.vote_average > 0 && (
              <span className="dbadge green">⭐ {show.vote_average.toFixed(1)}</span>
            )}
            <span className="dbadge gray">{show.first_air_date?.slice(0, 4)}</span>
            {seasons  && <span className="dbadge gray">{seasons} temporada{seasons > 1 ? 's' : ''}</span>}
            {episodes && <span className="dbadge gray">{episodes} episodios</span>}
            {show.status && <span className="dbadge blue">{show.status}</span>}
          </div>

          {genres && <p className="detail-genres">{genres}</p>}

          <div className="detail-section">
            <h2>Sinopsis</h2>
            <p>{show.overview || 'Sin descripción disponible.'}</p>
          </div>

          <div className="detail-stats">
            {show.first_air_date && (
              <div className="stat">
                <span className="stat-label">Estreno</span>
                <span className="stat-value">{show.first_air_date}</span>
              </div>
            )}
            {show.last_air_date && (
              <div className="stat">
                <span className="stat-label">Último episodio</span>
                <span className="stat-value">{show.last_air_date}</span>
              </div>
            )}
            {show.original_language && (
              <div className="stat">
                <span className="stat-label">Idioma original</span>
                <span className="stat-value">{show.original_language.toUpperCase()}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {cast.length > 0 && (
        <section className="detail-section">
          <h2>Reparto principal</h2>
          <div className="cast-scroll">
            {cast.map(p => <CastCard key={p.id} person={p} />)}
          </div>
        </section>
      )}

      {recommended.length > 0 && (
        <section className="detail-section">
          <h2>Recomendadas para ti</h2>
          <div className="related-scroll">
            {recommended.map(s => <RelatedCard key={s.id} item={s} type="tv" />)}
          </div>
        </section>
      )}

      {similar.length > 0 && (
        <section className="detail-section">
          <h2>Series similares</h2>
          <div className="related-scroll">
            {similar.map(s => <RelatedCard key={s.id} item={s} type="tv" />)}
          </div>
        </section>
      )}

    </div>
  )
}

export default TvDetail