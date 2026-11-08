import type { ComponentProps, FC, HTMLAttributes } from "react";
import { useEffect, useState } from "react";

interface Props extends ComponentProps<FC>, HTMLAttributes<HTMLDivElement> {
  epithets: string[];
}

const HeroEpithets: FC<Props> = ({ epithets }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setInterval> | undefined;
    const sync = () => {
      clearInterval(timer);
      if (motion.matches) setIndex(0);
      if (epithets.length < 2 || motion.matches || document.hidden
        || document.documentElement.dataset.motion !== "running") return;
      timer = setInterval(() => setIndex((current) => (current + 1) % epithets.length), 3000);
    };
    motion.addEventListener("change", sync);
    document.addEventListener("portfolio:motion-change", sync);
    document.addEventListener("visibilitychange", sync);
    sync();
    return () => {
      clearInterval(timer);
      motion.removeEventListener("change", sync);
      document.removeEventListener("portfolio:motion-change", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, [epithets.length]);

  return (
    <span className="hero-epithets">
      <span className="sr-only">{epithets[0] ?? ""}</span>
      <span className="hero-epithets__visual" aria-hidden="true">
        {epithets.map((epithet, wordIndex) => (
          <span key={`${wordIndex}-${epithet}`} data-active={index === wordIndex}
            className="hero-epithet animated-colors__gradient bg-clip-text text-transparent">
            {epithet}
          </span>
        ))}
      </span>
    </span>
  );
};

export default HeroEpithets;
