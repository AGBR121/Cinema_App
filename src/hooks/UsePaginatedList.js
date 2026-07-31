import { useEffect, useState } from 'react'

function usePaginatedList(fetchFn, page) {
  const [data,       setData]       = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading,    setLoading]    = useState(true)

  useEffect(() => {
    setLoading(true)
    fetchFn(page)
      .then(res => {
        setData(res.data.results)
        setTotalPages(Math.min(res.data.total_pages, 500))
      })
      .finally(() => setLoading(false))
  }, [fetchFn, page])

  return { data, totalPages, loading }
}

export default usePaginatedList