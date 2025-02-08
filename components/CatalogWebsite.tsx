"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductGrid from "./ProductGrid";
import ContactForm from "./ContactForm";
import Cart from "./Cart";
import AboutUs from "./AboutUs";
import { Menu, X } from "lucide-react";

const CatalogWebsite = () => {
  const [activeSection, setActiveSection] = useState("catalog");
  const [menuOpen, setMenuOpen] = useState(false);

  const cloudinaryBaseURL = "https://res.cloudinary.com/dzqm5gmyg/image/upload";
  const publicId = "company-items/logotipoTmaz";
  const imageUrl = `${cloudinaryBaseURL}/${publicId}`;

  const testimonials = [
    {
      id: 1,
      name: "John Doe",
      comment: "Excellent products and service!",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Cart />

      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img
                src={imageUrl}
                alt="TonersMAZ"
                className="w-10 h-10 rounded-full shadow-lg"
              />
              <motion.div
                className="text-xl font-bold text-black ml-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                TMAZ Quality Toner
              </motion.div>
            </div>

            <div className="md:hidden">
              <button onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? (
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 180 }}
                    transition={{ duration: 0.3 }}
                  >
                    <X size={28} color="black" />
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ rotate: -180 }}
                    animate={{ rotate: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Menu size={28} color="black" />
                  </motion.div>
                )}
              </button>
            </div>

            <div className="hidden md:flex space-x-4">
              {["catalog", "testimonials", "contact", "about"].map((section) => (
                <button
                  key={section}
                  onClick={() => {
                    setActiveSection(section);
                    setMenuOpen(false);
                  }}
                  className={`px-4 py-2 rounded-md transition-all duration-300 ${
                    activeSection === section ? "bg-slate-700 text-white shadow-md scale-105" : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {section === "catalog"
                    ? "Catálogo"
                    : section === "testimonials"
                    ? "Testimonios"
                    : section === "contact"
                    ? "Contacto"
                    : section === "about"
                    ? "Sobre Nosotros"
                    : ""}
                </button>
              ))}
            </div>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-white shadow-lg py-4 flex flex-col items-center">
            {["catalog", "testimonials", "contact", "about"].map((section) => (
              <button
                key={section}
                onClick={() => {
                  setActiveSection(section);
                  setMenuOpen(false);
                }}
                className={`w-full text-center py-2 ${
                  activeSection === section ? "bg-slate-700 text-white" : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                {section === "catalog"
                  ? "Catálogo"
                  : section === "testimonials"
                  ? "Testimonios"
                  : section === "contact"
                  ? "Contacto"
                  : section === "about"
                  ? "Sobre Nosotros"
                  : ""}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {activeSection === "catalog" && (
            <motion.div
              key="catalog"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold mb-6 text-black">Nuestros productos</h2>
              <ProductGrid />
            </motion.div>
          )}

          {activeSection === "testimonials" && (
            <motion.div
              key="testimonials"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold mb-6 text-black">Testimonios</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {testimonials.map((testimonial) => (
                  <motion.div
                    key={testimonial.id}
                    className="bg-white rounded-lg shadow-md p-6"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="flex items-center mb-4">
                      <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <h3 className="font-semibold">{testimonial.name}</h3>
                        <div className="flex text-yellow-400">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <span key={i}>★</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600">{testimonial.comment}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeSection === "contact" && <ContactForm key="contact" />}
          {activeSection === "about" && <AboutUs key="about" />}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default CatalogWebsite;