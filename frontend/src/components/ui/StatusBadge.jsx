import { STATUS_META } from '../../lib/constants'

export default function StatusBadge({ status }) {
  const meta = STATUS_META[status]
  return (
    <span className={`badge badge--${meta?.key || 'open'}`}>
      <span className="badge__dot" />
      {status}
    </span>
  )
}
