// Nombre del juego a modo de logo — reemplazar por una imagen cuando haya
// arte. Un solo lugar para ese tratamiento visual: lo usan el splash de
// arranque y el overlay de carga, para que se vea igual en los dos.
interface GameLogoProps {
  className?: string
}

export default function GameLogo({ className = '' }: GameLogoProps) {
  return <p className={`font-semibold text-(--text-h) ${className}`}>ElementalMonsterDuel</p>
}
