import { collection, query, getDocs, orderBy, limit, Timestamp } from 'firebase/firestore';
import { FcGoogle } from 'react-icons/fc';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, User as FirebaseUser } from 'firebase/auth';
import { db, auth } from '../services/firebaseConfig';
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { loadReCaptcha } from 'react-recaptcha-v3';
import { 
  LogIn, User, Star, Send, MessageSquare, CheckCircle, 
  MessageCircle, ChevronUp, ChevronDown, ChevronLeft, 
  ChevronRight, ArrowUp 
} from 'lucide-react';
import DOMPurify from 'dompurify';
import { onAuthStateChanged } from 'firebase/auth';
import { addDoc } from 'firebase/firestore';

interface Review {
  id: string;
  name?: string;
  photoUrl?: string;
  rating: number;
  comment: string;
  date?: string | Timestamp;
  dateString?: string;
  verified?: boolean;
}

interface TestimonialsSectionProps {
  user?: FirebaseUser | null;
  reviews?: Review[];
  loadingReviews?: boolean;
  avatar?: string;
  isStandalone?: boolean;
  sortOptions?: string[];
  initialSortBy?: string;
  className?: string;
  id?: string;
  maxQueryLimit?: number;
  isAdmin?: boolean;
}

const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ccc'%3E%3Ccircle cx='12' cy='12' r='12' fill='%23f0f0f0'/%3E%3Cpath d='M12 14c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4zm0 2c-2.7 0-8 1.3-8 4v1h16v-1c0-2.7-5.3-4-8-4z' fill='%23bbb'/%3E%3C/svg%3E";

const fetchReviews = async (maxLimit = 100, sortByField = 'date', sortDirection = 'desc') => {
  try {
    const reviewsCollection = collection(db, 'reviews');
    const q = query(
      reviewsCollection, 
      orderBy(sortByField, sortDirection === 'asc' ? 'asc' : 'desc'),
      limit(maxLimit)
    );
    
    const querySnapshot = await getDocs(q);
    const reviews = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || '',
        photoUrl: data.photoUrl || '',
        rating: data.rating || 0,
        comment: data.comment || '',
        date: data.date || '',
        dateString: data.dateString || '',
        verified: data.verified || false
      };
    });
    return reviews;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
};


const sanitizeText = (text: string): string => {
  return DOMPurify.sanitize(text.trim().substring(0, 500));
};

