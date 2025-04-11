"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag, MessageSquare, Phone, Info } from "lucide-react";
import Image from "next/image";
import { onAuthStateChanged } from "firebase/auth";
import { User as FirebaseUser } from 'firebase/auth';
import { auth } from "@/services/firebaseConfig";
import Footer from "./Footer";
import ProductGrid from "./ProductGrid";
import ContactForm from "./ContactForm";
import Cart from "./Cart";
import AboutUs from "./AboutUs";
import TestimonialsSection from "./testimonials";

// Constants
const MAIN_COLOR = "rgb(32, 40, 77)";
const CLOUDINARY_BASE_URL = "https://res.cloudinary.com/dzqm5gmyg/image/upload";
const LOGO_PUBLIC_ID = "company-items/logotipoTmz";
const LOGO_URL = `${CLOUDINARY_BASE_URL}/${LOGO_PUBLIC_ID}`;

const CatalogWebsite = () => {
  // State
  const [activeSection, setActiveSection] = useState("about");
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [screenWidth, setScreenWidth] = useState(0);
  const [testimonialsPage, setTestimonialsPage] = useState(1);

  // Sections configuration
  const sections = useMemo(() => [
    { id: "about", label: "Sobre Nosotros", icon: <Info size={20} /> },
    { id: "catalog", label: "Catálogo", icon: <ShoppingBag size={20} /> },
    { id: "testimonials", label: "Opiniones", icon: <MessageSquare size={20} /> },
    { id: "contact", label: "Contacto", icon: <Phone size={20} /> },
  ], []);

  // Animation configuration
  const motionProps = useMemo(() => ({
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.5 },
  }), []);

  // Handlers
  const handleContactClick = useCallback(() => {
    setActiveSection("contact");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const toggleMenu = useCallback(() => {
    setMenuOpen(prev => !prev);
  }, []);

  const handleSectionChange = useCallback((sectionId: string) => {
    setActiveSection(sectionId);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

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

  // Render functions
  const renderSectionContent = () => {
    switch (activeSection) {
      case "catalog":
        return <ProductGrid />;
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
        return <AboutUs onContactClick={handleContactClick} />;
    }
  };

  return (
    <div 
      className="min-h-screen bg-white text-gray-900" 
      style={{ color: MAIN_COLOR }}
    >
      <Cart />

      {/* Navbar */}
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
            {/* Logo */}
            <div 
              className="flex items-center cursor-pointer hover:opacity-80 transition-opacity duration-300" 
              onClick={() => {
                setActiveSection("about");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
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

            {/* Mobile Menu Toggle */}
            <div className="md:hidden">
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

            {/* Desktop Navigation */}
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

        {/* Mobile Menu Dropdown */}
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

                {/* Close Menu Button */}
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

      {/* Main Content */}
      <main 
        className="max-w-6xl mx-auto px-4 py-8 flex-grow mt-16"
        style={{ color: MAIN_COLOR }}
      >
        <AnimatePresence mode="wait">
          <motion.div key={activeSection} {...motionProps}>
            {renderSectionContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
};

export default CatalogWebsite;