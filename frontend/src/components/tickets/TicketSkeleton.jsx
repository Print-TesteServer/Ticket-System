export default function TicketSkeleton() {
  return (
    <div className="ticket ticket--skeleton" aria-hidden="true">
      <div className="skeleton skeleton--sm" />
      <div className="skeleton skeleton--lg" />
      <div className="skeleton skeleton--md" />
      <div className="skeleton skeleton--md" />
      <div className="skeleton skeleton--row" />
    </div>
  )
}
