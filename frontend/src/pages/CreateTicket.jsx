import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function CreateTicket() {
  const [form, setForm] = useState({ title: '', description: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

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
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.detail || 'Erro ao criar ticket.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Voltar</button>
        <h1>Abrir Chamado</h1>
      </div>

      <div className="form-card">
        <form onSubmit={submit}>
          <div className="field">
            <label>Título do chamado</label>
            <input
              name="title"
              value={form.title}
              onChange={handle}
              placeholder="Descreva o problema em uma linha"
              maxLength={200}
              required
            />
            <span className="char-count">{form.title.length}/200</span>
          </div>

          <div className="field">
            <label>Descrição detalhada</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handle}
              placeholder="Detalhe o problema, passos para reproduzir, impacto esperado..."
              rows={6}
              required
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => navigate('/')}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? <span className="spinner" /> : 'Abrir Chamado'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
