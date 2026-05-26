import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { TicketIcon } from '../components/icons/Icons'

export default function Login() {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, register } = useAuth()
  const navigate = useNavigate()

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'login') {
        await login(form.email, form.password)
      } else {
        if (!form.name.trim()) {
          setError('Nome é obrigatório.')
          setLoading(false)
          return
        }
        await register(form.name, form.email, form.password)
      }
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.detail || 'Erro inesperado. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth">
      <section className="auth__hero">
        <div className="auth__hero-inner">
          <span className="auth__logo">
            <TicketIcon size={28} />
          </span>
          <h1>Gestão de chamados simples e eficiente</h1>
          <p>
            Abra tickets, acompanhe status em tempo real e mantenha sua equipe alinhada —
            tudo em um painel claro e objetivo.
          </p>
          <ul className="auth__features">
            <li>Autenticação segura com JWT</li>
            <li>Status: Aberto, Em andamento, Finalizado</li>
            <li>Filtros e busca instantânea</li>
          </ul>
        </div>
      </section>

      <section className="auth__panel">
        <div className="auth__card">
          <header className="auth__card-header">
            <h2>{mode === 'login' ? 'Entrar na conta' : 'Criar conta'}</h2>
            <p>{mode === 'login' ? 'Acesse seus chamados' : 'Comece a abrir tickets'}</p>
          </header>

          <div className="tabs">
            <button
              type="button"
              className={`tabs__btn ${mode === 'login' ? 'is-active' : ''}`}
              onClick={() => { setMode('login'); setError('') }}
            >
              Entrar
            </button>
            <button
              type="button"
              className={`tabs__btn ${mode === 'register' ? 'is-active' : ''}`}
              onClick={() => { setMode('register'); setError('') }}
            >
              Cadastrar
            </button>
          </div>

          <form onSubmit={submit} className="form">
            {mode === 'register' && (
              <div className="field">
                <label htmlFor="name">Nome completo</label>
                <input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handle}
                  placeholder="Seu nome"
                  autoComplete="name"
                  required
                />
              </div>
            )}
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handle}
                placeholder="voce@empresa.com"
                autoComplete="email"
                required
              />
            </div>
            <div className="field">
              <label htmlFor="password">Senha</label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handle}
                placeholder="Mínimo 4 caracteres"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                required
                minLength={4}
              />
            </div>

            {error && <p className="form-error" role="alert">{error}</p>}

            <button className="btn btn--primary btn--full" type="submit" disabled={loading}>
              {loading ? <span className="spinner" /> : mode === 'login' ? 'Entrar' : 'Criar conta'}
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
