import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import api from '../../api/axios'
import { STATUSES, STATUS_META } from '../../lib/constants'
import { formatDateTime, formatRelative } from '../../lib/formatDate'
import StatusBadge from '../ui/StatusBadge'
import ConfirmDialog from '../ui/ConfirmDialog'
import { ClockIcon, TrashIcon, UserIcon } from '../icons/Icons'

export default function TicketCard({ ticket, onStatusChange, onDelete }) {
  const [updating, setUpdating] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()
  const statusKey = STATUS_META[ticket.status]?.key || 'open'

  const changeStatus = async (newStatus) => {
    if (newStatus === ticket.status) return
    setUpdating(true)
    try {
      await api.patch(`/tickets/${ticket.id}/status`, { status: newStatus })
      onStatusChange(ticket.id, newStatus)
      toast('Status atualizado com sucesso.', 'success')
    } catch (err) {
      toast(err.response?.data?.detail || 'Erro ao atualizar status.')
    } finally {
      setUpdating(false)
    }
  }

  const handleDelete = async () => {
    try {
      await api.delete(`/tickets/${ticket.id}`)
      onDelete(ticket.id)
      toast('Chamado excluído.', 'success')
    } catch (err) {
      toast(err.response?.data?.detail || 'Erro ao excluir chamado.')
    } finally {
      setConfirmOpen(false)
    }
  }

  return (
    <>
      <article className={`ticket ticket--${statusKey}`}>
        <header className="ticket__header">
          <span className="ticket__id">#{String(ticket.id).padStart(4, '0')}</span>
          <StatusBadge status={ticket.status} />
        </header>

        <h3 className="ticket__title">{ticket.title}</h3>
        <p className="ticket__desc">{ticket.description}</p>

        <footer className="ticket__meta">
          <span title={ticket.owner?.name}>
            <UserIcon size={14} />
            {ticket.owner?.name || 'Usuário'}
          </span>
          <span title={formatDateTime(ticket.created_at)}>
            <ClockIcon size={14} />
            {formatRelative(ticket.created_at)}
          </span>
        </footer>

        <div className="ticket__actions">
          <div className="status-picker">
            {STATUSES.map((s) => (
              <button
                key={s}
                type="button"
                className={`status-picker__btn status-picker__btn--${STATUS_META[s].key} ${
                  ticket.status === s ? 'is-active' : ''
                }`}
                disabled={updating}
                onClick={() => changeStatus(s)}
              >
                {s}
              </button>
            ))}
          </div>
          {user?.id === ticket.owner_id && (
            <button
              type="button"
              className="btn btn--icon btn--danger-ghost"
              title="Excluir chamado"
              onClick={() => setConfirmOpen(true)}
            >
              <TrashIcon size={16} />
            </button>
          )}
        </div>
      </article>

      <ConfirmDialog
        open={confirmOpen}
        title="Excluir chamado?"
        message={`"${ticket.title}" será removido permanentemente.`}
        confirmLabel="Excluir"
        danger
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
      />
    </>
  )
}
