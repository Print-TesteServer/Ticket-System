import { FILTER_OPTIONS } from '../../lib/constants'
import { CheckIcon, CircleIcon, ClockIcon, LayersIcon } from '../icons/Icons'

const ICONS = {
  layers: LayersIcon,
  circle: CircleIcon,
  clock: ClockIcon,
  check: CheckIcon,
}

export default function StatsRow({ counts, activeFilter, onFilter }) {
  return (
    <div className="stats">
      {FILTER_OPTIONS.map(({ key, label, icon }) => {
        const Icon = ICONS[icon]
        return (
          <button
            key={key}
            type="button"
            className={`stat ${activeFilter === key ? 'is-active' : ''}`}
            onClick={() => onFilter(key)}
          >
            <span className={`stat__icon stat__icon--${key === 'all' ? 'all' : key.replace(/\s/g, '-')}`}>
              <Icon size={16} />
            </span>
            <span className="stat__value">{counts[key] ?? 0}</span>
            <span className="stat__label">{label}</span>
          </button>
        )
      })}
    </div>
  )
}
