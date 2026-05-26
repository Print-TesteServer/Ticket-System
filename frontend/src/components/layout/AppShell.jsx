import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutIcon,
  LogOutIcon,
  PlusIcon,
  TicketIcon,
} from '../icons/Icons'

export default function AppShell({ children, title, subtitle }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const firstName = user?.name?.split(' ')[0] || 'Usuário'

  return (
    <div className="shell">
      <aside className="shell__sidebar">
        <div className="shell__brand">
          <span className="shell__logo">
            <TicketIcon size={20} />
          </span>
          <div>
            <strong>TicketOS</strong>
            <span>Gestão de chamados</span>
          </div>
        </div>

        <nav className="shell__nav">
          <NavLink to="/" end className={({ isActive }) => `shell__link ${isActive ? 'is-active' : ''}`}>
            <LayoutIcon size={17} />
            Chamados
          </NavLink>
          <button type="button" className="shell__link shell__link--action" onClick={() => navigate('/new')}>
            <PlusIcon size={17} />
            Novo chamado
          </button>
        </nav>

        <div className="shell__footer">
          <div className="shell__user">
            <span className="shell__avatar">{firstName.charAt(0).toUpperCase()}</span>
            <div>
              <strong>{user?.name}</strong>
              <span>{user?.email}</span>
            </div>
          </div>
          <button type="button" className="shell__logout" onClick={logout} title="Sair">
            <LogOutIcon size={17} />
          </button>
        </div>
      </aside>

      <div className="shell__main">
        <header className="shell__header">
          <div>
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <button type="button" className="btn btn--primary btn--sm" onClick={() => navigate('/new')}>
            <PlusIcon size={16} />
            Novo chamado
          </button>
        </header>
        <div className="shell__content">{children}</div>
      </div>
    </div>
  )
}