const formatDate = (dateInput: string | Timestamp | undefined) => {
  if (!dateInput) return 'N/A';
  
  try {
    if (typeof dateInput === 'object' && 'seconds' in dateInput) {
      return new Date(dateInput.seconds * 1000).toLocaleDateString();
    }
    
    const date = new Date(String(dateInput));
    return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString();
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'N/A';
  }
};

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  user = null,
  reviews = [],
  loadingReviews = false,
  avatar = DEFAULT_AVATAR,
  isStandalone = false,
  sortOptions = ["date", "rating", "verified"],
  initialSortBy = "date",
  className = "",
  id = "testimonials-section",
  maxQueryLimit = 100,
  isAdmin = false
}) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [fetchedReviews, setFetchedReviews] = useState<Review[]>([]);
  const [error, setError] = useState<string | null>(null);

  const ITEMS_PER_PAGE = 6;
  const MAX_REVIEW_LENGTH = 500;
  
  useEffect(() => {
    loadReCaptcha(process.env.REACT_APP_RECAPTCHA_SITE_KEY);
  }, []);
  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Se canceló el inicio de sesión, Por favor, inténtalo de nuevo:", error);
      setError("Se canceló el inicio de sesión, Por favor, inténtalo de nuevo:");
    }
  };
  
  const handleGoogleLogout = async () => {
    try {
      await signOut(auth);
      setShowReviewForm(false);
      setError(null);
      console.log("Sesión cerrada correctamente");
    } catch (error) {
      console.error("Error detallado al cerrar sesión:", error);
      setError(`Error al cerrar sesión: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  };

  const handleSubmitReview = async (reviewData: { rating: number; comment: string }) => {
    if (!currentUser) {
      setError("Debes iniciar sesión para enviar una opinión");
      return;
    }
  
    try {
      const docRef = await addDoc(collection(db, 'reviews'), {
        name: currentUser.displayName,
        photoUrl: currentUser.photoURL,
        rating: reviewData.rating,
        comment: reviewData.comment,
        date: Timestamp.now(),
        verified: false
      });
      return docRef;
    } catch (error) {
      console.error("Error adding review: ", error);
      throw error;
    }
  };

  const getSortedReviews = useCallback(() => {
    return [...fetchedReviews].sort((a, b) => {
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      } else if (sortBy === 'verified') {
        return (b.verified ? 1 : 0) - (a.verified ? 1 : 0);
      } else {
        const dateA = a.date ? new Date(a.date as string).getTime() : 0;
        const dateB = b.date ? new Date(b.date as string).getTime() : 0;
        return dateB - dateA;
      }
    });
  }, [fetchedReviews, sortBy]);
  
  const sortedReviews = getSortedReviews();
  const indexOfLastReview = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstReview = indexOfLastReview - ITEMS_PER_PAGE;
  const currentReviews = sortedReviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(sortedReviews.length / ITEMS_PER_PAGE);

  const loadReviews = useCallback(async () => {
    setIsLoadingReviews(true);
    setError(null);
    try {
      const fetchedReviews = await fetchReviews(maxQueryLimit);
      setFetchedReviews(fetchedReviews);
    } catch (err) {
      console.error("Failed to load reviews:", err);
      setError("Failed to load reviews. Please try again later.");
    } finally {
      setIsLoadingReviews(false);
    }
  }, [maxQueryLimit]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    if (isStandalone) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleReviewSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newReview.rating < 1 || newReview.rating > 5) {
      return;
    }
    
    const sanitizedComment = sanitizeText(newReview.comment);
    if (sanitizedComment.length < 10) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      await handleSubmitReview({
        rating: newReview.rating,
        comment: sanitizedComment
      });
      setNewReview({ rating: 0, comment: '' });
      setShowReviewForm(false);
      await loadReviews();
    } catch (error) {
      console.error("Error submitting review:", error);
      setError("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const renderUserImage = (photoUrl?: string, name?: string, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClass = {
      sm: 'w-6 h-6',
      md: 'w-8 h-8',
      lg: 'w-12 h-12'
    };
    
    const userIconSize = {
      sm: 12,
      md: 16,
      lg: 24
    };
    
    return (
      <div className={`${sizeClass[size]} rounded-full border-2 border-white shadow-lg overflow-hidden flex-shrink-0 bg-gray-200 flex items-center justify-center`}>
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={name || 'Usuario'}
            className="h-full w-full object-cover"
            onError={(e) => { 
              const target = e.currentTarget;
              target.onerror = null; 
              target.src = avatar || DEFAULT_AVATAR;
            }}
            loading="lazy"
          />
        ) : (
          <User size={userIconSize[size]} />
        )}
      </div>
    );
  };

  const Container = isStandalone ? React.Fragment : motion.div;
  const containerProps = isStandalone ? {} : {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.5 },
    className: `bg-gradient-to-r from-blue-50 to-purple-50 py-12 ${className}`
  };

  return (
    <Container {...containerProps} id={id}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-Azul mb-4 md:mb-0">Opiniones</h2>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border rounded-lg w-full md:w-auto text-black"
              aria-label="Ordenar opiniones por"
            >
              {sortOptions.map(option => (
                <option key={option} value={option}>
                  {option === "date" ? "Más recientes" : option === "rating" ? "Mejor calificación" : "Verificadas primero"}
                </option>
              ))}
            </select>
            {!currentUser ? (
              <button
                onClick={handleGoogleLogin}
                className="flex items-center justify-center text-black gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors w-full md:w-auto"
                aria-label="Iniciar sesión con Google"
                type="button"
              >
                <FcGoogle className="w-5 h-5" />
                <span>Opinar con Google</span>
              </button>
              ) : (
                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                {renderUserImage(currentUser.photoURL ?? undefined, currentUser.displayName ?? undefined, 'md')}
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full md:w-auto"
                  type="button"
                >
                  Escribir opinión
                </button>
                <button
                  onClick={handleGoogleLogout}
                  className="px-4 py-2 text-red-600 hover:text-red-800 border border-red-200 rounded-lg hover:bg-red-50 transition-colors w-full md:w-auto"
                  type="button"
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 relative" role="alert">
            <span className="block sm:inline">{error}</span>
            <button 
              type="button" 
              className="absolute top-0 right-0 px-4 py-3"
              onClick={() => setError(null)}
            >
              <span className="text-red-500">&times;</span>
            </button>
          </div>
        )}

        {showReviewForm && currentUser && (
          <motion.form
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-6 mb-6"
            onSubmit={handleReviewSubmission}
          >
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-black">Calificación</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewReview((prev) => ({ ...prev, rating: star }))}
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
              <label htmlFor="reviewComment" className="block text-sm font-medium mb-2 text-black">Tu opinión</label>
              <textarea
                id="reviewComment"
                value={newReview.comment}
                onChange={(e) => setNewReview((prev) => ({ 
                  ...prev, 
                  comment: e.target.value.substring(0, MAX_REVIEW_LENGTH)
                }))}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                rows={4}
                placeholder="Comparte tu experiencia..."
                required
                maxLength={MAX_REVIEW_LENGTH}
              />
              <div className="text-xs text-gray-500 mt-1">
                {newReview.comment.length}/{MAX_REVIEW_LENGTH} caracteres
              </div>
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
                disabled={isSubmitting || newReview.comment.trim().length < 10 || newReview.rating === 0}
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Publicar
                  </>
                )}
              </button>
            </div>
          </motion.form>
        )}

        {isLoadingReviews ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : fetchedReviews.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            <MessageSquare size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No hay opiniones todavía. ¡Sé el primero en compartir tu experiencia!</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentReviews.map((review) => (
                <motion.div
                  key={review.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-white rounded-lg shadow-md p-6 h-full flex flex-col">
                    <div className="flex items-center mb-4">
                      {renderUserImage(review.photoUrl, review.name, 'lg')}
                      <div className="ml-4">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-black">
                            {review.name || 'Usuario anónimo'}
                          </h3>
                          {review.verified && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex items-center">
                              <CheckCircle size={12} className="mr-1" />
                              Verificado
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="flex text-yellow-400" aria-label={`Calificación: ${review.rating} de 5 estrellas`}>
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star 
                                key={i} 
                                size={16} 
                                fill={i < review.rating ? "currentColor" : "none"}
                                stroke={i < review.rating ? "currentColor" : "currentColor"}
                                className={i < review.rating ? "text-yellow-400" : "text-gray-300"}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500 ml-2">
                            {review.dateString || formatDate(review.date)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4 flex-grow whitespace-pre-line">
                      {DOMPurify.sanitize(review.comment)}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {totalPages > 1 && (
              <nav aria-label="Paginación de opiniones" className="mt-8">
                <ul className="flex justify-center flex-wrap gap-2">
                  <li>
                    <button
                      onClick={() => paginate(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="flex items-center px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Página anterior"
                      type="button"
                    >
                      <ChevronLeft size={16} />
                    </button>
                  </li>
                  
                  {Array.from({ length: totalPages }).map((_, index) => {
                    const pageNumber = index + 1;
                    const showPage = pageNumber === 1 || pageNumber === totalPages || 
                                    Math.abs(pageNumber - currentPage) <= 1;
                    const showEllipsisBefore = pageNumber === currentPage - 2 && currentPage > 3;
                    const showEllipsisAfter = pageNumber === currentPage + 2 && currentPage < totalPages - 2;

                    if (showEllipsisBefore) {
                      return (
                        <li key={`ellipsis-before-${pageNumber}`}>
                          <span className="px-3 py-2 text-gray-500">...</span>
                        </li>
                      );
                    }
                    
                    if (showEllipsisAfter) {
                      return (
                        <li key={`ellipsis-after-${pageNumber}`}>
                          <span className="px-3 py-2 text-gray-500">...</span>
                        </li>
                      );
                    }
                    
                    if (showPage) {
                      return (
                        <li key={pageNumber}>
                          <button
                            onClick={() => paginate(pageNumber)}
                            className={`px-4 py-2 rounded-md ${
                              currentPage === pageNumber
                                ? "bg-blue-600 text-white"
                                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                            }`}
                            aria-label={`Página ${pageNumber}`}
                            aria-current={currentPage === pageNumber ? "page" : undefined}
                            type="button"
                          >
                            {pageNumber}
                          </button>
                        </li>
                      );
                    }
                    
                    return null;
                  })}
                  
                  <li>
                    <button
                      onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="flex items-center px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Página siguiente"
                      type="button"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </li>
                </ul>
              </nav>
            )}
            
            {fetchedReviews.length > 5 && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => {
                    const element = document.getElementById('testimonials-section');
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                  aria-label="Volver arriba"
                  type="button"
                >
                  <ArrowUp size={16} />
                  Volver arriba
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </Container>
  );
};

export default TestimonialsSection;