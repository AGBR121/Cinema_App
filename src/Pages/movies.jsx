import { useSearchParams, Link } from 'react-router-dom'
import { getPopularMovies } from '../api/tmdb'
import usePaginatedList from '../hooks/usePaginatedList'
import Pagination from '../components/Pagination'
import Loader from '../components/Loader'
import '../styles/List.css'

const IMAGE_BASE = 'https://image.tmdb.org/t/p/w300'

function Movies() {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Number(searchParams.get('page')) || 1
  const { data: movies, totalPages, loading } = usePaginatedList(getPopularMovies, page)

  if (loading) return <Loader />

  return (
    <div className="list-page">
      <h1 className="list-title">Películas populares</h1>
      <div className="list-grid">
{movies.map(movie => (
  <Link key={movie.id} to={`/movies/${movie.id}`} className="list-card">
    <div className="list-poster">
      {movie.poster_path
        ? <img src={`${IMAGE_BASE}${movie.poster_path}`} alt={movie.title} loading="lazy" />
        : <span className="list-noimg">?</span>
      }
      {movie.vote_average > 0 && (
        <span className="list-rating">
          ★ {movie.vote_average.toFixed(1)}
        </span>
      )}
    </div>
    <div className="list-body">
      <p className="list-card-title">{movie.title}</p>
      <p className="list-card-meta">
        {movie.release_date?.slice(0, 4) || '—'}
      </p>
    </div>
  </Link>
))}
      </div>
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={p => setSearchParams({ page: p })}
      />
    </div>
  )
}

export default Movies