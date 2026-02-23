import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  themeColor?: string;
}

// AnimatePresence は App.tsx のルーターレベルで管理
// このコンポーネントはフラッド演出 + フェードのみ担当
export default function PageTransition({ children, themeColor = "#00e5ff" }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* カラーフラッド: ページ入場時に作品カラーが画面を覆い、消える */}
      <motion.div
        className="page-flood"
        style={{ backgroundColor: themeColor }}
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 0 }}
        transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
      />
      {children}
    </motion.div>
  );
}
