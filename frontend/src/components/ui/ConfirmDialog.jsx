import { AlertIcon } from '../icons/Icons'

export default function ConfirmDialog({ open, title, message, confirmLabel = 'Confirmar', onConfirm, onCancel, danger }) {
  if (!open) return null

  return (
    <div className="modal-overlay" role="presentation" onClick={onCancel}>
      <div
        className="modal-card"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-desc"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`modal-card__icon ${danger ? 'modal-card__icon--danger' : ''}`}>
          <AlertIcon size={22} />
        </div>
        <h2 id="confirm-title" className="modal-card__title">{title}</h2>
        <p id="confirm-desc" className="modal-card__message">{message}</p>
        <div className="modal-card__actions">
          <button type="button" className="btn btn--ghost" onClick={onCancel}>
            Cancelar
          </button>
          <button
            type="button"
            className={`btn ${danger ? 'btn--danger' : 'btn--primary'}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
