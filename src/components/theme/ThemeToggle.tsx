"use client";

import { useTheme } from "next-themes";
import { useState, useSyncExternalStore } from "react";

interface ThemeToggleProps {
  className?: string;
}

const subscribeToNothing = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * Botão de alternar tema claro/escuro. Porte do "CopyCase Dark Mode Switch"
 * usado no EyePleasure: track pílula, thumb azul com squash/stretch líquido,
 * sol e lua fixos nas pontas, bounce do track e rotação da lua.
 *
 * A coreografia toda vive em CSS (ver `.k3d-theme-switch` em globals.css); aqui
 * ficam só o markup e o estado. As animações são gated por `data-interacted`,
 * que só vira `true` no primeiro clique — assim o switch anima na troca feita
 * pelo usuário, mas nunca sozinho ao carregar a página. Já o `mounted`
 * (useSyncExternalStore) evita divergência de hidratação no `aria-checked`,
 * pois o tema real só é conhecido no cliente.
 *
 * Author: lukasnascimento1
 */
export function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();

  // Falso no servidor e durante a hidratação, verdadeiro depois — evita
  // divergência de hidratação no aria-checked (o tema só é conhecido no cliente).
  const mounted = useSyncExternalStore(
    subscribeToNothing,
    getClientSnapshot,
    getServerSnapshot,
  );

  const isLight = mounted && resolvedTheme === "light";

  // Só vira `true` no primeiro clique — mantém as animações fora da carga.
  const [interacted, setInteracted] = useState(false);

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isLight}
      aria-label="Alternar tema claro e escuro"
      data-interacted={interacted}
      className={
        className ? `k3d-theme-switch ${className}` : "k3d-theme-switch"
      }
      onClick={() => {
        setInteracted(true);
        setTheme(isLight ? "dark" : "light");
      }}
    >
      <i className="k3d-ts-icon k3d-ts-sun" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0-5a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1Zm0 16a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0v-2a1 1 0 0 1 1-1ZM4.22 4.22a1 1 0 0 1 1.42 0l1.41 1.41A1 1 0 0 1 5.64 7.05L4.22 5.64a1 1 0 0 1 0-1.42Zm12.7 12.7a1 1 0 0 1 1.42 0l1.41 1.41a1 1 0 0 1-1.41 1.42l-1.42-1.41a1 1 0 0 1 0-1.42ZM2 12a1 1 0 0 1 1-1h2a1 1 0 1 1 0 2H3a1 1 0 0 1-1-1Zm16 0a1 1 0 0 1 1-1h2a1 1 0 1 1 0 2h-2a1 1 0 0 1-1-1ZM4.22 19.78a1 1 0 0 1 0-1.42l1.42-1.41a1 1 0 1 1 1.41 1.42l-1.41 1.41a1 1 0 0 1-1.42 0Zm12.7-12.7a1 1 0 0 1 0-1.42l1.41-1.41a1 1 0 1 1 1.42 1.41l-1.41 1.42a1 1 0 0 1-1.42 0Z" />
        </svg>
      </i>
      <span className="k3d-ts-thumb" />
      <i className="k3d-ts-icon k3d-ts-moon" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="M21.64 13a1 1 0 0 0-1.05-.14 8 8 0 0 1-3.37.73 8.15 8.15 0 0 1-8.14-8.1 8 8 0 0 1 .25-2A1 1 0 0 0 8 2.36a10.14 10.14 0 1 0 14 11.69 1 1 0 0 0-.36-1.05Z" />
        </svg>
      </i>
    </button>
  );
}
