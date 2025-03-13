// TestimonialsSection.jsx
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../services/firebaseConfig'; // Adjust the path to your Firebase config
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LogIn, User, Star, Send, MessageSquare, CheckCircle, 
  MessageCircle, ChevronUp, ChevronDown, ChevronLeft, 
  ChevronRight, ArrowUp 
} from 'lucide-react';

interface Review {
  id: string;
  name?: string;
  photoUrl?: string;
  rating: number;
  comment: string;
  date?: string;
  dateString?: string;
  verified?: boolean;
}

interface Reply {
  id: string;
  userName?: string;
  photoUrl?: string;
  text: string;
  date?: string;
  dateString?: string;
}

interface User {
  photoURL?: string;
  displayName?: string;
}

interface TestimonialsSectionProps {
  user?: User | null;
  reviews?: Review[];
  loadingReviews?: boolean;
  handleLoginClick?: () => void;
  handleLogout?: () => void;
  handleSubmitReview?: (review: { rating: number; comment: string }) => Promise<void>;
  handleReplySubmit?: (reviewId: string, replyText: string) => Promise<void>;
  avatar?: string;
  isStandalone?: boolean;
  sortOptions?: string[];
  initialSortBy?: string;
  className?: string;
  id?: string;
}

const fetchReviews = async () => {
  const reviewsCollection = collection(db, 'reviews');
  const q = query(reviewsCollection, orderBy('date', 'desc'));
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
};

