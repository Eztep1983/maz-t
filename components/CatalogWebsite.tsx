"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "./Footer";
import { Star, Send, LogIn, ThumbsUp, Menu, X } from "lucide-react";
import { auth, signInWithGoogle, signOutUser, db } from '../services/firebaseConfig';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { User } from 'firebase/auth';
import ProductGrid from "./ProductGrid";
import ContactForm from "./ContactForm";
import Cart from "./Cart";
import AboutUs from "./AboutUs";

interface Review {
  id: string;
  name: string;
  photoUrl: string;
  rating: number;
  comment: string;
  date: Date | Timestamp; // Changed to support Firestore Timestamp
  dateString?: string; // For display purposes
  verified: boolean;
  userId?: string;
  helpfulCount: number; // Changed to be always defined
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
  const [replyText, setReplyText] = useState("");
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(true);
  
  const cloudinaryBaseURL = "https://res.cloudinary.com/dzqm5gmyg/image/upload";
  const publicId = "company-items/logotipoTmz";
  const imageUrl = `${cloudinaryBaseURL}/${publicId}`;
  const [screenWidth, setScreenWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setScreenWidth(window.innerWidth);
      const handleResize = () => setScreenWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);
  
  // Fetch reviews from Firestore - improved with loading state
  useEffect(() => {
    const fetchReviews = async () => {
      setLoadingReviews(true);
      try {
        const q = query(collection(db, "reviews"), orderBy("date", "desc"));
        const querySnapshot = await getDocs(q);
        const reviewsData = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          // Convert Firestore Timestamp to JS Date for sorting
          const date = data.date instanceof Timestamp ? data.date.toDate() : new Date(data.date);
          return {
            id: doc.id,
            ...data,
            date,
            dateString: date.toISOString().split('T')[0],
            helpfulCount: data.helpfulCount || 0
          };
        }) as Review[];
        setReviews(reviewsData);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoadingReviews(false);
      }
    };
    fetchReviews();
  }, []);

  // Monitor auth state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return unsubscribe;
  }, []);
  
  // Handle login with better error handling
  const handleLoginClick = async () => {
    try {
      await signInWithGoogle();
      console.log('Login successful');
    } catch (error) {
      console.error('Login error:', error);
      alert('Error al iniciar sesión. Por favor, intenta de nuevo.');
    }
  };

  // Handle review submission - FIXED to properly use Firestore
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    if (newReview.comment.trim() === '') {
      alert('Por favor escribe tu opinión antes de enviar.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Create a Firestore Timestamp for better compatibility
      const currentDate = serverTimestamp();
      
      const reviewData = {
        name: user.displayName || 'Usuario Anónimo',
        photoUrl: user.photoURL || '/api/placeholder/48/48',
        rating: newReview.rating,
        comment: newReview.comment.trim(),
        date: currentDate,
        verified: true,
        userId: user.uid,
        helpfulCount: 0
      };

      const docRef = await addDoc(collection(db, 'reviews'), reviewData);
      
      // Now that we have the document ID, we need to add it to our local state
      // Since serverTimestamp() returns null on client, we need to use current date for display
      const now = new Date();
      
      const newReviewWithId: Review = {
        id: docRef.id,
        ...reviewData,
        date: now,
        dateString: now.toISOString().split('T')[0],
        helpfulCount: 0
      };
      
      setReviews(prevReviews => [newReviewWithId, ...prevReviews]);
      setNewReview({ rating: 5, comment: "" });
      setShowReviewForm(false);
      
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Error al enviar tu opinión. Por favor, intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle logout with better error handling
  const handleLogout = async () => {
    try {
      await signOutUser();
      setShowReviewForm(false);
    } catch (error) {
      console.error('Error during logout:', error);
      alert('Error al cerrar sesión. Por favor, intenta de nuevo.');
    }
  };

  // Handle helpful button click - FIXED to update Firestore
  const handleHelpfulClick = async (reviewId: string) => {
    if (!user) {
      alert('Debes iniciar sesión para marcar una opinión como útil.');
      return;
    }
    
    try {
      // Update in Firestore first
      const reviewRef = doc(db, 'reviews', reviewId);
      const reviewToUpdate = reviews.find(review => review.id === reviewId);
      
      if (!reviewToUpdate) return;
      
      // Increment the helpful count in Firestore
      await updateDoc(reviewRef, {
        helpfulCount: (reviewToUpdate.helpfulCount || 0) + 1
      });
      
      // Then update local state
      setReviews(prevReviews =>
        prevReviews.map(review =>
          review.id === reviewId
            ? { ...review, helpfulCount: (review.helpfulCount || 0) + 1 }
            : review
        )
      );
    } catch (error) {
      console.error('Error updating helpful count:', error);
      alert('Error al marcar como útil. Por favor, intenta de nuevo.');
    }
  };

  // Handle reply submission - FIXED to save replies in Firestore
  const handleReplySubmit = async (reviewId: string) => {
    if (!user) return;
    if (replyText.trim() === '') {
      alert('Por favor escribe una respuesta antes de enviar.');
      return;
    }
    
    try {
      // Add reply to a subcollection in Firestore
      const replyData = {
        userId: user.uid,
        userName: user.displayName || 'Usuario Anónimo',
        photoUrl: user.photoURL || '/api/placeholder/48/48',
        text: replyText.trim(),
        date: serverTimestamp()
      };
      
      await addDoc(collection(db, `reviews/${reviewId}/replies`), replyData);
      
      // Clear form and close reply interface
      setReplyText("");
      setActiveReplyId(null);
      
      // Optionally, you could fetch and display replies here
      alert('Respuesta enviada correctamente.');
      
    } catch (error) {
      console.error('Error submitting reply:', error);
      alert('Error al enviar tu respuesta. Por favor, intenta de nuevo.');
    }
  };

  // Sort reviews - OPTIMIZED with proper date handling
  const sortedReviews = useMemo(() => {
    return [...reviews].sort((a, b) => {
      if (sortBy === "date") {
        // Handle both Date objects and Timestamps
        const dateA = a.date instanceof Date ? a.date : a.date instanceof Timestamp ? a.date.toDate() : new Date(a.date);
        const dateB = b.date instanceof Date ? b.date : b.date instanceof Timestamp ? b.date.toDate() : new Date(b.date);
        return dateB.getTime() - dateA.getTime();
      }
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "verified") return a.verified === b.verified ? 0 : a.verified ? -1 : 1;
      return 0;
    });
  }, [reviews, sortBy]);
  
  // Pagination
  const reviewsPerPage = 4;
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = sortedReviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(sortedReviews.length / reviewsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Format date for display
  const formatDate = (dateInput: Date | Timestamp | string): string => {
    let date: Date;
    if (dateInput instanceof Date) {
      date = dateInput;
    } else if (typeof dateInput === 'string') {
      date = new Date(dateInput);
    } else if (dateInput instanceof Timestamp) {
      date = dateInput.toDate();
    } else {
      return 'Fecha desconocida';
    }
    
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Cart />
      {/* Navbar */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center" onClick={() => window.location.reload()} style={{ cursor: 'pointer' }}>
              <img
                src={imageUrl}
                alt="TonersMAZ"
                width={40}
                height={40}
                className="rounded-full shadow-lg"
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
              <button 
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
              >
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
                  aria-current={activeSection === section ? "page" : undefined}
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
          <div 
            className="md:hidden fixed inset-0 z-50 flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            {/* Backdrop with opacity transition */}
            <div 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setMenuOpen(false)}
              aria-hidden="true"
            />
            
            {/* Menu container with slide animation */}
            <div className="relative mt-16 bg-white shadow-xl rounded-t-xl overflow-hidden animate-slideInFromTop">
              <nav className="flex flex-col">
                {[
                  { id: "catalog", label: "Catálogo" },
                  { id: "testimonials", label: "Opiniones" },
                  { id: "contact", label: "Contacto" },
                  { id: "about", label: "Sobre Nosotros" }
                ].map((section) => (
                  <button
                    key={section.id}
                    onClick={() => {
                      setActiveSection(section.id);
                      setMenuOpen(false);
                    }}
                    className={`w-full text-left px-6 py-4 text-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 ${
                      activeSection === section.id 
                        ? "bg-blue-600 text-white" 
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    aria-current={activeSection === section.id ? "page" : undefined}
                  >
                    <span className="flex items-center">
                      {activeSection === section.id && (
                        <span className="mr-2 text-blue-200">•</span>
                      )}
                      {section.label}
                    </span>
                  </button>
                ))}
              </nav>
              
              {/* Close button */}
              <button
                onClick={() => setMenuOpen(false)}
                className="absolute top-2 right-2 p-2 rounded-full text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Close menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
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
                      className="px-4 py-2 border rounded-lg w-full md:w-auto text-black"
                      aria-label="Ordenar opiniones por"
                    >
                      <option value="date">Más recientes</option>
                      <option value="rating">Mejor calificación</option>
                      <option value="verified">Verificadas primero</option>
                    </select>
                    {!user ? (
                      <button
                        onClick={handleLoginClick}
                        className="flex items-center justify-center text-black gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors w-full md:w-auto"
                        aria-label="Iniciar sesión con Google"
                      >
                        <LogIn size={20} />
                        <span>Opinar con Google</span>
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
                            aria-label={`${star} estrellas`}
                            aria-pressed={star <= newReview.rating}
                          >
                            <Star size={24} fill={star <= newReview.rating ? "currentColor" : "none"} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="mb-4">
                      <label htmlFor="reviewComment" className="block text-sm font-medium mb-2">Tu opinión</label>
                      <textarea
                        id="reviewComment"
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
                        disabled={isSubmitting}
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Enviando...' : (
                          <>
                            <Send size={20} />
                            Publicar
                          </>
                        )}
                      </button>
                    </div>
                  </motion.form>
                )}

                {loadingReviews ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="text-center text-gray-500 py-12">
                    <p>No hay opiniones todavía. ¡Sé el primero en compartir tu experiencia!</p>
                  </div>
                ) : (
                  <React.Fragment>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {currentReviews.map((review) => (
                        <div key={review.id} className="bg-white rounded-lg shadow-md p-6">
                          <div className="flex items-center mb-4">
                            <div className="h-12 w-12 rounded-full border-2 border-white shadow-lg overflow-hidden flex-shrink-0">
                              <img
                                src={review.photoUrl}
                                alt={review.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="ml-4">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-black">{review.name}</h3>
                                {review.verified && (
                                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                    Verificado
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="flex text-yellow-400" aria-label={`Calificación: ${review.rating} de 5 estrellas`}>
                                  {[...Array(review.rating)].map((_, i) => (
                                    <Star key={i} size={16} fill="currentColor" />
                                  ))}
                                </div>
                                <span className="text-sm text-gray-500 ml-2">
                                  {review.dateString || formatDate(review.date)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-600">{review.comment}</p>
                          <div className="flex items-center gap-4 mt-4">
                            <button
                              onClick={() => handleHelpfulClick(review.id)}
                              className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600"
                              aria-label="Marcar como útil"
                            >
                              <ThumbsUp size={16} />
                              <span>{review.helpfulCount} útil</span>
                            </button>
                            {user && (
                              <button
                                onClick={() => setActiveReplyId(activeReplyId === review.id ? null : review.id)}
                                className="text-sm text-gray-600 hover:text-blue-600"
                              >
                                {activeReplyId === review.id ? 'Cancelar' : 'Responder'}
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
                                rows={3}
                              />
                              <div className="flex justify-end mt-2">
                                <button
                                  onClick={() => handleReplySubmit(review.id)}
                                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                  disabled={replyText.trim() === ''}
                                >
                                  Enviar respuesta
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {totalPages > 1 && (
                      <div className="flex justify-center mt-6">
                        {Array.from({ length: totalPages }).map((_, index) => (
                          <button
                            key={index}
                            onClick={() => paginate(index + 1)}
                            className={`mx-1 px-4 py-2 rounded-lg ${
                              currentPage === index + 1
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                            aria-label={`Página ${index + 1}`}
                            aria-current={currentPage === index + 1 ? "page" : undefined}
                          >
                            {index + 1}
                          </button>
                        ))}
                      </div>
                    )}
                  </React.Fragment>
                )}
              </div>
            </motion.div>
          )}

          {activeSection === "contact" && <ContactForm key="contact" />}
          {activeSection === "about" && <AboutUs key="about" />}
        </AnimatePresence>
      </main>
      <Footer/>
    </div>
  );
};

export default CatalogWebsite;