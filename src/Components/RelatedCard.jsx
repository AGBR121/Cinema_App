import { Link } from 'react-router-dom'

const IMAGE_BASE = 'https://image.tmdb.org/t/p/w300'

function RelatedCard({ item, type }) {
  const title  = item.title || item.name
  const year   = (item.release_date || item.first_air_date || '').slice(0, 4)
  const path   = type === 'movie' ? `/movies/${item.id}` : `/tv/${item.id}`
  const rating = item.vote_average

  return (
    <Link to={path} className="related-card">
      <div className="related-poster">
        {item.poster_path
          ? <img src={`${IMAGE_BASE}${item.poster_path}`} alt={title} loading="lazy" />
          : <span className="related-noimg">?</span>
        }
      </div>
      <div className="related-body">
        <p className="related-title">{title}</p>
        <p className="related-meta">
          {rating > 0 && <span className="related-star">★</span>}
          {rating > 0 && `${rating.toFixed(1)}  `}
          {year || '—'}
        </p>
      </div>
    </Link>
  )
}

export default RelatedCard