import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const glow1Ref = useRef<HTMLDivElement>(null);
  const glow2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const title = titleRef.current;
    const subtitle = subtitleRef.current;
    const eyebrow = eyebrowRef.current;
    const meta = metaRef.current;
    const bg = bgRef.current;
    if (!title || !subtitle || !eyebrow || !meta || !bg) return;

    // テキストスプリット + バネ着地
    const split = new SplitType(title, { types: "chars" });
    const chars = split.chars ?? [];

    const tl = gsap.timeline({ delay: 0.2 });
    tl.set(chars, { opacity: 0, y: 80, rotateX: -40 })
      .set([eyebrow, subtitle, meta], { opacity: 0, y: 20 })
      .to(chars, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 0.7,
        stagger: 0.055,
        ease: "back.out(1.4)",
      })
      .to(eyebrow, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, "-=0.3")
      .to(subtitle, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "-=0.3")
      .to(meta, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, "-=0.2");

    // パララックス: スクロールで背景がゆっくり上昇
    gsap.to(bg, {
      y: "35%",
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    // グロー光源がスクロールで異なる速度で動く
    gsap.to(glow1Ref.current, {
      y: "-20%",
      x: "5%",
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1.5 },
    });
    gsap.to(glow2Ref.current, {
      y: "20%",
      x: "-5%",
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 2 },
    });

    return () => {
      split.revert();
      tl.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section className="hero">
      <div ref={bgRef} className="hero-bg">
        <div className="hero-grid" />
        <div ref={glow1Ref} className="hero-glow hero-glow-1" />
        <div ref={glow2Ref} className="hero-glow hero-glow-2" />
      </div>
      <div className="hero-content">
        <div ref={eyebrowRef} className="hero-eyebrow">// ANIME CURATION SYSTEM v1.0</div>
        <h1 ref={titleRef} className="hero-title">SUGOI</h1>
        <p ref={subtitleRef} className="hero-subtitle">
          アニメの「すごい」を、<br />言葉ではなくデザインで伝える。
        </p>
        <div ref={metaRef} className="hero-meta">
          <span>15年分のキュレーション</span>
          <span className="meta-divider">|</span>
          <span>5作品</span>
        </div>
      </div>
      <div className="hero-scroll-hint">
        <span>SCROLL</span>
        <div className="scroll-line" />
      </div>
    </section>
  );
}
