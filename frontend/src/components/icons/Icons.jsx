const defaults = { size: 18, strokeWidth: 2, className: '' }

export function Icon({ children, size = 18, className = '', strokeWidth = 2 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

export function TicketIcon(props) {
  return (
    <Icon {...defaults} {...props}>
      <path d="M15 5H9a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z" />
      <path d="M9 9h6M9 13h4" />
    </Icon>
  )
}

export function PlusIcon(props) {
  return (
    <Icon {...defaults} {...props}>
      <path d="M12 5v14M5 12h14" />
    </Icon>
  )
}

export function SearchIcon(props) {
  return (
    <Icon {...defaults} {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3-3" />
    </Icon>
  )
}

export function LogOutIcon(props) {
  return (
    <Icon {...defaults} {...props}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="m16 17 5-5-5-5M21 12H9" />
    </Icon>
  )
}

export function RefreshIcon(props) {
  return (
    <Icon {...defaults} {...props}>
      <path d="M21 12a9 9 0 1 1-2.64-6.36" />
      <path d="M21 3v6h-6" />
    </Icon>
  )
}

export function TrashIcon(props) {
  return (
    <Icon {...defaults} {...props}>
      <path d="M3 6h18M8 6V4h8v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
    </Icon>
  )
}

export function UserIcon(props) {
  return (
    <Icon {...defaults} {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c1.5-4 14.5-4 16 0" />
    </Icon>
  )
}

export function ClockIcon(props) {
  return (
    <Icon {...defaults} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </Icon>
  )
}

export function CheckIcon(props) {
  return (
    <Icon {...defaults} {...props}>
      <path d="m5 12 4 4L19 6" />
    </Icon>
  )
}

export function CircleIcon(props) {
  return (
    <Icon {...defaults} {...props}>
      <circle cx="12" cy="12" r="9" />
    </Icon>
  )
}

export function LayersIcon(props) {
  return (
    <Icon {...defaults} {...props}>
      <path d="m12 2 8 4-8 4-8-4 8-4Z" />
      <path d="m4 10 8 4 8-4M4 16l8 4 8-4" />
    </Icon>
  )
}

export function ArrowLeftIcon(props) {
  return (
    <Icon {...defaults} {...props}>
      <path d="m12 19-7-7 7-7M19 12H5" />
    </Icon>
  )
}

export function AlertIcon(props) {
  return (
    <Icon {...defaults} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v4M12 16h.01" />
    </Icon>
  )
}

export function InboxIcon(props) {
  return (
    <Icon size={40} {...props}>
      <path d="M22 12h-6l-2 3H10l-2-3H4" />
      <path d="M5 6h14l2 6v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V12l2-6Z" />
    </Icon>
  )
}

export function LayoutIcon(props) {
  return (
    <Icon {...defaults} {...props}>
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" />
      <rect x="3" y="16" width="7" height="5" rx="1" />
    </Icon>
  )
}

export function XIcon(props) {
  return (
    <Icon {...defaults} {...props}>
      <path d="M18 6 6 18M6 6l12 12" />
    </Icon>
  )
}
