"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, Mail, MapPin, Facebook, Instagram, Star, Send, LogIn, ThumbsUp } from "lucide-react";
import { auth, signInWithGoogle, signOutUser } from '../firebaseConfig';
import { collection, addDoc, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { User } from 'firebase/auth';
import ProductGrid from "./ProductGrid";
import ContactForm from "./ContactForm";
import Cart from "./Cart";
import AboutUs from "./AboutUs";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

interface Review {
  id: string;
  name: string;
  photoUrl: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
  userId?: string;
  helpfulCount?: number;
}

const CatalogWebsite = () => {
  const [activeSection, setActiveSection] = useState("catalog");
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: ""
  });
  const [sortBy, setSortBy] = useState<"date" | "rating" | "verified">("date");
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleReviews, setVisibleReviews] = useState(4);
  const [replyText, setReplyText] = useState("");
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);

  const cloudinaryBaseURL = "https://res.cloudinary.com/dzqm5gmyg/image/upload";
  const publicId = "company-items/logotipoTmaz";
  const imageUrl = `${cloudinaryBaseURL}/${publicId}`;

  // Fetch reviews from Firestore
  useEffect(() => {
    const fetchReviews = async () => {
      const q = query(collection(db, "reviews"), orderBy("date", "desc"));
      const querySnapshot = await getDocs(q);
      const reviewsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Review[];
      setReviews(reviewsData);
    };
    fetchReviews();
  }, []);

  // Monitor auth state
  useEffect(() => {
    if (!auth) {
      console.warn('Auth not initialized yet');
      return;
    }

    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      console.log('Auth state changed:', currentUser ? 'User logged in' : 'No user');
    });

    return () => unsubscribe();
  }, []);

  // Handle login
  const handleLoginClick = async () => {
    try {
      await signInWithGoogle();
      console.log('Login successful');
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  // Handle review submission
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const reviewData = {
        name: user.displayName || 'Usuario Anónimo',
        photoUrl: user.photoURL || '/api/placeholder/48/48',
        rating: newReview.rating,
        comment: newReview.comment,
        date: new Date().toISOString().split('T')[0],
        verified: true,
        userId: user.uid
      };

      const docRef = await addDoc(collection(db, 'reviews'), reviewData);
      setReviews([{ ...reviewData, id: docRef.id }, ...reviews]);
      setNewReview({ rating: 5, comment: "" });
      setShowReviewForm(false);
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOutUser();
      setShowReviewForm(false);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Handle helpful button click
  const handleHelpfulClick = (reviewId: string) => {
    setReviews((prevReviews) =>
      prevReviews.map((review) =>
        review.id === reviewId
          ? { ...review, helpfulCount: (review.helpfulCount || 0) + 1 }
          : review
      )
    );
  };

  // Handle reply submission
  const handleReplySubmit = (reviewId: string) => {
    console.log(`Reply to ${reviewId}: ${replyText}`);
    setReplyText("");
    setActiveReplyId(null);
  };

  // Sort reviews
  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortBy === "rating") {
      return b.rating - a.rating;
    } else if (sortBy === "verified") {
      return a.verified === b.verified ? 0 : a.verified ? -1 : 1;
    }
    return 0;
  });

  // Pagination
  const reviewsPerPage = 4;
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = sortedReviews.slice(indexOfFirstReview, indexOfLastReview);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Cart />

      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center" onClick={() => window.location.reload()} style={{ cursor: 'pointer' }}>
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
                {menuOpen ? <X size={28} color="black" /> : <Menu size={28} color="black" />}
              </button>
            </div>

            <div className="hidden md:flex space-x-4">
              {["catalog", "testimonials", "contact", "about"].map((section) => (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
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
              className="bg-gradient-to-r from-blue-50 to-purple-50 py-12"
            >
              <div className="max-w-6xl mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-black mb-4 md:mb-0">Opiniones</h2>
                  <div className="flex flex-col md:flex-row items-center gap-4">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as "date" | "rating" | "verified")}
                      className="px-4 py-2 border rounded-lg w-full md:w-auto"
                    >
                      <option value="date">Más recientes</option>
                      <option value="rating">Mejor calificación</option>
                      <option value="verified">Verificadas primero</option>
                    </select>
                    {!user ? (
                      <button
                        onClick={handleLoginClick}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors w-full md:w-auto"
                      >
                        <LogIn size={20} />
                        <span>Iniciar con Google</span>
                      </button>
                    ) : (
                      <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                        <img
                          src={user.photoURL || '/api/placeholder/48/48'}
                          alt={user.displayName || 'Usuario'}
                          className="w-8 h-8 rounded-full border-2 border-white shadow-lg"
                        />
                        <button
                          onClick={() => setShowReviewForm(true)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full md:w-auto"
                        >
                          Escribir opinión
                        </button>
                        <button
                          onClick={handleLogout}
                          className="text-gray-600 hover:text-gray-800 w-full md:w-auto"
                        >
                          Cerrar sesión
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {showReviewForm && user && (
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

                {reviews.length === 0 ? (
                  <div className="text-center text-gray-500 py-12">
                    <p>No hay opiniones todavía. ¡Sé el primero en compartir tu experiencia!</p>
                  </div>
                ) : (
                  <>
                    <Carousel
                      showArrows={true}
                      showThumbs={false}
                      infiniteLoop={true}
                      autoPlay={true}
                      interval={5000}
                      stopOnHover={true}
                      className="w-full"
                      showStatus={false}
                      centerMode={true}
                      centerSlidePercentage={window.innerWidth < 768 ? 100 : 50}
                    >
                      {currentReviews.map((review) => (
                        <div key={review.id} className="bg-white rounded-lg shadow-md p-6 mx-2">
                          <div className="flex items-center mb-4">
                            <img
                              src={review.photoUrl}
                              alt={review.name}
                              className="h-12 w-12 rounded-full border-2 border-white shadow-lg"
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
                          <div className="flex items-center gap-4 mt-4">
                            <button
                              onClick={() => handleHelpfulClick(review.id)}
                              className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600"
                            >
                              <ThumbsUp size={16} />
                              <span>{review.helpfulCount || 0} útil</span>
                            </button>
                            {user && (
                              <button
                                onClick={() => setActiveReplyId(review.id)}
                                className="text-sm text-gray-600 hover:text-blue-600"
                              >
                                Responder
                              </button>
                            )}
                          </div>
                          {activeReplyId === review.id && (
                            <div className="mt-4">
                              <textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                className="w-full p-2 border rounded-lg"
                                placeholder="Escribe una respuesta..."
                              />
                              <button
                                onClick={() => handleReplySubmit(review.id)}
                                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                              >
                                Enviar
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </Carousel>

                    <div className="flex justify-center mt-6">
                      {Array.from({ length: Math.ceil(reviews.length / reviewsPerPage) }).map((_, index) => (
                        <button
                          key={index}
                          onClick={() => paginate(index + 1)}
                          className={`mx-1 px-4 py-2 rounded-lg ${
                            currentPage === index + 1
                              ? "bg-blue-600 text-white"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          {index + 1}
                        </button>
                      ))}
                    </div>
                  </>
                )}
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
                <a href="https://www.facebook.com/konica.minolta.7140" target="_blank" className="text-slate-700 hover:text-blue-600 transition-colors">
                  <Facebook size={24} />
                </a>
                <a href="#" target="_blank" className="text-slate-700 hover:text-pink-600 transition-colors">
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