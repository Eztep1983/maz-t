"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "./Footer";
import { Menu, X } from "lucide-react";
import { auth, signInWithGoogle, signOutUser, db } from '../services/firebaseConfig';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp, Timestamp } from 'firebase/firestore';
import { User } from 'firebase/auth';
import ProductGrid from "./ProductGrid";
import ContactForm from "./ContactForm";
import Cart from "./Cart";
import AboutUs from "./AboutUs";
import TestimonialsSection from "./testimonials";


interface Reply {
  id: string;
  userId: string;
  userName: string;
  photoUrl: string;
  text: string;
  date: Date | Timestamp;
  dateString?: string;
}

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
}

const CatalogWebsite = () => {
  const [isReplySubmitting, setIsReplySubmitting] = useState<{[reviewId: string]: boolean}>({});
  const [repliesMap, setRepliesMap] = useState<{[reviewId: string]: Reply[]}>({});
  const [expandedReplies, setExpandedReplies] = useState<{[reviewId: string]: boolean}>({});
  const INITIAL_REPLIES_SHOWN = 2;
  const avatar = '/images/avatar.png'; 
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
  const [, setScreenWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  
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
          const date = data.date instanceof Timestamp ? data.date.toDate() : new Date(data.date);
          return {
            id: doc.id,
            ...data,
            date,
            dateString: date.toISOString().split('T')[0],
          };
        }) as Review[];
        setReviews(reviewsData);
        
        // Fetch replies for each review
        const repliesObj: {[reviewId: string]: Reply[]} = {};
        for (const review of reviewsData) {
          const repliesSnapshot = await getDocs(
            query(collection(db, `reviews/${review.id}/replies`), orderBy("date", "asc"))
          );
          
          const repliesData = repliesSnapshot.docs.map(doc => {
            const data = doc.data();
            const date = data.date instanceof Timestamp ? data.date.toDate() : new Date(data.date);
            return {
              id: doc.id,
              userId: data.userId,
              userName: data.userName,
              photoUrl: data.photoUrl,
              text: data.text,
              date,
              dateString: date.toISOString().split('T')[0]
            };
          });
          
          if (repliesData.length > 0) {
            repliesObj[review.id] = repliesData;
          }
        }
        setRepliesMap(repliesObj);
        
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


  // Handle reply submission - FIXED to save replies in Firestore
  const handleReplySubmit = async (reviewId: string) => {
    if (!user) return;
    if (replyText.trim() === '') {
      alert('Por favor escribe una respuesta antes de enviar.');
      return;
    }
    
    // Check if already submitting for this review
    if (isReplySubmitting[reviewId]) {
      return; // Exit if already submitting
    }
    
    // Set submitting state
    setIsReplySubmitting(prev => ({
      ...prev,
      [reviewId]: true
    }));
    
    try {
      const now = new Date();
      // Add reply to a subcollection in Firestore
      const replyData = {
        userId: user.uid,
        userName: user.displayName || 'Usuario Anónimo',
        photoUrl: user.photoURL || '/api/placeholder/48/48',
        text: replyText.trim(),
        date: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, `reviews/${reviewId}/replies`), replyData);
      
      // Update local state with the new reply
      const newReply: Reply = {
        id: docRef.id,
        ...replyData,
        date: now,
        dateString: now.toISOString().split('T')[0]
      };
      
      setRepliesMap(prevReplies => ({
        ...prevReplies,
        [reviewId]: [...(prevReplies[reviewId] || []), newReply]
      }));
      
      // Clear form and close reply interface
      setReplyText("");
      setActiveReplyId(null);
      
      // Auto-expand replies for the review that just received a new reply
      setExpandedReplies(prev => ({
        ...prev,
        [reviewId]: true
      }));
      
    } catch (error) {
      console.error('Error submitting reply:', error);
      alert('Error al enviar tu respuesta. Por favor, intenta de nuevo.');
    } finally {
      // Reset submitting state
      setIsReplySubmitting(prev => ({
        ...prev,
        [reviewId]: false
      }));
    }
  };
  
  // Add a function to toggle expanded replies
  const toggleRepliesExpansion = (reviewId: string) => {
    setExpandedReplies(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
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

            <div className="md:hidden">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
                className="flex items-center space-x-2"
              >
                <span className="text-left">Menu</span>
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
              <center><h2 className="text-2xl font-bold mb-6 text-Azul">Nuestros productos</h2></center>
              <ProductGrid />
            </motion.div>
          )}
          {activeSection === "testimonials" && <TestimonialsSection key="testimonials" />}
          {activeSection === "contact" && <ContactForm key="contact" />}
          {activeSection === "about" && <AboutUs key="about" />}
        </AnimatePresence>
      </main>
      <Footer/>
    </div>
  );
};

export default CatalogWebsite;