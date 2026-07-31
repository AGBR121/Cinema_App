import { useSearchParams, Link } from 'react-router-dom'
import { getPopularTvShows } from '../api/tmdb'
import usePaginatedList from '../hooks/UsePaginatedList'
import Pagination from '../Components/Pagination'
import Loader from '../Components/Loader'
import '../styles/List.css'

const IMAGE_BASE = 'https://image.tmdb.org/t/p/w300'

function TvShows() {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Number(searchParams.get('page')) || 1
  const { data: shows, totalPages, loading } = usePaginatedList(getPopularTvShows, page)

  if (loading) return <Loader />

  return (
    <div className="list-page">
      <h1 className="list-title">Series populares</h1>
      <div className="list-grid">
        {shows.map(show => (
          <Link key={show.id} to={`/tv/${show.id}`} className="list-card">
            <div className="list-poster">
              {show.poster_path
                ? <img src={`${IMAGE_BASE}${show.poster_path}`} alt={show.name} loading="lazy" />
                : <span className="list-noimg">?</span>
              }
              <span className="list-rating">⭐ {show.vote_average?.toFixed(1)}</span>
            </div>
            <div className="list-body">
              <p className="list-card-title">{show.name}</p>
              <p className="list-card-meta">{show.first_air_date?.slice(0, 4)}</p>
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

export default TvShows