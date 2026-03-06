import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      className="navbar"
      style={{
        backdropFilter: scrolled ? "blur(24px)" : "blur(8px)",
        backgroundColor: scrolled ? "rgba(8,9,13,0.85)" : "rgba(8,9,13,0.3)",
      }}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <Link to="/" className="navbar-logo">
        <span className="logo-text">SUGOI</span>
        <span className="logo-sub">アニメ</span>
      </Link>
      <div className="navbar-links">
        <NavLink to="/" label="HOME" active={location.pathname === "/"} />
        <NavLink to="/css-showcase" label="CSS" active={location.pathname === "/css-showcase"} />
      </div>
    </motion.nav>
  );
}

function NavLink({ to, label, active }: { to: string; label: string; active: boolean }) {
  return (
    <Link to={to} className={`nav-link ${active ? "active" : ""}`}>
      {label}
      <motion.div
        className="nav-underline"
        initial={false}
        animate={{ scaleX: active ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />
    </Link>
  );
}
