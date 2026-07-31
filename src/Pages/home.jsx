import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  getTrending,
  getPopularMovies,
  getPopularTvShows,
  getPopularPeople,
} from '../api/tmdb'
import Loader from '../components/Loader'
import '../styles/Home.css'

const IMG_POSTER  = 'https://image.tmdb.org/t/p/w300'
const IMG_PROFILE = 'https://image.tmdb.org/t/p/w185'

function HorizontalCard({ item, type }) {
  const title = item.title || item.name
  const year  = (item.release_date || item.first_air_date || '').slice(0, 4)
  const path  = type === 'movie' ? `/movies/${item.id}` : `/tv/${item.id}`

  return (
    <Link to={path} className="h-card">
      <div className="h-card-poster">
        {item.poster_path
          ? <img src={`${IMG_POSTER}${item.poster_path}`} alt={title} loading="lazy" />
          : <span className="h-card-noimg">?</span>
        }
      </div>
      <div className="h-card-body">
        <p className="h-card-title">{title}</p>
        <p className="h-card-meta">
          {item.vote_average > 0
            ? <><span className="h-star">★</span>{item.vote_average.toFixed(1)}&nbsp;</>
            : null
          }
          {year}
        </p>
      </div>
    </Link>
  )
}

function PersonCard({ person }) {
  return (
    <Link to={`/people/${person.id}`} className="person-card">
      <div className="person-card-img">
        {person.profile_path
          ? <img src={`${IMG_PROFILE}${person.profile_path}`} alt={person.name} loading="lazy" />
          : <span className="person-card-noimg">?</span>
        }
      </div>
      <div className="person-card-body">
        <p className="person-card-name">{person.name}</p>
        <p className="person-card-dept">{person.known_for_department}</p>
        <p className="person-card-known">
          {person.known_for?.slice(0, 2).map(k => k.title || k.name).join(', ')}
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
  const [people,   setPeople]   = useState([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    Promise.all([
      getTrending(),
      getPopularMovies(),
      getPopularTvShows(),
      getPopularPeople(),
    ])
      .then(([trendRes, movieRes, tvRes, peopleRes]) => {
        setTrending(trendRes.data.results.slice(0, 10))
        setMovies(movieRes.data.results.slice(0, 10))
        setTvShows(tvRes.data.results.slice(0, 10))
        setPeople(peopleRes.data.results.slice(0, 10))
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loader />

  return (
    <div className="home">

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

      {/* Actores populares */}
      <section className="home-section">
        <div className="section-header">
          <h2>Actores populares</h2>
          <Link to="/people" className="see-all">Ver todo →</Link>
        </div>
        <div className="scroll-row">
          {people.map(person => (
            <PersonCard key={person.id} person={person} />
          ))}
        </div>
      </section>

    </div>
  )
}

export default Home