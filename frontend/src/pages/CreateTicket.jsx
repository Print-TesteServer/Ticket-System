import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useToast } from '../context/ToastContext'
import AppShell from '../components/layout/AppShell'
import { ArrowLeftIcon } from '../components/icons/Icons'

export default function CreateTicket() {
  const [form, setForm] = useState({ title: '', description: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.title.trim() || !form.description.trim()) {
      setError('Preencha todos os campos.')
      return
    }
    setLoading(true)
    try {
      await api.post('/tickets/', form)
      toast('Chamado criado com sucesso.', 'success')
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.detail || 'Erro ao criar chamado.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppShell title="Novo chamado" subtitle="Descreva o problema para abrir um ticket">
      <div className="form-page">
        <button type="button" className="btn btn--ghost btn--back" onClick={() => navigate('/')}>
          <ArrowLeftIcon size={16} />
          Voltar aos chamados
        </button>

        <div className="form-card">
          <form onSubmit={submit} className="form">
            <div className="field">
              <label htmlFor="title">Título do chamado</label>
              <input
                id="title"
                name="title"
                value={form.title}
                onChange={handle}
                placeholder="Ex.: Erro ao fazer login no sistema"
                maxLength={200}
                required
              />
              <span className="field__hint">{form.title.length}/200 caracteres</span>
            </div>

            <div className="field">
              <label htmlFor="description">Descrição detalhada</label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handle}
                placeholder="Descreva o problema, passos para reproduzir e impacto..."
                rows={7}
                required
              />
            </div>

            {error && <p className="form-error" role="alert">{error}</p>}

            <div className="form-card__actions">
              <button type="button" className="btn btn--ghost" onClick={() => navigate('/')}>
                Cancelar
              </button>
              <button type="submit" className="btn btn--primary" disabled={loading}>
                {loading ? <span className="spinner" /> : 'Abrir chamado'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppShell>
  )
}
