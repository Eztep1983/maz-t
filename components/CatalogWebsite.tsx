"use client";

import { useState, useEffect} from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductGrid from "./ProductGrid";
import ContactForm from "./ContactForm";
import Cart from "./Cart";
import AboutUs from "./AboutUs";
import { Menu, X, Phone, Mail, MapPin, Facebook, Instagram, Star, StarHalf, Send, LogIn } from "lucide-react";



const CatalogWebsite = () => {
  const [activeSection, setActiveSection] = useState("catalog");
  const [menuOpen, setMenuOpen] = useState(false);
  const cloudinaryBaseURL = "https://res.cloudinary.com/dzqm5gmyg/image/upload";
  const publicId = "company-items/logotipoTmaz";
  const imageUrl = `${cloudinaryBaseURL}/${publicId}`;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
const [showReviewForm, setShowReviewForm] = useState(false);
const [reviews, setReviews] = useState([
  {
    id: 1,
    name: "María García",
    photoUrl: "/api/placeholder/48/48",
    rating: 5,
    comment: "¡Excelente servicio! Los toners son de muy buena calidad.",
    date: "2024-02-10",
    verified: true
  },
  {
    id: 2,
    name: "Juan Pérez",
    photoUrl: "/api/placeholder/48/48",
    rating: 4,
    comment: "Buen producto, entrega rápida. Recomendado.",
    date: "2024-02-09",
    verified: true
  }
]);
const [newReview, setNewReview] = useState({
  rating: 5,
  comment: ""
});

const handleSubmitReview = (e: React.FormEvent) => {
  e.preventDefault();
  const review = {
    id: reviews.length + 1,
    name: "Usuario Google", // Would come from Google profile
    photoUrl: "/api/placeholder/48/48", // Would come from Google profile
    rating: newReview.rating,
    comment: newReview.comment,
    date: new Date().toISOString().split('T')[0],
    verified: true
  };
  setReviews([review, ...reviews]);
  setNewReview({ rating: 5, comment: "" });
  setShowReviewForm(false);
};
    const handleReload = () => {
      window.location.reload();
    };
  const testimonials = [
    {
      id: 1,
      name: "John Doe",
      comment: "Excellent products and service!",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Cart />

      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
    <div className="flex items-center" onClick={handleReload} style={{ cursor: 'pointer' }}>
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
                    ? "Opiniones"
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
                  ? "Opiniones"
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
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-black">Opiniones</h2>
                <button
                  onClick={() => setIsLoggedIn(true)} // This would be replaced with actual Google auth
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-azul-oscuro transition-colors"
                >
                  <LogIn size={20} />
                  <span>Iniciar con Google</span>
                </button>
              </div>

              {/* Review Form */}
              {showReviewForm && (
                <motion.form
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg shadow-md p-6 mb-6"
                  onSubmit={handleSubmitReview}
                >
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Calificación</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReview({ ...newReview, rating: star })}
                          className={`${
                            star <= newReview.rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        >
                          <Star size={24} fill={star <= newReview.rating ? "currentColor" : "none"} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Tu opinión</label>
                    <textarea
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={4}
                      placeholder="Comparte tu experiencia..."
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Send size={20} />
                      Publicar
                    </button>
                  </div>
                </motion.form>
              )}

              {/* Reviews Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviews.map((review) => (
                  <motion.div
                    key={review.id}
                    className="bg-white rounded-lg shadow-md p-6"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="flex items-center mb-4">
                      <img
                        src={review.photoUrl}
                        alt={review.name}
                        className="h-12 w-12 rounded-full"
                      />
                      <div className="ml-4">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{review.name}</h3>
                          {review.verified && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              Verificado
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="flex text-yellow-400">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} size={16} fill="currentColor" />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500 ml-2">{review.date}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeSection === "contact" && <ContactForm key="contact" />}
          {activeSection === "about" && <AboutUs key="about" />}
        </AnimatePresence>
      </main>
      {/* Footer */}
      <footer className="bg-gradient-to-b from-gray-50 via-slate-100 to-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4 text-slate-800">Contacto</h3>
              <div className="flex items-center space-x-3 text-slate-700 group">
                <Phone className="group-hover:text-blue-600" size={20} />
                <span className="group-hover:text-blue-600">+57 (314) 784-5883</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-700 group">
                <Mail className="group-hover:text-blue-600" size={20} />
                <span className="group-hover:text-blue-600">serviciotecnicokonicaminolta@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-700 group">
                <MapPin className="group-hover:text-blue-600" size={20} />
                <span className="group-hover:text-blue-600">San Juan De Pasto, Nariño Colombia</span>
              </div>
            </div>

            {/* Business Hours */}
            <div className="relative">
              <h3 className="text-lg font-semibold mb-4 text-slate-800">Horario de Atención</h3>
              <div className="space-y-2">
                <p className="text-slate-700">Lunes - Viernes: 9:30am - 12:00pm | 2:40pm - 6:30pm</p>
                <p className="text-slate-700">Sábado: 9:00 - 14:00</p>
                <p className="text-slate-700">Domingo: Cerrado</p>
              </div>
            </div>

            {/* Social Media */}
            <div className="relative">
              <h3 className="text-lg font-semibold mb-4 text-slate-800">Síguenos</h3>
              <div className="flex space-x-4">
                <a href="https://www.facebook.com/konica.minolta.7140" target= 'blank'className="text-slate-700 hover:text-blue-600 transition-colors">
                  <Facebook size={24} />
                </a>
                <a href="#" target= 'blank' className="text-slate-700 hover:text-pink-600 transition-colors">
                  <Instagram size={24} />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom section with darker background */}
          <div className="mt-8 pt-4 border-t border-slate-300">
              <p className="text-center text-sm transition-colors text-white">
                © {new Date().getFullYear()} TMAZ Quality Toner. Todos los derechos reservados.
              </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CatalogWebsite;