// components/CatalogWebsite.tsx

"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag, MessageSquare, Phone, Info } from "lucide-react";
import Image from "next/image";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth } from "../services/firebaseConfig";
import Footer from "./Footer";
import ProductGrid from "./ProductGrid";
import ContactForm from "./ContactForm";
import Cart from "./Cart";
import AboutUs from "./AboutUs";
import TestimonialsSection from "./testimonials";

// ─── Constants ────────────────────────────────────────────────────────────────

const MAIN_COLOR = "rgb(32, 40, 77)";
const LOGO_URL = "/images/Logo.jpeg";

const MOTION_PROPS = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.5 },
} as const;

// ─── Types ────────────────────────────────────────────────────────────────────

interface AppState {
  section: string;
  product?: string;
  modalOpen?: boolean;
  catalogInit?: boolean;
}

interface Section {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export interface CatalogWebsiteProps {
  /** Product slug resolved server-side from searchParams in page.tsx */
  initialProduct?: string;
}

// ─── Static config (outside component — never recreated) ─────────────────────

const SECTIONS: Section[] = [
  { id: "about",        label: "Sobre Nosotros", icon: <Info size={20} /> },
  { id: "catalog",      label: "Catálogo",       icon: <ShoppingBag size={20} /> },
  { id: "testimonials", label: "Opiniones",       icon: <MessageSquare size={20} /> },
  { id: "contact",      label: "Contactos",       icon: <Phone size={20} /> },
];

// ─── Component ────────────────────────────────────────────────────────────────

const CatalogWebsite = ({ initialProduct }: CatalogWebsiteProps) => {
  // Always "about" on first render (matches SSR). Corrected in effect below.
    const [activeSection, setActiveSection] = useState<string>(
    initialProduct ? "catalog" : "about"
  );
  const [menuOpen, setMenuOpen]                 = useState(false);
  const [, setCurrentUser]                      = useState<FirebaseUser | null>(null);
  const [testimonialsPage, setTestimonialsPage] = useState(1);
  const [initialProductConsumed, setInitialProductConsumed] = useState(false)
  

  // ── History: bootstrap once on mount ────────────────────────────────────
useEffect(() => {
  if (!window.history.state?.catalogInit) {
    window.history.replaceState(
      {
        section: initialProduct ? "catalog" : "about",
        catalogInit: true,
      } satisfies AppState,
      "",
      window.location.href
    );
  }
}, []);// eslint-disable-line react-hooks/exhaustive-deps

  // ── History: back/forward navigation ────────────────────────────────────
useEffect(() => {
  const handlePopState = (event: PopStateEvent) => {
    const state = event.state as AppState | null;
    
    // Si retrocedemos a un estado sin productSlug, cerrar modal
    // pero quedarse en catalog
    if (state?.section) {
      setActiveSection(state.section);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  window.addEventListener('popstate', handlePopState);
  return () => window.removeEventListener('popstate', handlePopState);
}, []);

  // ── Responsive: close menu on desktop ───────────────────────────────────
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ── Firebase auth ────────────────────────────────────────────────────────
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setCurrentUser);
    return unsubscribe;
  }, []);

  // ── Reset testimonials page on section leave ─────────────────────────────
  useEffect(() => {
    if (activeSection !== "testimonials") setTestimonialsPage(1);
  }, [activeSection]);

  // ── Navigation ───────────────────────────────────────────────────────────
// Pasar callback a ProductGrid
  const handleInitialProductConsumed = useCallback(() => {
    setInitialProductConsumed(true);
  }, []);

  const handleSectionChange = useCallback((sectionId: string) => {
    window.history.pushState(
      {
        section: sectionId,
        product: sectionId === "catalog" ? initialProduct : undefined,
      } satisfies AppState,
      "",
      window.location.href
    );
    setActiveSection(sectionId);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleGoBack = useCallback(() => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      handleSectionChange("about");
    }
  }, [handleSectionChange]);

  const toggleMenu    = useCallback(() => setMenuOpen((p) => !p), []);
  const goToContact   = useCallback(() => handleSectionChange("contact"),      [handleSectionChange]);
  const goToOpiniones = useCallback(() => handleSectionChange("testimonials"), [handleSectionChange]);
  const goToCatalog   = useCallback(() => handleSectionChange("catalog"),      [handleSectionChange]);

  // ── Render section content ───────────────────────────────────────────────

