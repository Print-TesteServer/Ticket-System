export const STATUSES = ['Aberto', 'Em andamento', 'Finalizado']

export const STATUS_META = {
  Aberto: { key: 'open', label: 'Aberto' },
  'Em andamento': { key: 'progress', label: 'Em andamento' },
  Finalizado: { key: 'done', label: 'Finalizado' },
}

export const FILTER_OPTIONS = [
  { key: 'all', label: 'Todos', icon: 'layers' },
  { key: 'Aberto', label: 'Abertos', icon: 'circle' },
  { key: 'Em andamento', label: 'Em andamento', icon: 'clock' },
  { key: 'Finalizado', label: 'Finalizados', icon: 'check' },
]
