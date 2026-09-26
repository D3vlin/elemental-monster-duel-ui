export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-[var(--bg)] p-6 text-center">
      <div>
        <h1 className="text-4xl font-semibold text-[var(--text-h)]">ElementalMonsterDuel</h1>
        <p className="mt-2 text-[var(--text)]">Un duelo de monstruos elementales, 1 vs 1 contra la IA.</p>
      </div>

      <nav className="flex flex-col gap-4 sm:flex-row">
        <button
          type="button"
          disabled
          title="Todavía no está conectado al motor de duelo"
          className="cursor-not-allowed rounded-lg border border-[var(--border)] bg-[var(--accent)] px-6 py-3 font-medium text-white opacity-50"
        >
          ⚔️ Nuevo duelo (próximamente)
        </button>

        <button
          type="button"
          disabled
          title="Todavía no está conectado al bestiario"
          className="cursor-not-allowed rounded-lg border border-[var(--border)] bg-[var(--accent)] px-6 py-3 font-medium text-white opacity-50"
        >
          📖 Bestiario (próximamente)
        </button>
      </nav>
    </main>
  )
}