  const renderSectionContent = () => {
    switch (activeSection) {
      case "catalog":
        return               <ProductGrid
            // ↓ Después de cerrar el modal, esto será null para siempre
            initialProductSlug={initialProductConsumed ? null : initialProduct}
            onInitialProductConsumed={handleInitialProductConsumed}
          />;
      case "testimonials":
        return (
          <TestimonialsSection
            currentPage={testimonialsPage}
            setCurrentPage={setTestimonialsPage}
          />
        );
      case "contact":
        return <ContactForm />;
      case "about":
      default:
        return (
          <AboutUs
            onContactClick={goToContact}
            onProductClick={goToCatalog}
            onTestimonialsClick={goToOpiniones}
          />
        );
    }
  };

  // ── JSX ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-white text-gray-900" style={{ color: MAIN_COLOR }}>
      <Cart />

      {/* Navigation */}
      <nav
        className="fixed top-0 left-0 right-0 z-40 shadow-lg"
        style={{ backgroundColor: MAIN_COLOR, color: "white" }}
        aria-label="Navegación principal"
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">

            {/* Logo — semantic button for accessibility */}
            <button
              className="flex items-center hover:opacity-80 transition-opacity duration-300
                focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
              onClick={() => handleSectionChange("about")}
              aria-label="Ir al inicio"
            >
              <Image
                src={LOGO_URL}
                alt="Logo de TMAZ Quality Toner"
                width={50}
                height={50}
                className="rounded shadow-lg"
                priority
              />
              <motion.span
                className="text-xl font-bold ml-2 text-white"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                TMAZ Quality Toner
              </motion.span>
            </button>

            {/* Mobile controls */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={handleGoBack}
                className="text-white p-2 rounded-full hover:bg-white/20 transition-colors
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                aria-label="Volver"
              >
                ←
              </button>

              <button
                onClick={toggleMenu}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
                className="flex items-center gap-2 text-white hover:text-gray-200
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded px-2 py-1"
              >
                <span>Menú</span>
                {menuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>

            {/* Desktop nav */}
            <div className="hidden md:flex space-x-4" role="menubar">
              {SECTIONS.map(({ id, label, icon }) => (
                <button
                  key={id}
                  role="menuitem"
                  onClick={() => handleSectionChange(id)}
                  aria-current={activeSection === id ? "page" : undefined}
                  className={`px-4 py-2 rounded-md transition-all duration-300 flex items-center gap-2
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                    activeSection === id
                      ? "bg-white text-[rgb(32,40,77)] font-bold"
                      : "text-white hover:bg-white/20"
                  }`}
                >
                  <span aria-hidden="true">{icon}</span>
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile menu overlay */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="md:hidden fixed inset-0 z-50 flex flex-col"
              role="dialog"
              aria-modal="true"
              aria-label="Menú de navegación"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Backdrop */}
              <div
                className="absolute inset-0 backdrop-blur-sm"
                style={{ backgroundColor: "rgba(32, 40, 77, 0.5)" }}
                onClick={toggleMenu}
                aria-hidden="true"
              />

              {/* Slide-up drawer */}
              <motion.div
                className="relative mt-16 bg-white shadow-2xl rounded-t-xl overflow-hidden"
                style={{
                  borderTop: `4px solid ${MAIN_COLOR}`,
                  boxShadow: "0 -10px 20px rgba(32, 40, 77, 0.1)",
                }}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25 }}
              >
                <nav id="mobile-menu" aria-label="Secciones">
                  {SECTIONS.map(({ id, label, icon }) => (
                    <button
                      key={id}
                      onClick={() => handleSectionChange(id)}
                      aria-current={activeSection === id ? "page" : undefined}
                      className={`w-full text-left px-6 py-4 text-lg font-medium transition-colors duration-200
                        flex items-center gap-3 focus:outline-none focus-visible:ring-inset
                        focus-visible:ring-2 focus-visible:ring-[rgb(32,40,77)] ${
                        activeSection === id
                          ? "bg-[rgb(32,40,77)] text-white"
                          : "text-[rgb(32,40,77)] hover:bg-gray-100"
                      }`}
                    >
                      <span aria-hidden="true">{icon}</span>
                      <span>{label}</span>
                    </button>
                  ))}
                </nav>

                <button
                  onClick={toggleMenu}
                  className="absolute top-2 right-2 p-2 rounded-full hover:bg-gray-200
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(32,40,77)]"
                  style={{ color: MAIN_COLOR }}
                  aria-label="Cerrar menú"
                >
                  <X size={24} />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main content */}
      <main
        className="max-w-6xl mx-auto px-4 py-8 flex-grow mt-16"
        style={{ color: MAIN_COLOR }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            {...MOTION_PROPS}
            className="flex flex-col items-center"
          >
            {renderSectionContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
};

export default CatalogWebsite;