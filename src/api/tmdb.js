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

export const searchMulti = (query, type, page = 1) =>
  tmdbApi.get(`/search/${type}`, { params: { query, page } })

export const searchContent = (type, query, page = 1) =>
  tmdbApi.get(`/search/${type}`, { params: { query, page } })