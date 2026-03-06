import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "./components/layout/Navbar";
import CustomCursor from "./components/layout/CustomCursor";
import ScrollProgress from "./components/layout/ScrollProgress";
import ErrorBoundary from "./components/shared/ErrorBoundary";
import HomePage from "./pages/HomePage";

const AnimeDetailPage = lazy(() => import("./pages/AnimeDetailPage"));
const CssShowcasePage = lazy(() => import("./pages/CssShowcasePage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/anime/:id"
          element={
            <Suspense fallback={<div className="detail-loading"><div className="loading-spinner" /></div>}>
              <AnimeDetailPage />
            </Suspense>
          }
        />
        <Route
          path="/css-showcase"
          element={
            <Suspense fallback={null}>
              <CssShowcasePage />
            </Suspense>
          }
        />
        {/* 存在しないパスはすべて 404 へ */}
        <Route
          path="*"
          element={
            <Suspense fallback={null}>
              <NotFoundPage />
            </Suspense>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <div className="grain-overlay" aria-hidden="true" />
        <CustomCursor />
        <ScrollProgress />
        <Navbar />
        <AnimatedRoutes />
      </BrowserRouter>
    </ErrorBoundary>
  );
}
