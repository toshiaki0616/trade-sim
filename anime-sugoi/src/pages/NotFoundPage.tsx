import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function NotFoundPage() {
  const codeRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!codeRef.current) return;
    // ターミナル風にタイプライター表示
    const text = "ERROR: PAGE_NOT_FOUND";
    const el = codeRef.current;
    el.textContent = "";
    let i = 0;
    const interval = setInterval(() => {
      el.textContent += text[i];
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 60);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="notfound-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="notfound-bg">
        <div className="hero-grid" />
      </div>
      <div className="notfound-content">
        <div ref={codeRef} className="notfound-code" />
        <h1 className="notfound-number">404</h1>
        <p className="notfound-message">このページは存在しません。</p>
        <motion.button
          className="back-button"
          onClick={() => navigate("/")}
          whileHover={{ x: -4 }}
        >
          ← トップへ戻る
        </motion.button>
      </div>
    </motion.div>
  );
}
