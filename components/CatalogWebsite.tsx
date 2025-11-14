"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag, MessageSquare, Phone, Info } from "lucide-react";
import Image from "next/image";
import { onAuthStateChanged } from "firebase/auth";
import { User as FirebaseUser } from 'firebase/auth';
import { auth } from "../services/firebaseConfig";
import Footer from "./Footer";
import ProductGrid from "./ProductGrid";
import ContactForm from "./ContactForm";
import Cart from "./Cart";
import AboutUs from "./AboutUs";
import TestimonialsSection from "./testimonials";
import { useSearchParams } from "next/navigation";

const MAIN_COLOR = "rgb(32, 40, 77)";
const LOGO_URL = "/images/Logo.jpeg";

interface AppState {
  section: string;
  product?: string;
  modalOpen?: boolean;
}

const CatalogWebsite = ({ initialProduct }: { initialProduct?: string }) => {
  const searchParams = useSearchParams();
  const productSlug = initialProduct || searchParams.get('product');
  const [activeSection, setActiveSection] = useState(productSlug ? "catalog" : "about");
  const [menuOpen, setMenuOpen] = useState(false);
  const [, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [, setScreenWidth] = useState(0);
  const [testimonialsPage, setTestimonialsPage] = useState(1);

  const sections = useMemo(() => [
    { id: "about", label: "Sobre Nosotros", icon: <Info size={20} /> },
    { id: "catalog", label: "Catálogo", icon: <ShoppingBag size={20} /> },
    { id: "testimonials", label: "Opiniones", icon: <MessageSquare size={20} /> },
    { id: "contact", label: "Contactos", icon: <Phone size={20} /> },
  ], []);

  const motionProps = useMemo(() => ({
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.5 },
  }), []);

  // Estado inicial del historial
  useEffect(() => {
    if (typeof window === "undefined") return;
  
    if (!window.history.state?.catalogInit) {
      const initialState: AppState = { 
        section: activeSection,
        product: productSlug || undefined
      };
      window.history.replaceState(
        { ...initialState, catalogInit: true }, 
        '', 
        window.location.href
      );
    }
  
    const handlePopState = (event: PopStateEvent) => {
      const state = event.state as AppState & { catalogInit?: boolean; modalOpen?: boolean };
      
      // Si es un popstate del modal, ignorarlo (el modal lo maneja)
      if (state?.modalOpen) {
        return;
      }
      
      // Si hay un estado de sección válido, cambiar a esa sección
      if (state?.section) {
        setActiveSection(state.section);
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }, 100);
      }
    };
  
    window.addEventListener('popstate', handlePopState);
  
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [activeSection, productSlug]);

  // Handlers
  const handleContactClick = useCallback(() => {
    handleSectionChange("contact");
  }, []);

  const handleTestimonialsClick = useCallback(() => {
    handleSectionChange("testimonials");
  }, []);

  const handleProductClick = useCallback(() => {
    handleSectionChange("catalog");
  }, []);

  const toggleMenu = useCallback(() => {
    setMenuOpen(prev => !prev);
  }, []);

  // Cambiar sección y agregar al historial
  const handleSectionChange = useCallback((sectionId: string) => {
    const newState: AppState = { 
      section: sectionId,
      product: sectionId === "catalog" && productSlug ? productSlug : undefined
    };
    
    window.history.pushState(newState, '', window.location.href);
    setActiveSection(sectionId);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [productSlug]);

  // Botón de retroceso mejorado
  const handleGoBack = useCallback(() => {
    // Si hay historial previo, retroceder
    if (window.history.length > 1) {
      window.history.back();
    } else {
      // Si no hay historial, ir a about
      handleSectionChange("about");
    }
  }, [handleSectionChange]);

  // Effects
  useEffect(() => {
    if (activeSection !== "testimonials") {
      setTestimonialsPage(1);
    }
  }, [activeSection]);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
      if (window.innerWidth > 768) setMenuOpen(false);
    };

    if (typeof window !== "undefined") {
      setScreenWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const renderSectionContent = () => {
    switch (activeSection) {
      case "catalog":
        return <ProductGrid initialProductSlug={productSlug} />;
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
        return <AboutUs 
          onContactClick={handleContactClick} 
          onProductClick={handleProductClick}
          onTestimonialsClick={handleTestimonialsClick}
        />;
    }
  };

  return (
    <div 
      className="min-h-screen bg-white text-gray-900" 
      style={{ color: MAIN_COLOR }}
    >
      <Cart />

      <nav 
        className="fixed top-0 left-0 right-0 z-40 shadow-lg" 
        style={{ 
          backgroundColor: MAIN_COLOR, 
          color: 'white' 
        }}
        aria-label="Main navigation"
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div 
              className="flex items-center cursor-pointer hover:opacity-80 transition-opacity duration-300" 
              onClick={() => handleSectionChange("about")}
              aria-label="Go to home"
            >
              <Image
                src={LOGO_URL}
                alt="Tmaz Quality Toner Logo"
                width={50}
                height={50}
                className="rounded shadow-lg"
                priority
              />
              <motion.div
                className="text-xl font-bold ml-2"
                style={{ color: 'white' }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                TMAZ Quality Toner
              </motion.div>
            </div>

            <div className="md:hidden flex items-center gap-4">
              <button
                onClick={handleGoBack}
                className="text-white p-2 rounded-full hover:bg-[rgba(255,255,255,0.2)] transition-colors"
                aria-label="Volver a la sección anterior"
              >
                ←
              </button>
              
              <button
                onClick={toggleMenu}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                className="flex items-center space-x-2 text-white hover:text-gray-200"
              >
                <span>Menú</span>
                {menuOpen ? <X size={28} color="white" /> : <Menu size={28} color="white" />}
              </button>
            </div>

            <div className="hidden md:flex space-x-4">
              {sections.map(({ id, label, icon }) => (
                <button
                  key={id}
                  onClick={() => handleSectionChange(id)}
                  className={`px-4 py-2 rounded-md transition-all duration-300 flex items-center space-x-2 ${
                    activeSection === id
                      ? "bg-white text-[rgb(32,40,77)] font-bold"
                      : "text-white hover:bg-[rgba(255,255,255,0.2)]"
                  }`}
                  aria-current={activeSection === id ? "page" : undefined}
                >
                  <span aria-hidden="true">{icon}</span>
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="md:hidden fixed inset-0 z-50 flex flex-col"
              role="dialog"
              aria-modal="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div 
                className="absolute inset-0 backdrop-blur-sm" 
                style={{ backgroundColor: 'rgba(32, 40, 77, 0.5)' }} 
                onClick={toggleMenu} 
                aria-hidden="true" 
              />
              <motion.div 
                className="relative mt-16 bg-white shadow-2xl rounded-t-xl overflow-hidden"
                style={{ 
                  borderTop: `4px solid ${MAIN_COLOR}`,
                  boxShadow: '0 -10px 20px rgba(32, 40, 77, 0.1)'
                }}
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25 }}
              >
                <nav id="mobile-menu" className="flex flex-col">
                  {sections.map(({ id, label, icon }) => (
                    <button
                      key={id}
                      onClick={() => handleSectionChange(id)}
                      className={`w-full text-left px-6 py-4 text-lg font-medium transition-colors duration-200 flex items-center space-x-3 ${
                        activeSection === id 
                          ? "bg-[rgb(32,40,77)] text-white" 
                          : "text-[rgb(32,40,77)] hover:bg-gray-100"
                      }`}
                      aria-current={activeSection === id ? "page" : undefined}
                    >
                      <span aria-hidden="true">{icon}</span>
                      <span>{label}</span>
                    </button>
                  ))}
                </nav>

                <button
                  onClick={toggleMenu}
                  className="absolute top-2 right-2 p-2 rounded-full hover:bg-gray-200 focus:outline-none"
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

      <main 
        className="max-w-6xl mx-auto px-4 py-8 flex-grow mt-16"
        style={{ color: MAIN_COLOR }}
      >
        <motion.div 
          key={activeSection} 
          {...motionProps} 
          className="flex flex-col items-center"
        >
          {renderSectionContent()}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default CatalogWebsite;
