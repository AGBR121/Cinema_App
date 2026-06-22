import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const FILTERS = [
  { type: 'movie',  label: 'Película', placeholder: 'Buscar película...' },
  { type: 'tv',     label: 'TV',       placeholder: 'Buscar serie...' },
  { type: 'person', label: 'Actor',    placeholder: 'Buscar actor o actriz...' },
]

function Header() {
  const [query, setQuery]       = useState('')
  const [filter, setFilter]     = useState('movie')
  const wrapperRef              = useRef(null)
  const navigate                = useNavigate()

  const currentFilter = FILTERS.find(f => f.type === filter)

  function handleSearch(e) {
    e.preventDefault()
    if (!query.trim()) return
    navigate(`/search?query=${encodeURIComponent(query)}&type=${filter}`)
    setQuery('')
  }

  
  useEffect(() => {
    function onClick(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setQuery('')
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <header className="header">
      {/* Logo */}
      <Link to="/" className="logo">StreamDB</Link>

      {/* Buscador */}
      <form className="search-wrapper" onSubmit={handleSearch} ref={wrapperRef}>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={currentFilter.placeholder}
        />

        {/* Filtros */}
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

      {/* Botón inicio */}
      <Link to="/" className="btn-home">Inicio</Link>
    </header>
  )
}

export default Header