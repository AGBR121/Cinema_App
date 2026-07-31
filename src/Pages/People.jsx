import { useSearchParams, Link } from 'react-router-dom'
import { getPopularPeople } from '../api/tmdb'
import usePaginatedList from '../hooks/usePaginatedList'
import Pagination from '../components/Pagination'
import Loader from '../components/Loader'
import '../styles/List.css'

const IMAGE_BASE = 'https://image.tmdb.org/t/p/w300'

function People() {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Number(searchParams.get('page')) || 1
  const { data: people, totalPages, loading } = usePaginatedList(getPopularPeople, page)

  if (loading) return <Loader />

  return (
    <div className="list-page">
      <h1 className="list-title">Personas populares</h1>
      <div className="list-grid">
        {people.map(person => (
          <Link key={person.id} to={`/people/${person.id}`} className="list-card">
            <div className="list-poster square">
              {person.profile_path
                ? <img src={`${IMAGE_BASE}${person.profile_path}`} alt={person.name} loading="lazy" />
                : <span className="list-noimg">?</span>
              }
            </div>
            <div className="list-body">
              <p className="list-card-title">{person.name}</p>
              <p className="list-card-meta">{person.known_for_department}</p>
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

export default People