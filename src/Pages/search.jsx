// pages/Search.jsx
import { useEffect, useState, useCallback } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { searchContent } from '../api/tmdb'
import Pagination from '../components/Pagination'
import Loader from '../components/Loader'

const FILTERS = [
  { type: 'all',    label: 'Todos'     },
  { type: 'movie',  label: 'Películas' },
  { type: 'tv',     label: 'TV Shows'  },
  { type: 'person', label: 'Personas'  },
]

const SORT_OPTIONS = [
  { value: 'popularity',    label: 'Más populares'  },
  { value: 'vote_average',  label: 'Mejor puntuados'},
  { value: 'release_date',  label: 'Más recientes'  },
]

const IMAGE_BASE = 'https://image.tmdb.org/t/p/w300'

function getItemProps(item) {
  const type = item.media_type
  return {
    type,
    title:  item.title || item.name,
    year:   (item.release_date || item.first_air_date || '').slice(0, 4),
    image:  item.poster_path || item.profile_path,
    rating: item.vote_average ?? null,
    path:   type === 'movie' ? `/movies/${item.id}`
          : type === 'tv'    ? `/tv/${item.id}`
          :                    `/people/${item.id}`,
  }
}

const TYPE_LABELS = { movie: 'Película', tv: 'TV Show', person: 'Persona' }
const TYPE_COLORS = {
  movie:  { bg: '#E1F5EE', color: '#085041' },
  tv:     { bg: '#E6F1FB', color: '#0C447C' },
  person: { bg: '#EEEDFE', color: '#3C3489' },
}

function ResultCard({ item }) {
  const { type, title, year, image, rating, path } = getItemProps(item)
  const badge = TYPE_COLORS[type] || TYPE_COLORS.movie

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
          {TYPE_LABELS[type]}
        </span>
        <p className="card-title">{title}</p>
        <p className="card-meta">
          {rating ? `⭐ ${rating.toFixed(1)}  ` : ''}
          {year}
        </p>
      </div>
    </Link>
  )
}

function EmptyState({ query }) {
  return (
    <div className="empty-state">
      <p>No se encontraron resultados para <strong>"{query}"</strong>.</p>
      <p>Intenta con otro término o cambia el filtro.</p>
    </div>
  )
}

function Search() {
  const [searchParams, setSearchParams] = useSearchParams()

  const query      = searchParams.get('query') || ''
  const typeParam  = searchParams.get('type')  || 'all'
  const page       = Number(searchParams.get('page')) || 1
  const sort       = searchParams.get('sort') || 'popularity'

  const [results,    setResults]    = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [loading,    setLoading]    = useState(false)
  const [error,      setError]      = useState(null)

  const updateParam = useCallback((key, value) => {
    const next = Object.fromEntries(searchParams)
    next[key] = value
    if (key !== 'page') next.page = 1   // reset página al cambiar filtro
    setSearchParams(next)
  }, [searchParams, setSearchParams])

  useEffect(() => {
    if (!query.trim()) return
    setLoading(true)
    setError(null)

    // 'all' usa /search/multi, el resto usa /search/{type}
    const endpoint = typeParam === 'all' ? 'multi' : typeParam

    searchContent(endpoint, query, page)
      .then(res => {
        let items = res.data.results

        // /search/multi devuelve media_type en cada item
        // para los otros endpoints lo añadimos manualmente
        if (typeParam !== 'all') {
          items = items.map(i => ({ ...i, media_type: typeParam }))
        }

        // filtrar personas sin foto ni créditos conocidos
        items = items.filter(i => i.media_type !== 'person' || i.known_for?.length)

        // ordenar en cliente (TMDB ya manda por popularidad por defecto)
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
        <p className="hint">Usa el buscador para encontrar películas, series o personas.</p>
      </div>
    )
  }

  return (
    <div className="search-page">

      {/* Encabezado */}
      <div className="search-header">
        <h1>
          Resultados para <span className="highlight">"{query}"</span>
        </h1>
        {!loading && (
          <span className="result-count">
            {totalItems.toLocaleString()} resultados · página {page} de {totalPages}
          </span>
        )}
      </div>

      {/* Filtros + orden */}
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

      {/* Contenido */}
      {loading && <Loader />}

      {error && <p className="error-msg">{error}</p>}

      {!loading && !error && results.length === 0 && (
        <EmptyState query={query} />
      )}

      {!loading && !error && results.length > 0 && (
        <>
          <div className="results-grid">
            {results.map(item => (
              <ResultCard key={`${item.media_type}-${item.id}`} item={item} />
            ))}
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={newPage => updateParam('page', newPage)}
          />
        </>
      )}
    </div>
  )
}

export default Search