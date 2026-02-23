import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // モバイルでは非表示
    if ("ontouchstart" in window) return;

    document.body.style.cursor = "none";

    const cursor = cursorRef.current;
    const canvas = trailRef.current;
    if (!cursor || !canvas) return;

    const ctx = canvas.getContext("2d")!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const trail: { x: number; y: number }[] = [];
    const MAX_TRAIL = 20;

    const onResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      gsap.to(cursor, {
        x: e.clientX - 12,
        y: e.clientY - 12,
        duration: 0.15,
        ease: "power2.out",
      });
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, .anime-card, [role=button]")) {
        gsap.to(cursor, { scale: 2, duration: 0.2 });
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, .anime-card, [role=button]")) {
        gsap.to(cursor, { scale: 1, duration: 0.2 });
      }
    };

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      trail.unshift({ x: mouseRef.current.x, y: mouseRef.current.y });
      if (trail.length > MAX_TRAIL) trail.pop();

      trail.forEach((p, i) => {
        const alpha = (1 - i / MAX_TRAIL) * 0.6;
        const size = (1 - i / MAX_TRAIL) * 6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 229, 255, ${alpha})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(animate);
    };
    animate();

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);
    window.addEventListener("resize", onResize);

    return () => {
      document.body.style.cursor = "";
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <>
      <canvas ref={trailRef} className="cursor-trail" />
      <div ref={cursorRef} className="custom-cursor" />
    </>
  );
}
