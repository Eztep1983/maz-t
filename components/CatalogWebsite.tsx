"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "./Footer";
import { User as FirebaseUser } from 'firebase/auth';
import { Menu, X } from "lucide-react";
import ProductGrid from "./ProductGrid";
import ContactForm from "./ContactForm";
import Cart from "./Cart";
import AboutUs from "./AboutUs";
import TestimonialsSection from "./testimonials";
import Image from "next/image";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/services/firebaseConfig";
import { ShoppingBag, MessageSquare, Phone, Info } from 'lucide-react';

const CatalogWebsite = () => {
  
  const [activeSection, setActiveSection] = useState("catalog");
  const [menuOpen, setMenuOpen] = useState(false);
  const [, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [, setScreenWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 0
  );
const [testimonialsPage, setTestimonialsPage] = useState(1);
  // Custom color constants
  const MAIN_COLOR = "rgb(32, 40, 77)";

  const cloudinaryBaseURL = "https://res.cloudinary.com/dzqm5gmyg/image/upload";
  const publicId = "company-items/logotipoTmz";
  const imageUrl = `${cloudinaryBaseURL}/${publicId}`;


  useEffect(() => {
    if (activeSection !== "testimonials") {
      setTestimonialsPage(1);
    }
  }, [activeSection]);
  

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  const motionProps = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.5 },
  };
  
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setCurrentUser(user);
      });
      return () => unsubscribe();
    }, []);

    const sections = useMemo(
      () => [
        { id: "catalog", label: "Catálogo", icon: <ShoppingBag size={20} /> },
        { id: "testimonials", label: "Opiniones", icon: <MessageSquare size={20} /> },
        { id: "contact", label: "Contacto", icon: <Phone size={20} /> },
        { id: "about", label: "Sobre Nosotros", icon: <Info size={20} /> },
      ],
      []
    );

  return (
    <div 
      className="min-h-screen bg-white text-gray-900" 
      style={{ 
        backgroundColor: "white", 
        color: MAIN_COLOR 
      }}
    >
      <Cart />

      {/* Navbar */}
      <nav 
        className="fixed top-0 left-0 right-0 z-40 shadow-lg" 
        style={{ 
          backgroundColor: MAIN_COLOR, 
          color: 'white' 
        }}
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div 
              className="flex items-center cursor-pointer hover:opacity-80 transition-opacity duration-300" 
              onClick={() => window.location.reload()}
            >
              <Image
                src={imageUrl}
                alt="TonersMAZ"
                width={50}
                height={50}
                className="rounded shadow-lg"
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
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
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
                  onClick={() => setActiveSection(id)}
                  className={`px-4 py-2 rounded-md transition-all duration-300 flex items-center space-x-2 ${
                    activeSection === id
                      ? "bg-white text-[rgb(32,40,77)] font-bold"
                      : "text-white hover:bg-[rgba(255,255,255,0.2)]"
                  }`}
                  aria-current={activeSection === id ? "page" : undefined}
                >
                  <span>{icon}</span>
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {menuOpen && (
          <div
            className="md:hidden fixed inset-0 z-50 flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            <div 
              className="absolute inset-0 backdrop-blur-sm" 
              style={{ backgroundColor: 'rgba(32, 40, 77, 0.5)' }} 
              onClick={() => setMenuOpen(false)} 
              aria-hidden="true" 
            />
            <div 
              className="relative mt-16 bg-white shadow-2xl rounded-t-xl overflow-hidden transform transition-transform duration-300"
              style={{ 
                borderTop: `4px solid ${MAIN_COLOR}`,
                boxShadow: '0 -10px 20px rgba(32, 40, 77, 0.1)'
              }}
            >
              <nav className="flex flex-col">
                {sections.map(({ id, label, icon }) => (
                  <button
                    key={id}
                    onClick={() => {
                      setActiveSection(id);
                      setMenuOpen(false);
                    }}
                    className={`w-full text-left px-6 py-4 text-lg font-medium transition-colors duration-200 flex items-center space-x-3 ${
                      activeSection === id 
                        ? "bg-[rgb(32,40,77)] text-white" 
                        : "text-[rgb(32,40,77)] hover:bg-gray-100"
                    }`}
                    aria-current={activeSection === id ? "page" : undefined}
                  >
                    <span>{icon}</span>
                    <span>{label}</span>
                  </button>
                ))}
              </nav>

              {/* Close Menu Button */}
              <button
                onClick={() => setMenuOpen(false)}
                className="absolute top-2 right-2 p-2 rounded-full hover:bg-gray-200 focus:outline-none"
                style={{ color: MAIN_COLOR }}
                aria-label="Cerrar menú"
              >
                <X size={24} />
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main 
        className="max-w-6xl mx-auto px-4 py-8 flex-grow mt-16"
        style={{ color: MAIN_COLOR }}
      >
        <AnimatePresence mode="wait">
          {activeSection === "catalog" && (
            <motion.div key="catalog" {...motionProps}>
              <ProductGrid />
            </motion.div>
          )}
          {activeSection === "testimonials" && (
            <motion.div key="testimonials" {...motionProps}>
              <TestimonialsSection currentPage={testimonialsPage} setCurrentPage={setTestimonialsPage} />
            </motion.div>
          )}
          {activeSection === "contact" && (
            <motion.div key="contact" {...motionProps}>
              <ContactForm />
            </motion.div>
          )}
          {activeSection === "about" && (
            <motion.div key="about" {...motionProps}>
              <AboutUs />
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      <Footer />
    </div>
  );
};

export default CatalogWebsite;