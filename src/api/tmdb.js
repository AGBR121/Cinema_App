import axios from 'axios'

const tmdbApi = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${import.meta.env.APIKEY}`,
  },
  params: {
    language: 'es-ES',
  },
})

export default tmdbApi