import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface Props {
  enabled: boolean;
}

export default function GlitchEffect({ enabled }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled || !overlayRef.current) return;
    const el = overlayRef.current;

    const glitch = () => {
      const tl = gsap.timeline();
      tl.to(el, { opacity: 0.3, scaleX: 1.01, x: -3, duration: 0.05 })
        .to(el, { opacity: 0.1, scaleX: 0.99, x: 5, duration: 0.05 })
        .to(el, { opacity: 0, scaleX: 1, x: 0, duration: 0.1 });
    };

    const interval = setInterval(() => {
      if (Math.random() > 0.7) glitch();
    }, 3000);

    return () => clearInterval(interval);
  }, [enabled]);

  if (!enabled) return null;

  return <div ref={overlayRef} className="glitch-overlay" />;
}
