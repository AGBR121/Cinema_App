import { Link } from 'react-router-dom'
import '../styles/NotFound.css'

function NotFound() {
  return (
    <div className="notfound">
      <h1 className="notfound-code">404</h1>
      <p className="notfound-title">Página no encontrada</p>
      <p className="notfound-desc">
        La ruta que buscas no existe o fue movida.
      </p>
      <Link to="/" className="notfound-btn">← Volver al inicio</Link>
    </div>
  )
}

export default NotFound