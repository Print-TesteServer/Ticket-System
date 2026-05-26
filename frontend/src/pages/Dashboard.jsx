import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import AppShell from '../components/layout/AppShell'
import StatsRow from '../components/tickets/StatsRow'
import TicketCard from '../components/tickets/TicketCard'
import TicketSkeleton from '../components/tickets/TicketSkeleton'
import { InboxIcon, PlusIcon, RefreshIcon, SearchIcon } from '../components/icons/Icons'

export default function Dashboard() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const fetchTickets = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await api.get('/tickets/')
      setTickets(data)
    } catch {
      setError('Não foi possível carregar os chamados.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchTickets() }, [fetchTickets])

  const handleStatusChange = (id, newStatus) => {
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t)))
  }

  const handleDelete = (id) => {
    setTickets((prev) => prev.filter((t) => t.id !== id))
  }

  const filtered = tickets.filter((t) => {
    const matchStatus = filter === 'all' || t.status === filter
    const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const counts = {
    all: tickets.length,
    Aberto: tickets.filter((t) => t.status === 'Aberto').length,
    'Em andamento': tickets.filter((t) => t.status === 'Em andamento').length,
    Finalizado: tickets.filter((t) => t.status === 'Finalizado').length,
  }

  return (
    <AppShell
      title="Chamados"
      subtitle={`${tickets.length} ticket${tickets.length !== 1 ? 's' : ''} no sistema`}
    >
      <StatsRow counts={counts} activeFilter={filter} onFilter={setFilter} />

      <div className="toolbar">
        <div className="search">
          <SearchIcon size={16} className="search__icon" />
          <input
            className="search__input"
            type="search"
            placeholder="Buscar por título..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button type="button" className="btn btn--ghost btn--icon" onClick={fetchTickets} title="Atualizar lista">
          <RefreshIcon size={16} />
        </button>
      </div>

      {loading && (
        <div className="ticket-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <TicketSkeleton key={i} />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="empty">
          <p>{error}</p>
          <button type="button" className="btn btn--secondary" onClick={fetchTickets}>
            Tentar novamente
          </button>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="empty">
          <div className="empty__icon">
            <InboxIcon />
          </div>
          <h3>
            {search || filter !== 'all'
              ? 'Nenhum chamado encontrado'
              : 'Nenhum chamado aberto ainda'}
          </h3>
          <p>
            {search || filter !== 'all'
              ? 'Ajuste os filtros ou a busca para ver outros resultados.'
              : 'Crie o primeiro ticket para começar o acompanhamento.'}
          </p>
          {filter === 'all' && !search && (
            <button type="button" className="btn btn--primary" onClick={() => navigate('/new')}>
              <PlusIcon size={16} />
              Abrir primeiro chamado
            </button>
          )}
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="ticket-grid">
          {filtered.map((t) => (
            <TicketCard
              key={t.id}
              ticket={t}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </AppShell>
  )
}