const fetchReplies = async (reviewId: string) => {
  const repliesCollection = collection(db, `reviews/${reviewId}/replies`);
  const q = query(repliesCollection, orderBy('date', 'asc'));
  const querySnapshot = await getDocs(q);
  const replies = querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      userName: data.userName || '',
      photoUrl: data.photoUrl || '',
      text: data.text || '',
      date: data.date || '',
      dateString: data.dateString || ''
    };
  });
  return replies;
};

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  user = null,
  reviews = [],
  loadingReviews = false,
  handleLoginClick = () => {},
  handleLogout = () => {},
  handleSubmitReview = async () => {},
  handleReplySubmit = async () => {},
  avatar = '/avatar.png',
  isStandalone = false,
  sortOptions = ["date", "rating", "verified"],
  initialSortBy = "date",
  className = "",
  id = "testimonials-section"
}) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReplySubmitting, setIsReplySubmitting] = useState<Record<string, boolean>>({});
  const [expandedReplies, setExpandedReplies] = useState<Record<string, boolean>>({});
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [repliesMap, setRepliesMap] = useState<Record<string, Reply[]>>({});
  const [fetchedReviews, setFetchedReviews] = useState<Review[]>([]);

  const ITEMS_PER_PAGE = 6;
  const INITIAL_REPLIES_SHOWN = 2;
  const indexOfLastReview = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstReview = indexOfLastReview - ITEMS_PER_PAGE;
  const currentReviews = fetchedReviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(fetchedReviews.length / ITEMS_PER_PAGE);

  useEffect(() => {
    const loadReviews = async () => {
      setIsLoadingReviews(true);
      const fetchedReviews = await fetchReviews();
      setFetchedReviews(fetchedReviews);
      setIsLoadingReviews(false);
    };

    loadReviews();
  }, []);

  useEffect(() => {
    const loadReplies = async () => {
      const repliesMap: Record<string, Reply[]> = {};
      for (const review of fetchedReviews) {
        const replies = await fetchReplies(review.id);
        repliesMap[review.id] = replies;
      }
      setRepliesMap(repliesMap);
    };

    if (fetchedReviews.length > 0) {
      loadReplies();
    }
  }, [fetchedReviews]);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    if (isStandalone) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(id);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleRepliesExpansion = (reviewId: string) => {
    setExpandedReplies(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  const formatDate = (date: string | undefined) => {
    if (!date) return '';
    try {
      return new Date(date).toLocaleDateString();
    } catch (error) {
      return '';
    }
  };

  const handleReviewSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await handleSubmitReview(newReview);
      setNewReview({ rating: 0, comment: '' });
      setShowReviewForm(false);
      const updatedReviews = await fetchReviews();
      setFetchedReviews(updatedReviews);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReply = async (reviewId: string) => {
    setIsReplySubmitting(prev => ({ ...prev, [reviewId]: true }));
    try {
      await handleReplySubmit(reviewId, replyText);
      setReplyText('');
      setActiveReplyId(null);
      const updatedReplies = await fetchReplies(reviewId);
      setRepliesMap(prev => ({ ...prev, [reviewId]: updatedReplies }));
    } finally {
      setIsReplySubmitting(prev => ({ ...prev, [reviewId]: false }));
    }
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
    <Container key="testimonials" {...containerProps} id={id}>
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
            {!user ? (
              <button
                onClick={handleLoginClick}
                className="flex items-center justify-center text-black gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors w-full md:w-auto"
                aria-label="Iniciar sesión con Google"
                type="button"
              >
                <LogIn size={20} />
                <span>Opinar con Google</span>
              </button>
            ) : (
              <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                {user.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt={user.displayName || 'Usuario'} 
                    className="w-8 h-8 rounded-full border-2 border-white shadow-lg" 
                    onError={(e) => { 
                      const target = e.currentTarget;
                      target.onerror = null; 
                      target.src = avatar;
                    }} 
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full border-2 border-white shadow-lg bg-gray-200 flex items-center justify-center">
                    <User size={16} />
                  </div>
                )}
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full md:w-auto"
                  type="button"
                >
                  Escribir opinión
                </button>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-gray-800 w-full md:w-auto"
                  type="button"
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
                onChange={(e) => setNewReview((prev) => ({ ...prev, comment: e.target.value }))}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                rows={4}
                placeholder="Comparte tu experiencia..."
                required
                maxLength={500}
              />
              <div className="text-xs text-gray-500 mt-1">
                {newReview.comment.length}/500 caracteres
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
                      <div className="h-12 w-12 rounded-full border-2 border-white shadow-lg overflow-hidden flex-shrink-0 bg-gray-200">
                        {review.photoUrl ? (
                          <img
                            src={review.photoUrl}
                            alt={review.name || 'Usuario anónimo'}
                            className="h-full w-full object-cover"
                            onError={(e) => { 
                              const target = e.currentTarget;
                              target.onerror = null; 
                              target.src = avatar;
                            }}
                            loading="lazy"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <User size={24} />
                          </div>
                        )}
                      </div>
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
                    <p className="text-gray-600 mb-4 flex-grow">
                      {review.comment}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      {user && (
                        <button
                          onClick={() => {
                            setActiveReplyId(activeReplyId === review.id ? null : review.id);
                            if (activeReplyId !== review.id) {
                              setReplyText('');
                            }
                          }}
                          className="text-sm text-gray-600 hover:text-blue-600 flex items-center gap-1"
                          type="button"
                        >
                          <MessageCircle size={16} />
                          {activeReplyId === review.id ? 'Cancelar' : 'Responder'}
                        </button>
                      )}
                    </div>
                    {activeReplyId === review.id && (
                      <div className="mt-4">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          className="w-full p-2 border rounded-lg text-black"
                          placeholder="Escribe una respuesta..."
                          rows={3}
                          maxLength={300}
                        />
                        <div className="flex justify-between mt-2">
                          <span className="text-xs text-gray-500">
                            {replyText.length}/300 caracteres
                          </span>
                          <button
                            onClick={() => handleReply(review.id)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
                            disabled={replyText.trim().length < 5 || isReplySubmitting[review.id]}
                            type="button"
                          >
                            {isReplySubmitting[review.id] ? (
                              <>
                                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                                Enviando...
                              </>
                            ) : 'Enviar respuesta'}
                          </button>
                        </div>
                      </div>
                    )}
                    {repliesMap[review.id] && repliesMap[review.id].length > 0 && (
                      <div className="mt-4 border-t pt-3">
                        <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                          <MessageSquare size={14} className="mr-1" />
                          Respuestas ({repliesMap[review.id].length})
                        </h4>
                        <div className="space-y-3">
                          {repliesMap[review.id]
                            .slice(0, expandedReplies[review.id] ? repliesMap[review.id].length : INITIAL_REPLIES_SHOWN)
                            .map((reply) => (
                              <div key={reply.id} className="pl-4 border-l-2 border-gray-200">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-200">
                                    {reply.photoUrl ? (
                                      <img
                                        src={reply.photoUrl}
                                        alt={reply.userName || 'Usuario anónimo'}
                                        className="w-full h-full object-cover"
                                        onError={(e) => { 
                                          const target = e.currentTarget;
                                          target.onerror = null; 
                                          target.src = avatar;
                                        }}
                                        loading="lazy"
                                      />
                                    ) : (
                                      <div className="h-full w-full flex items-center justify-center">
                                        <User size={12} />
                                      </div>
                                    )}
                                  </div>
                                  <span className="text-sm font-medium text-black">
                                    {reply.userName || 'Usuario anónimo'}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {reply.dateString || formatDate(reply.date)}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{reply.text}</p>
                              </div>
                            ))}
                          
                          {repliesMap[review.id].length > INITIAL_REPLIES_SHOWN && (
                            <button
                              onClick={() => toggleRepliesExpansion(review.id)}
                              className="text-sm text-blue-600 hover:text-blue-800 mt-2 flex items-center gap-1"
                              type="button"
                            >
                              {expandedReplies[review.id] 
                                ? <ChevronUp size={16} />
                                : <ChevronDown size={16} />
                              }
                              {expandedReplies[review.id] 
                                ? "Mostrar menos respuestas" 
                                : `Ver ${repliesMap[review.id].length - INITIAL_REPLIES_SHOWN} respuestas más`}
                            </button>
                          )}
                        </div>
                      </div>
                    )}
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