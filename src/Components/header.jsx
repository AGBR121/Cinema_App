import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { searchQuick } from '../api/tmdb'
import '../styles/Header.css'

const FILTERS = [
  { type: 'movie',  label: 'Película', placeholder: 'Buscar película...'       },
  { type: 'tv',     label: 'TV',       placeholder: 'Buscar serie...'          },
  { type: 'person', label: 'Actor',    placeholder: 'Buscar actor o actriz...' },
]

const TYPE_LABELS = { movie: 'Película', tv: 'Serie', person: 'Persona' }
const TYPE_COLORS = {
  movie:  { bg: '#E1F5EE', color: '#085041' },
  tv:     { bg: '#E6F1FB', color: '#0C447C' },
  person: { bg: '#EEEDFE', color: '#3C3489' },
}
const IMAGE_BASE = 'https://image.tmdb.org/t/p/w92'

function filterByType(items, filter) {
  if (filter === 'movie')  return items.filter(i => i.media_type === 'movie')
  if (filter === 'tv')     return items.filter(i => i.media_type === 'tv')
  if (filter === 'person') return items.filter(i => i.media_type === 'person')
  return items
}

function Header() {
  const [query,       setQuery]       = useState('')
  const [filter,      setFilter]      = useState('movie')
  const [suggestions, setSuggestions] = useState([])
  const [showDrop,    setShowDrop]    = useState(false)
  const [loading,     setLoading]     = useState(false)
  const [dark,        setDark]        = useState(
    () => localStorage.getItem('theme') === 'dark'
  )

  const navigate    = useNavigate()
  const wrapperRef  = useRef(null)
  const debounceRef = useRef(null)

  // ── Aplica tema oscuro ───────────────────────
  useEffect(() => {
    const theme = dark ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [dark])

  // ── Cierra dropdown al hacer clic fuera ──────
  useEffect(() => {
    function handleClick(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDrop(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // ── Re-filtra cuando cambia el tipo ─────────
  useEffect(() => {
    if (query.trim().length < 2) return
    if (debounceRef.current) clearTimeout(debounceRef.current)

    setLoading(true)
    searchQuick(query)
      .then(res => {
        const all   = res.data.results.filter(i =>
          ['movie', 'tv', 'person'].includes(i.media_type)
        )
        const items = filterByType(all, filter).slice(0, 6)
        setSuggestions(items)
        setShowDrop(items.length > 0)
      })
      .catch(() => setSuggestions([]))
      .finally(() => setLoading(false))
  }, [filter])

  // ── Búsqueda con debounce al escribir ────────
  function handleChange(e) {
    const val = e.target.value
    setQuery(val)

    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (val.trim().length < 2) {
      setSuggestions([])
      setShowDrop(false)
      return
    }

    debounceRef.current = setTimeout(() => {
      setLoading(true)
      searchQuick(val)
        .then(res => {
          const all   = res.data.results.filter(i =>
            ['movie', 'tv', 'person'].includes(i.media_type)
          )
          const items = filterByType(all, filter).slice(0, 6)
          setSuggestions(items)
          setShowDrop(true)
        })
        .catch(() => setSuggestions([]))
        .finally(() => setLoading(false))
    }, 300)
  }

  // ── Submit del form ──────────────────────────
  function handleSubmit(e) {
    e.preventDefault()
    if (!query.trim()) return
    setShowDrop(false)
    navigate(`/search?query=${encodeURIComponent(query)}&type=${filter}`)
  }

  // ── Selecciona un resultado ──────────────────
  function handleSelect(item) {
    setShowDrop(false)
    setQuery('')
    setSuggestions([])
    const path = item.media_type === 'movie' ? `/movies/${item.id}`
               : item.media_type === 'tv'    ? `/tv/${item.id}`
               :                               `/people/${item.id}`
    navigate(path)
  }

  // ── Ver más resultados ───────────────────────
  function handleMoreResults() {
    setShowDrop(false)
    navigate(`/search?query=${encodeURIComponent(query)}&type=${filter}`)
  }

  const current = FILTERS.find(f => f.type === filter)

  return (
    <header className="header">

      {/* Logo */}
      <Link to="/" className="logo">
        Stream<span>DB</span>
      </Link>

      {/* Buscador + dropdown */}
      <div className="search-wrapper" ref={wrapperRef}>
        <form onSubmit={handleSubmit} className="search-form">
          <input
            type="text"
            value={query}
            onChange={handleChange}
            onFocus={() => suggestions.length > 0 && setShowDrop(true)}
            placeholder={current.placeholder}
            autoComplete="off"
          />
          <div className="filter-pills">
            {FILTERS.map(f => (
              <button
                key={f.type}
                type="button"
                className={`pill ${filter === f.type ? 'active' : ''}`}
                onClick={() => setFilter(f.type)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </form>

        {/* Dropdown */}
        {showDrop && (
          <div className="suggestions-drop">

            {loading && (
              <div className="suggestions-loading">Buscando...</div>
            )}

            {!loading && suggestions.length === 0 && (
              <div className="suggestions-empty">
                Sin resultados para "{query}"
              </div>
            )}

            {!loading && suggestions.map(item => {
              const title  = item.title || item.name
              const year   = (item.release_date || item.first_air_date || '').slice(0, 4)
              const image  = item.poster_path || item.profile_path
              const badge  = TYPE_COLORS[item.media_type]
              const rating = item.vote_average

              return (
                <div
                  key={`${item.media_type}-${item.id}`}
                  className="suggestion-item"
                  onClick={() => handleSelect(item)}
                >
                  <div className="suggestion-img">
                    {image
                      ? <img src={`${IMAGE_BASE}${image}`} alt={title} />
                      : <span className="suggestion-noimg">?</span>
                    }
                  </div>

                  <div className="suggestion-info">
                    <p className="suggestion-title">{title}</p>
                    <p className="suggestion-meta">
                      {year && <span>{year}</span>}
                      {rating > 0 && <span>★ {rating.toFixed(1)}</span>}
                    </p>
                  </div>

                  <span
                    className="suggestion-badge"
                    style={{ background: badge?.bg, color: badge?.color }}
                  >
                    {TYPE_LABELS[item.media_type]}
                  </span>
                </div>
              )
            })}

            {!loading && suggestions.length > 0 && (
              <div className="suggestion-more" onClick={handleMoreResults}>
                Ver más resultados para "{query}"
              </div>
            )}

          </div>
        )}
      </div>

      {/* Toggle modo oscuro */}
      <button
        className="theme-toggle"
        onClick={() => setDark(d => !d)}
        title={dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      >
        {dark ? '☀️' : '🌙'}
      </button>

      {/* Botón inicio */}
      <Link to="/" className="btn-home">Inicio</Link>

    </header>
  )
}

export default Header