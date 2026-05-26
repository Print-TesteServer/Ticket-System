import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

const STATUSES = ['Aberto', 'Em andamento', 'Finalizado']
const STATUS_CLASS = { 'Aberto': 'status-open', 'Em andamento': 'status-progress', 'Finalizado': 'status-done' }

function TicketCard({ ticket, onStatusChange, onDelete }) {
  const [updating, setUpdating] = useState(false)
  const { user } = useAuth()

  const changeStatus = async (newStatus) => {
    setUpdating(true)
    try {
      await api.patch(`/tickets/${ticket.id}/status`, { status: newStatus })
      onStatusChange(ticket.id, newStatus)
    } catch (err) {
      alert(err.response?.data?.detail || 'Erro ao atualizar status.')
    } finally {
      setUpdating(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm(`Excluir o ticket "${ticket.title}"?`)) return
    try {
      await api.delete(`/tickets/${ticket.id}`)
      onDelete(ticket.id)
    } catch (err) {
      alert(err.response?.data?.detail || 'Erro ao excluir ticket.')
    }
  }

  const fmt = (d) => new Date(d).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })

  return (
    <div className={`ticket-card ${STATUS_CLASS[ticket.status]}`}>
      <div className="ticket-header">
        <span className="ticket-id">#{ticket.id}</span>
        <span className={`status-badge ${STATUS_CLASS[ticket.status]}`}>{ticket.status}</span>
      </div>

      <h3 className="ticket-title">{ticket.title}</h3>
      <p className="ticket-desc">{ticket.description}</p>

      <div className="ticket-meta">
        <span>🧑 {ticket.owner?.name || 'Usuário'}</span>
        <span>🕐 {fmt(ticket.created_at)}</span>
      </div>

      <div className="ticket-actions">
        <div className="status-select-wrap">
          <select
            value={ticket.status}
            onChange={(e) => changeStatus(e.target.value)}
            disabled={updating}
            className="status-select"
          >
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          {updating && <span className="spinner small" />}
        </div>
        {user?.id === ticket.owner_id && (
          <button className="btn-delete" onClick={handleDelete} title="Excluir ticket">✕</button>
        )}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const fetchTickets = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await api.get('/tickets/')
      setTickets(data)
    } catch (err) {
      setError('Não foi possível carregar os tickets.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchTickets() }, [fetchTickets])

  const handleStatusChange = (id, newStatus) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t))
  }

  const handleDelete = (id) => {
    setTickets(prev => prev.filter(t => t.id !== id))
  }

  const filtered = tickets.filter(t => {
    const matchStatus = filter === 'all' || t.status === filter
    const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const counts = {
    all: tickets.length,
    'Aberto': tickets.filter(t => t.status === 'Aberto').length,
    'Em andamento': tickets.filter(t => t.status === 'Em andamento').length,
    'Finalizado': tickets.filter(t => t.status === 'Finalizado').length,
  }

  return (
    <div className="dashboard">
      <header className="app-header">
        <div className="header-left">
          <span className="brand-icon">⬡</span>
          <span className="brand-name">TicketOS</span>
        </div>
        <div className="header-right">
          <span className="user-greeting">Olá, {user?.name?.split(' ')[0]}</span>
          <button className="btn-new" onClick={() => navigate('/new')}>+ Novo Chamado</button>
          <button className="btn-logout" onClick={logout}>Sair</button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="stats-row">
          {[
            { label: 'Total', key: 'all', icon: '📋' },
            { label: 'Abertos', key: 'Aberto', icon: '🔴' },
            { label: 'Em Andamento', key: 'Em andamento', icon: '🟡' },
            { label: 'Finalizados', key: 'Finalizado', icon: '🟢' },
          ].map(({ label, key, icon }) => (
            <div
              key={key}
              className={`stat-card ${filter === key ? 'active' : ''}`}
              onClick={() => setFilter(key)}
            >
              <span className="stat-icon">{icon}</span>
              <span className="stat-num">{counts[key]}</span>
              <span className="stat-label">{label}</span>
            </div>
          ))}
        </div>

        <div className="toolbar">
          <input
            className="search-input"
            type="text"
            placeholder="Buscar por título..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button className="btn-refresh" onClick={fetchTickets} title="Atualizar">↻</button>
        </div>

        {loading && (
          <div className="loading-state">
            <div className="loader" />
            <p>Carregando tickets...</p>
          </div>
        )}

        {!loading && error && (
          <div className="error-state">
            <p>{error}</p>
            <button onClick={fetchTickets} className="btn-secondary">Tentar novamente</button>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="empty-state">
            <span className="empty-icon">🎯</span>
            <p>{search || filter !== 'all' ? 'Nenhum ticket encontrado para esse filtro.' : 'Nenhum chamado aberto ainda.'}</p>
            {filter === 'all' && !search && (
              <button className="btn-primary" onClick={() => navigate('/new')}>Abrir primeiro chamado</button>
            )}
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="ticket-grid">
            {filtered.map(t => (
              <TicketCard
                key={t.id}
                ticket={t}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
