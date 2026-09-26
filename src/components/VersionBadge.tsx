export default function VersionBadge() {
  return (
    <p className="pointer-events-none fixed right-3 bottom-3 text-xs text-[var(--text)] opacity-60">
      v{__APP_VERSION__}
    </p>
  )
}
