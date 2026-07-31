import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getPersonById, getPersonCredits } from '../api/tmdb'
import RelatedCard from '../Components/RelatedCard'
import Loader from '../Components/Loader'
import '../styles/Detail.css'

const IMG_PROFILE = 'https://image.tmdb.org/t/p/w400'

function PersonDetail() {
  const { id } = useParams()
  const [person,  setPerson]  = useState(null)
  const [movies,  setMovies]  = useState([])
  const [tvShows, setTvShows] = useState([])
  const [loading, setLoading] = useState(true)
  const [showFull, setShowFull] = useState(false)

  useEffect(() => {
    setLoading(true)
    window.scrollTo(0, 0)
    Promise.all([getPersonById(id), getPersonCredits(id)])
      .then(([personRes, creditsRes]) => {
        setPerson(personRes.data)
        const cast = creditsRes.data.cast || []
        // separar y ordenar por popularidad
        setMovies(
          cast.filter(c => c.media_type === 'movie')
              .sort((a, b) => b.popularity - a.popularity)
              .slice(0, 12)
        )
        setTvShows(
          cast.filter(c => c.media_type === 'tv')
              .sort((a, b) => b.popularity - a.popularity)
              .slice(0, 12)
        )
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <Loader />
  if (!person)  return <p className="error-msg">No se encontró la persona.</p>

  const bio        = person.biography || 'Sin biografía disponible.'
  const bioShort   = bio.slice(0, 400)
  const needsMore  = bio.length > 400

  return (
    <div className="detail-page">

      <div className="detail-main person-main">
        <div className="detail-poster person-poster">
          {person.profile_path
            ? <img src={`${IMG_PROFILE}${person.profile_path}`} alt={person.name} />
            : <div className="detail-noimg">?</div>
          }
        </div>

        <div className="detail-info">
          <h1 className="detail-title">{person.name}</h1>

          <div className="detail-badges">
            {person.known_for_department && (
              <span className="dbadge blue">{person.known_for_department}</span>
            )}
            {person.gender === 1 && <span className="dbadge gray">Actriz</span>}
            {person.gender === 2 && <span className="dbadge gray">Actor</span>}
          </div>

          <div className="detail-stats">
            {person.birthday && (
              <div className="stat">
                <span className="stat-label">Nacimiento</span>
                <span className="stat-value">{person.birthday}</span>
              </div>
            )}
            {person.deathday && (
              <div className="stat">
                <span className="stat-label">Fallecimiento</span>
                <span className="stat-value">{person.deathday}</span>
              </div>
            )}
            {person.place_of_birth && (
              <div className="stat">
                <span className="stat-label">Lugar de nacimiento</span>
                <span className="stat-value">{person.place_of_birth}</span>
              </div>
            )}
          </div>

          <div className="detail-section">
            <h2>Biografía</h2>
            <p>
              {showFull || !needsMore ? bio : `${bioShort}...`}
            </p>
            {needsMore && (
              <button
                className="btn-more"
                onClick={() => setShowFull(v => !v)}
              >
                {showFull ? 'Leer menos ↑' : 'Leer más ↓'}
              </button>
            )}
          </div>
        </div>
      </div>

      {movies.length > 0 && (
        <section className="detail-section">
          <h2>Películas destacadas</h2>
          <div className="related-scroll">
            {movies.map(m => <RelatedCard key={m.id} item={m} type="movie" />)}
          </div>
        </section>
      )}

      {tvShows.length > 0 && (
        <section className="detail-section">
          <h2>Series destacadas</h2>
          <div className="related-scroll">
            {tvShows.map(s => <RelatedCard key={s.id} item={s} type="tv" />)}
          </div>
        </section>
      )}

    </div>
  )
}

export default PersonDetail