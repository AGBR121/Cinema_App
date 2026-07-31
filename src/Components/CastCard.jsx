import { Link } from 'react-router-dom'

const IMAGE_BASE = 'https://image.tmdb.org/t/p/w185'

function CastCard({ person }) {
  return (
    <Link to={`/people/${person.id}`} className="cast-card">
      <div className="cast-img">
        {person.profile_path
          ? <img src={`${IMAGE_BASE}${person.profile_path}`} alt={person.name} loading="lazy" />
          : <span className="cast-noimg">?</span>
        }
      </div>
      <p className="cast-name">{person.name}</p>
      <p className="cast-role">{person.character || person.job}</p>
    </Link>
  )
}

export default CastCard