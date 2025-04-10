import { collection, query, orderBy, limit, Timestamp, onSnapshot, addDoc, serverTimestamp, where, setDoc, doc, getDoc } from 'firebase/firestore';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { User, Star, Send, MessageSquare, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import DOMPurify from 'dompurify';
import { auth, db } from '../services/firebaseConfig';
import { debounce } from 'lodash';

interface Review {
  id: string;
  name: string;
  email?: string;
  rating: number;
  comment: string;
  date?: Timestamp;
  verified?: boolean;
  ipAddress?: string;
  approved?: boolean;  // Added to match rules
  spam?: boolean;      // Added to match rules
}

interface TestimonialsSectionProps {
  currentPage?: number;
  setCurrentPage?: (page: number) => void;
  isStandalone?: boolean;
  sortOptions?: string[];
  initialSortBy?: string;
  className?: string;
  id?: string;
  maxQueryLimit?: number;
  moderationRequired?: boolean;
}

const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ccc'%3E%3Ccircle cx='12' cy='12' r='12' fill='%23f0f0f0'/%3E%3Cpath d='M12 14c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4zm0 2c-2.7 0-8 1.3-8 4v1h16v-1c0-2.7-5.3-4-8-4z' fill='%23bbb'/%3E%3C/svg%3E";

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  isStandalone = false,
  currentPage: propCurrentPage,
  setCurrentPage: propSetCurrentPage,
  sortOptions = ["date", "rating", "verified"],
  initialSortBy = "date",
  className = "",
  id = "testimonials-section",
  maxQueryLimit = 100,
  moderationRequired = true,
}) => {
  // Component state
  const [localCurrentPage, setLocalCurrentPage] = useState(propCurrentPage || 1);
  
  // Use local state if no external control is provided
  const currentPage = propSetCurrentPage ? (propCurrentPage || 1) : localCurrentPage;
  const setCurrentPage = useCallback((page: number) => {
    if (propSetCurrentPage) {
      propSetCurrentPage(page);
    } else {
      setLocalCurrentPage(page);
    }
  }, [propSetCurrentPage]);
  
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ 
    name: '', 
    email: '', 
    rating: 0, 
    comment: '' 
  });
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [fetchedReviews, setFetchedReviews] = useState<Review[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [remainingSubmissions, setRemainingSubmissions] = useState<number | null>(null);
  const [timeUntilReset, setTimeUntilReset] = useState<string | null>(null);

  // Configuration constants
  const ITEMS_PER_PAGE = 6;
  const MAX_REVIEW_LENGTH = 500;
  const MAX_NAME_LENGTH = 50;
  const RATE_LIMIT_PERIOD_HOURS = 24;
  const MAX_SUBMISSIONS_PER_PERIOD = 3;

  // Function to sanitize text
  const sanitizeText = useCallback((text: string): string => {
    return DOMPurify.sanitize(text.trim().substring(0, MAX_REVIEW_LENGTH));
  }, []);

  // Get user's IP address (for rate limiting purposes)
  const getUserIp = useCallback(async (): Promise<string> => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error("Error fetching IP:", error);
      return "unknown";
    }
  }, []);

  // Modified rate limit check that works with the new security rules
  const checkRateLimit = useCallback(async (ipAddress: string): Promise<{ allowed: boolean, remaining: number, resetTime?: Date }> => {
    try {
      // Use a dedicated rate limits collection instead of querying reviews
      const rateLimitRef = doc(db, 'rateLimits', ipAddress);
      const rateLimitDoc = await getDoc(rateLimitRef);
      
      const now = new Date();
      
      if (rateLimitDoc.exists()) {
        const data = rateLimitDoc.data();
        const resetTime = data.resetTime.toDate();
        
        // If reset time has passed, reset the counter
        if (resetTime < now) {
          // Create new limit period
          const newResetTime = new Date(now);
          newResetTime.setHours(now.getHours() + RATE_LIMIT_PERIOD_HOURS);
          
          await setDoc(rateLimitRef, {
            count: 1,
            resetTime: Timestamp.fromDate(newResetTime),
            lastUpdate: serverTimestamp()
          });
          
          return {
            allowed: true,
            remaining: MAX_SUBMISSIONS_PER_PERIOD - 1,
            resetTime: newResetTime
          };
        }
        
        // Check if under limit
        const submissionCount = data.count || 0;
        const remaining = MAX_SUBMISSIONS_PER_PERIOD - submissionCount;
        
        return {
          allowed: remaining > 0,
          remaining: remaining > 0 ? remaining : 0,
          resetTime: resetTime
        };
      } else {
        // First submission for this IP
        const resetTime = new Date(now);
        resetTime.setHours(now.getHours() + RATE_LIMIT_PERIOD_HOURS);
        
        await setDoc(rateLimitRef, {
          count: 1,
          resetTime: Timestamp.fromDate(resetTime),
          lastUpdate: serverTimestamp()
        });
        
        return {
          allowed: true,
          remaining: MAX_SUBMISSIONS_PER_PERIOD - 1,
          resetTime: resetTime
        };
      }
    } catch (error) {
      console.error("Error checking rate limit:", error);
      // Fallback if there's an error accessing the database
      return {
        allowed: true,
        remaining: MAX_SUBMISSIONS_PER_PERIOD
      };
    }
  }, [RATE_LIMIT_PERIOD_HOURS]);

  // Function to update the rate limit counter
  const incrementRateLimit = useCallback(async (ipAddress: string): Promise<number> => {
    try {
      const rateLimitRef = doc(db, 'rateLimits', ipAddress);
      const rateLimitDoc = await getDoc(rateLimitRef);
      
      const now = new Date();
      
      if (rateLimitDoc.exists()) {
        const data = rateLimitDoc.data();
        const resetTime = data.resetTime.toDate();
        
        // If reset time has passed, reset the counter
        if (resetTime < now) {
          const newResetTime = new Date(now);
          newResetTime.setHours(now.getHours() + RATE_LIMIT_PERIOD_HOURS);
          
          await setDoc(rateLimitRef, {
            count: 1,
            resetTime: Timestamp.fromDate(newResetTime),
            lastUpdate: serverTimestamp()
          });
          
          return MAX_SUBMISSIONS_PER_PERIOD - 1;
        }
        
        // Increment counter
        const newCount = (data.count || 0) + 1;
        await setDoc(rateLimitRef, {
          count: newCount,
          resetTime: data.resetTime,
          lastUpdate: serverTimestamp()
        }, { merge: true });
        
        return MAX_SUBMISSIONS_PER_PERIOD - newCount;
      } else {
        // First submission
        const resetTime = new Date(now);
        resetTime.setHours(now.getHours() + RATE_LIMIT_PERIOD_HOURS);
        
        await setDoc(rateLimitRef, {
          count: 1,
          resetTime: Timestamp.fromDate(resetTime),
          lastUpdate: serverTimestamp()
        });
        
        return MAX_SUBMISSIONS_PER_PERIOD - 1;
      }
    } catch (error) {
      console.error("Error updating rate limit:", error);
      return 0;
    }
  }, [RATE_LIMIT_PERIOD_HOURS]);

  // Format the time until rate limit reset
  const formatTimeUntilReset = (resetTime: Date): string => {
    const now = new Date();
    const diffMs = resetTime.getTime() - now.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${diffHrs}h ${diffMins}m`;
  };

  // Subscribe to reviews in real-time
  const subscribeToReviews = useCallback(() => {
    setIsLoadingReviews(true);
    try {
      const reviewsCollection = collection(db, 'reviews');
      const q = query(
        reviewsCollection,
        ...(moderationRequired ? [where('approved', '==', true)] : []),
        where('spam', '==', false),
        orderBy('date', 'desc'), // Siempre ordena por fecha
        limit(maxQueryLimit)
      );
  
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const reviewsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name || 'Anónimo',
          email: doc.data().email,
          rating: doc.data().rating || 0,
          comment: doc.data().comment || '',
          date: doc.data().date,
          verified: doc.data().verified || false,
          approved: doc.data().approved || false,
          spam: doc.data().spam || false
        }));
        setFetchedReviews(reviewsData);
        setIsLoadingReviews(false);
      }, (error) => {
        console.error("Error en la suscripción:", error);
        setIsLoadingReviews(false);
      });
  
      return unsubscribe;
    } catch (error) {
      console.error("Error setting up subscription:", error);
      setIsLoadingReviews(false);
      return () => {};
    }
  }, [maxQueryLimit, moderationRequired]);

  // Effect to handle subscription
  useEffect(() => {
    const unsubscribe = subscribeToReviews();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [subscribeToReviews]);

  // Update effect for when propCurrentPage changes externally
  useEffect(() => {
    if (propCurrentPage !== undefined && !propSetCurrentPage) {
      setLocalCurrentPage(propCurrentPage);
    }
  }, [propCurrentPage, propSetCurrentPage]);

  // Check rate limits on form open
  useEffect(() => {
    if (showReviewForm) {
      const checkUserRateLimit = async () => {
        const ip = await getUserIp();
        const rateLimit = await checkRateLimit(ip);
        setRemainingSubmissions(rateLimit.remaining);
        
        if (rateLimit.resetTime) {
          setTimeUntilReset(formatTimeUntilReset(rateLimit.resetTime));
          
          // Update the countdown timer every minute
          const interval = setInterval(() => {
            if (rateLimit.resetTime) {
              setTimeUntilReset(formatTimeUntilReset(rateLimit.resetTime));
            }
          }, 60000);
          
          return () => clearInterval(interval);
        }
      };
      
      checkUserRateLimit();
    }
  }, [showReviewForm, checkRateLimit, getUserIp]);

  // Function to validate email
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Updated function to submit review - works with new security rules
  const handleSubmitReview = async (reviewData: { name: string, email: string, rating: number, comment: string }) => {
    try {
      const ipAddress = await getUserIp();
      const rateLimit = await checkRateLimit(ipAddress);
      
      if (!rateLimit.allowed) {
        throw new Error(`Has alcanzado el límite de opiniones (${MAX_SUBMISSIONS_PER_PERIOD} por ${RATE_LIMIT_PERIOD_HOURS} horas). Podrás enviar más opiniones en ${rateLimit.resetTime ? formatTimeUntilReset(rateLimit.resetTime) : 'unas horas'}.`);
      }
      
      const isSpam = reviewData.comment.includes('http') || 
                    /\b(viagra|casino|loan|forex)\b/i.test(reviewData.comment) ||
                    reviewData.comment.split(' ').some(word => word.length > 30);
  
      const reviewDoc = {
        name: reviewData.name || 'Anónimo',
        email: reviewData.email || null,
        rating: reviewData.rating,
        comment: reviewData.comment,
        date: serverTimestamp(),
        verified: false,
        ipAddress: ipAddress,
        approved: !moderationRequired || !isSpam,
        spam: isSpam,
        userId: auth.currentUser?.uid || null
      };
      
      await addDoc(collection(db, 'reviews'), reviewDoc);
      
      // Update rate limit counter
      const remaining = await incrementRateLimit(ipAddress);
      return remaining;
    } catch (error) {
      console.error("Error al agregar reseña:", error);
      throw error;
    }
  };

  // Sorting and pagination
  const sortedReviews = useMemo(() => {
    return [...fetchedReviews].sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'verified') return (b.verified ? 1 : 0) - (a.verified ? 1 : 0);
      const dateA = a.date?.seconds || 0;
      const dateB = b.date?.seconds || 0;
      return dateB - dateA;
    });
  }, [fetchedReviews, sortBy]);

  const indexOfLastReview = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstReview = indexOfLastReview - ITEMS_PER_PAGE;
  const currentReviews = sortedReviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(sortedReviews.length / ITEMS_PER_PAGE);

  // Function to submit form
  const handleReviewSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser && !newReview.name) {
      setError("Por favor ingresa un nombre o inicia sesión");
      return;
    }
    
    if (newReview.rating < 1 || newReview.rating > 5) {
      setError("La calificación debe ser entre 1 y 5 estrellas");
      return;
    }
    
    if (newReview.name.trim().length > MAX_NAME_LENGTH) {
      setError(`El nombre no debe exceder ${MAX_NAME_LENGTH} caracteres`);
      return;
    }
    
    if (newReview.email && !isValidEmail(newReview.email)) {
      setError("Por favor ingresa un email válido o deja el campo vacío");
      return;
    }
    
    const sanitizedComment = sanitizeText(newReview.comment);
    if (sanitizedComment.length < 10) {
      setError("El comentario debe tener al menos 10 caracteres");
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    try {
      const remaining = await handleSubmitReview({
        name: newReview.name.trim(),
        email: newReview.email.trim(),
        rating: newReview.rating,
        comment: sanitizedComment
      });
      
      setNewReview({ name: '', email: '', rating: 0, comment: '' });
      setShowReviewForm(false);
      
      if (moderationRequired) {
        setSuccess("¡Gracias! Tu opinión será visible después de ser revisada.");
      } else {
        setSuccess("¡Reseña publicada con éxito!");
      }
      
      setRemainingSubmissions(remaining);
      setTimeout(() => setSuccess(null), 5000);
      setCurrentPage(1);
    } catch (error: any) {
      console.error("Error al enviar reseña:", error);
      setError(error.message || "Error al enviar la reseña. Por favor, inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to format date
  const formatDate = useCallback((dateInput: Timestamp | undefined): string => {
    if (!dateInput) return 'N/A';
    try {
      return new Date(dateInput.seconds * 1000).toLocaleDateString();
    } catch (error) {
      console.error('Error formateando fecha:', error);
      return 'N/A';
    }
  }, []);

  // Function to render user image
  const renderUserImage = useCallback((name: string, size: 'sm' | 'md' | 'lg' = 'md') => {
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
        <div className="h-full w-full flex items-center justify-center bg-blue-100 text-blue-700">
          {name ? name.charAt(0).toUpperCase() : <User size={userIconSize[size]} />}
        </div>
      </div>
    );
  }, []);

  // Animation container configuration
  const Container = isStandalone ? React.Fragment : motion.div;
  const containerProps = isStandalone ? {} : {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.5 },
    className: `bg-gradient-to-r from-blue-50 to-purple-50 py-12 rounded-lg ${className}`
  };

  // Pagination function
  const paginate = useCallback((pageNumber: number) => {
    // Apply page change
    setCurrentPage(pageNumber);
    
    // Optional: Scroll to component only if standalone or explicitly requested
    if (isStandalone && document.getElementById(id)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [id, isStandalone, setCurrentPage]);

  // Handle form field changes with debounce
  const handleInputChange = debounce((field: string, value: string | number) => {
    setNewReview(prev => ({ ...prev, [field]: value }));
  }, 300);

  return (
    <Container {...containerProps} id={id}>
      <div className="max-w-6xl mx-auto px-4">
        {/* Header and controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-Azul mb-4 md:mb-0">Opiniones</h2>
          <div className="flex flex-col md:flex-row items-center gap-4">
            {/* Sort selector */}
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

            {/* Write review button */}
            <button
              onClick={() => setShowReviewForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full md:w-auto flex items-center justify-center gap-2"
              type="button"
            >
              <MessageSquare size={18} />
              <span>Escribir opinión</span>
            </button>
          </div>
        </div>

        {/* Status messages */}
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

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        {/* Review form */}
        {showReviewForm && (
          <motion.form
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-6 mb-6"
            onSubmit={handleReviewSubmission}
          >
            {remainingSubmissions !== null && (
              <div className="mb-4 text-sm">
                <p className="text-gray-600">
                  Te quedan <strong>{remainingSubmissions}</strong> opiniones para enviar
                  {timeUntilReset && remainingSubmissions < MAX_SUBMISSIONS_PER_PERIOD && (
                    <> (El límite se reiniciará en {timeUntilReset})</>
                  )}
                </p>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="reviewName" className="block text-sm font-medium mb-2 text-black">Nombre (opcional)</label>
                <input
                  id="reviewName"
                  type="text"
                  defaultValue={newReview.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                  placeholder="Tu nombre"
                  maxLength={MAX_NAME_LENGTH}
                />
              </div>
              
              <div>
                <label htmlFor="reviewEmail" className="block text-sm font-medium mb-2 text-black">Email (opcional, no será público)</label>
                <input
                  id="reviewEmail"
                  type="email"
                  defaultValue={newReview.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                  placeholder="tu@email.com"
                />
                <p className="text-xs text-gray-500 mt-1">Solo para notificaciones, nunca será público</p>
              </div>
            </div>

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
                defaultValue={newReview.comment}
                onChange={(e) => handleInputChange('comment', e.target.value.substring(0, MAX_REVIEW_LENGTH))}
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
                disabled={isSubmitting || newReview.comment.trim().length < 10 || newReview.rating === 0 || remainingSubmissions === 0}
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

        {/* Loading state */}
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
            {/* Reviews list */}
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
                    {/* Review header */}
                    <div className="flex items-center mb-4">
                      {renderUserImage(review.name, 'lg')}
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
                            {formatDate(review.date)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Review content */}
                    <p className="text-gray-600 mb-4 flex-grow whitespace-pre-line">
                      {DOMPurify.sanitize(review.comment)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
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

                    return (
                      <React.Fragment key={pageNumber}>
                        {showEllipsisBefore && !showPage && (
                          <li key={`ellipsis-before-${pageNumber}`}>
                            <span className="px-3 py-2 text-gray-500">...</span>
                          </li>
                        )}
                        {showPage && (
                          <li>
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
                        )}
                        {showEllipsisAfter && !showPage && (
                          <li key={`ellipsis-after-${pageNumber}`}>
                            <span className="px-3 py-2 text-gray-500">...</span>
                          </li>
                        )}
                      </React.Fragment>
                    );
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
          </>
        )}
      </div>
    </Container>
  );
};

export default TestimonialsSection;