"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "./Footer";
import { Menu, X } from "lucide-react";
import ProductGrid from "./ProductGrid";
import ContactForm from "./ContactForm";
import Cart from "./Cart";
import AboutUs from "./AboutUs";
import TestimonialsSection from "./testimonials";
import Image from "next/image"; // Si estás en Next.js

const CatalogWebsite = () => {
  const [activeSection, setActiveSection] = useState("catalog");
  const [menuOpen, setMenuOpen] = useState(false);

  const cloudinaryBaseURL = "https://res.cloudinary.com/dzqm5gmyg/image/upload";
  const publicId = "company-items/logotipoTmz";
  const imageUrl = `${cloudinaryBaseURL}/${publicId}`;
  function setScreenWidth(innerWidth: number) {
    throw new Error("Function not implemented.");
  }
  

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sections = useMemo(
    () => [
      { id: "catalog", label: "Catálogo" },
      { id: "testimonials", label: "Opiniones" },
      { id: "contact", label: "Contacto" },
      { id: "about", label: "Sobre Nosotros" },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Cart />

      {/* Navbar */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center cursor-pointer" onClick={() => window.location.reload()}>
              <Image
                src={imageUrl}
                alt="TonersMAZ"
                width={50}
                height={50}
                className="rounded shadow-lg"
              />
              <motion.div
                className="text-xl font-bold text-Azul ml-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                TMAZ Quality Toner
              </motion.div>
            </div>

            {/* Menú para dispositivos móviles */}
            <div className="md:hidden">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
                className="flex items-center space-x-2"
              >
                <span className="text-black">Menú</span>
                {menuOpen ? <X size={28} color="black" /> : <Menu size={28} color="black" />}
              </button>
            </div>

            {/* Menú para pantallas grandes */}
            <div className="hidden md:flex space-x-4">
              {sections.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setActiveSection(id)}
                  className={`px-4 py-2 rounded-md transition-all duration-300 ${
                    activeSection === id
                      ? "bg-slate-700 text-white shadow-md scale-105"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                  aria-current={activeSection === id ? "page" : undefined}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Menú desplegable en dispositivos móviles */}
        {menuOpen && (
          <div
            className="md:hidden fixed inset-0 z-50 flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMenuOpen(false)} aria-hidden="true" />
            <div className="relative mt-16 bg-white shadow-xl rounded-t-xl overflow-hidden animate-slideInFromTop">
              <nav className="flex flex-col">
                {sections.map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => {
                      setActiveSection(id);
                      setMenuOpen(false);
                    }}
                    className={`w-full text-left px-6 py-4 text-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 ${
                      activeSection === id ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
                    }`}
                    aria-current={activeSection === id ? "page" : undefined}
                  >
                    <span className="flex items-center">
                      {activeSection === id && <span className="mr-2 text-blue-200">•</span>}
                      {label}
                    </span>
                  </button>
                ))}
              </nav>

              {/* Botón para cerrar menú */}
              <button
                onClick={() => setMenuOpen(false)}
                className="absolute top-2 right-2 p-2 rounded-full text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Cerrar menú"
              >
                <X size={24} />
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Contenido principal */}
      <main className="max-w-6xl mx-auto px-4 py-8 flex-grow">
        <AnimatePresence mode="wait">
          {activeSection === "catalog" && (
            <motion.div
              key="catalog"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
            >
              <center>
                <h2 className="text-2xl font-bold mb-6 text-Azul">Nuestros productos</h2>
              </center>
              <ProductGrid />
            </motion.div>
          )}
          {activeSection === "testimonials" && <TestimonialsSection key="testimonials" />}
          {activeSection === "contact" && <ContactForm key="contact" />}
          {activeSection === "about" && <AboutUs key="about" />}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
};

export default CatalogWebsite;

