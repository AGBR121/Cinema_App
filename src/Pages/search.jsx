import { useEffect, useState, useCallback } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { searchContent } from '../api/tmdb'
import Pagination from '../components/Pagination'
import Loader from '../components/Loader'
import '../styles/Search.css'

const FILTERS = [
  { type: 'all',    label: 'Todos'     },
  { type: 'movie',  label: 'Películas' },
  { type: 'tv',     label: 'TV Shows'  },
  { type: 'person', label: 'Personas'  },
]

const SORT_OPTIONS = [
  { value: 'popularity',   label: 'Más populares'   },
  { value: 'vote_average', label: 'Mejor puntuados' },
  { value: 'release_date', label: 'Más recientes'   },
]

const IMAGE_BASE = 'https://image.tmdb.org/t/p/w300'

const TYPE_LABELS = { movie: 'Película', tv: 'TV Show', person: 'Persona' }
const TYPE_COLORS = {
  movie:  { bg: '#E1F5EE', color: '#085041' },
  tv:     { bg: '#E6F1FB', color: '#0C447C' },
  person: { bg: '#EEEDFE', color: '#3C3489' },
}

function ResultCard({ item }) {
  const type   = item.media_type
  const title  = item.title || item.name
  const year   = (item.release_date || item.first_air_date || '').slice(0, 4)
  const image  = item.poster_path || item.profile_path
  const rating = item.vote_average
  const path   = type === 'movie' ? `/movies/${item.id}`
               : type === 'tv'    ? `/tv/${item.id}`
               :                    `/people/${item.id}`
  const badge  = TYPE_COLORS[type] || TYPE_COLORS.movie

  return (
    <Link to={path} className="result-card">
      <div className={`card-img ${type === 'person' ? 'round' : ''}`}>
        {image
          ? <img src={`${IMAGE_BASE}${image}`} alt={title} loading="lazy" />
          : <span className="no-img">?</span>
        }
      </div>
      <div className="card-body">
        <span className="badge" style={{ background: badge.bg, color: badge.color }}>
          {TYPE_LABELS[type] || 'Desconocido'}
        </span>
        <p className="card-title">{title}</p>
        <p className="card-meta">
          {rating > 0
            ? <><span className="star">★</span>{rating.toFixed(1)}&nbsp;&nbsp;</>
            : <span style={{ fontSize: '10px' }}>Sin votos&nbsp;&nbsp;</span>
          }
          {year || '—'}
        </p>
      </div>
    </Link>
  )
}

function Search() {
  const [searchParams, setSearchParams] = useSearchParams()

  const query     = searchParams.get('query') || ''
  const typeParam = searchParams.get('type')  || 'all'
  const page      = Number(searchParams.get('page')) || 1
  const sort      = searchParams.get('sort') || 'popularity'

  const [results,    setResults]    = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [loading,    setLoading]    = useState(false)
  const [error,      setError]      = useState(null)

  const updateParam = useCallback((key, value) => {
    const next = Object.fromEntries(searchParams)
    next[key] = value
    if (key !== 'page') next.page = 1
    setSearchParams(next)
  }, [searchParams, setSearchParams])

  useEffect(() => {
    if (!query.trim()) return
    setLoading(true)
    setError(null)

    const endpoint = typeParam === 'all' ? 'multi' : typeParam

    searchContent(endpoint, query, page)
      .then(res => {
        let items = res.data.results

        if (typeParam !== 'all') {
          items = items.map(i => ({ ...i, media_type: typeParam }))
        }

        // filtrar items sin media_type (a veces pasa con multi)
        items = items.filter(i => i.media_type)

        if (sort === 'vote_average') {
          items = [...items].sort((a, b) => (b.vote_average ?? 0) - (a.vote_average ?? 0))
        } else if (sort === 'release_date') {
          items = [...items].sort((a, b) => {
            const da = a.release_date || a.first_air_date || ''
            const db = b.release_date || b.first_air_date || ''
            return db.localeCompare(da)
          })
        }

        setResults(items)
        setTotalPages(Math.min(res.data.total_pages, 500))
        setTotalItems(res.data.total_results)
      })
      .catch(() => setError('Ocurrió un error al buscar. Intenta de nuevo.'))
      .finally(() => setLoading(false))
  }, [query, typeParam, page, sort])

  if (!query) {
    return (
      <div className="search-page">
        <p className="hint">Usa el buscador del header para encontrar películas, series o personas.</p>
      </div>
    )
  }

  return (
    <div className="search-page">

      <div className="search-header">
        <h1>Resultados para <span className="highlight">"{query}"</span></h1>
        {!loading && (
          <span className="result-count">
            {totalItems.toLocaleString()} resultados · página {page} de {totalPages}
          </span>
        )}
      </div>

      <div className="filter-row">
        {FILTERS.map(f => (
          <button
            key={f.type}
            className={`pill ${typeParam === f.type ? 'active' : ''}`}
            onClick={() => updateParam('type', f.type)}
          >
            {f.label}
          </button>
        ))}
        <select
          className="sort-select"
          value={sort}
          onChange={e => updateParam('sort', e.target.value)}
        >
          {SORT_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {loading && <Loader />}

      {error && <p className="error-msg">{error}</p>}

      {!loading && !error && (
        <>
          {results.length === 0 ? (
            <div className="empty-state">
              <p>No se encontraron resultados para <strong>"{query}"</strong>.</p>
              <p>Intenta con otro término o cambia el filtro.</p>
            </div>
          ) : (
            <div className="results-grid">
              {results.map(item => (
                <ResultCard key={`${item.media_type}-${item.id}`} item={item} />
              ))}
            </div>
          )}

          {results.length > 0 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={p => updateParam('page', p)}
            />
          )}
        </>
      )}
    </div>
  )
}

export default Search