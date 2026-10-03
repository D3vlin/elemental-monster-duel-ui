import GameLogo from './GameLogo'

interface LoadingOverlayProps {
  label: string
}

export default function LoadingOverlay({ label }: LoadingOverlayProps) {
  return (
    <div
      role="status"
      className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-3 bg-(--bg)/70 backdrop-blur-sm"
    >
      <GameLogo className="text-xl" />
      <div
        className="h-10 w-10 animate-spin rounded-full border-4 border-(--border) border-t-(--accent)"
        aria-hidden="true"
      />
      <p className="text-sm text-(--text)">{label}</p>
    </div>
  )
}
