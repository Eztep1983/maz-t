"use client";

import { useState, useEffect, useRef } from "react";
import { useCart } from "./CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { fadeIn } from "@/utils/animations";
import { Product } from '@/types/types';


import { 
  FaShoppingCart, 
  FaWhatsapp, 
  FaTrash, 
  FaEnvelope, 
  FaCheckCircle, 
  FaMinus, 
  FaPlus 
} from 'react-icons/fa';
import { CldImage } from "next-cloudinary";

const Cart = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [animateCart, setAnimateCart] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const { items, removeFromCart, updateQuantity, itemCount } = useCart();
  const prevItemCount = useRef(itemCount);
  const cartRef = useRef<HTMLDivElement>(null); // Explicitly type the ref

  // Animación al agregar producto
  useEffect(() => {
    if (itemCount > prevItemCount.current) {
      setAnimateCart(true);
      setShowToast(true);
      setTimeout(() => setAnimateCart(false), 500);
      setTimeout(() => setShowToast(false), 2000);
    }
    prevItemCount.current = itemCount;
  }, [itemCount]);

  // Cerrar al hacer clic fuera del carrito  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        cartRef.current && 
        !cartRef.current.contains(event.target as Node) && 
        isOpen
      ) {
        setIsOpen(false);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Funciones para enviar correo y WhatsApp
  const sendToEmail = () => {
    const emailAddress = "tmazqualitytoner@gmail.com";
    const subject = encodeURIComponent("Consulta de productos");
    
    if (!items || items.length === 0) {
        alert("No hay productos seleccionados.");
        return;
    }

    const message = items.map(item => `${item.name} (x${item.quantity})`).join("\n");
    const emailBody = encodeURIComponent(
        `¡Hola! Estoy interesado en los siguientes productos:\n\n${message}\n\n¿Podrías darme más información y disponibilidad?`
    );

    const mailtoLink = `mailto:${emailAddress}?subject=${subject}&body=${emailBody}`;
    window.open(mailtoLink, "_blank", "noopener,noreferrer");
  };

  const sendToWhatsApp = () => {
    const phoneNumber = 573147845883;

    if (!items || items.length === 0) {
        alert("No hay productos seleccionados.");
        return;
    }
    const message = items.map(item => `${item.name} (x${item.quantity})`).join("\n");
    const whatsappMessage = encodeURIComponent(
        `¡Hola! Estoy interesado en los siguientes productos:\n\n${message}\n\n¿Podrías darme más información y disponibilidad?`
    );

    const whatsappURL = `https://wa.me/${phoneNumber}?text=${whatsappMessage}`;
    window.open(whatsappURL, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="text-gray-700">
      {/* Botón flotante del carrito */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all z-50 ${
          animateCart ? 'ring-4 ring-blue-300' : ''
        }`}
        animate={animateCart ? { scale: [1, 1.2, 1] } : false}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.3 }}
      >
        <FaShoppingCart size={24} />
        {itemCount > 0 && (
          <motion.span 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center border-2 border-white"
          >
            {itemCount}
          </motion.span>
        )}
      </motion.button>

      {/* Toast de confirmación */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed bottom-20 right-6 px-6 py-3 rounded-lg shadow-xl bg-gradient-to-r from-blue-400 to-blue-600 text-white text-sm flex items-center gap-3 z-50"
          >
            <FaCheckCircle size={18} className="text-white" />
            <span className="font-semibold">¡Producto agregado al carrito!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal del carrito */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              ref={cartRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl"
            >
              {/* Encabezado del carrito */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 px-6 flex justify-between items-center">
                <h2 className="font-bold text-xl flex items-center">
                  <FaShoppingCart className="mr-2" /> 
                  Carrito de Consultas
                  {itemCount > 0 && (
                    <span className="ml-2 bg-white text-blue-600 text-sm px-2 py-1 rounded-full">
                      {itemCount} {itemCount === 1 ? 'item' : 'items'}
                    </span>
                  )}
                </h2>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="text-white hover:text-gray-200 text-2xl focus:outline-none"
                  aria-label="Cerrar carrito"
                >
                  ✕
                </button>
              </div>

              {/* Contenido del carrito */}
              <div className="p-6 overflow-y-auto max-h-[50vh]">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                    <FaShoppingCart size={48} className="text-gray-300 mb-4" />
                    <p className="text-center text-lg">Tu carrito está vacío</p>
                    <p className="text-center text-sm mt-2">Agrega productos para realizar una consulta</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <AnimatePresence>
                      {items.map((item) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -50 }}
                          transition={{ duration: 0.3 }}
                          className="flex items-center gap-4 border-b pb-4 group hover:bg-gray-50 p-2 rounded-lg transition-all"
                        >
                          {/* Imagen del producto */}
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border shadow-sm">
                            {item.imagePublicId ? (
                              <CldImage
                                quality={"auto"}
                                loading="lazy"
                                src={item.imagePublicId} 
                                alt={item.name}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                <FaShoppingCart size={20} className="text-gray-400" />
                              </div>
                            )}
                          </div>
                          
                          {/* Información del producto */}
                          <div className="flex-grow">
                            <h3 className="font-semibold text-gray-800">{item.name}</h3>
                          </div>

                          {/* Controles de cantidad */}
                          <div className="flex items-center">
                            <div className="flex items-center bg-gray-100 rounded-lg p-1">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center hover:bg-gray-50 transition text-blue-500"
                                aria-label="Disminuir cantidad"
                              >
                                <FaMinus size={10} />
                              </motion.button>
                              <span className="w-10 text-center font-medium">{item.quantity}</span>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center hover:bg-gray-50 transition text-blue-500"
                                aria-label="Aumentar cantidad"
                              >
                                <FaPlus size={10} />
                              </motion.button>
                            </div>
                            
                            {/* Botón eliminar */}
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => removeFromCart(item.id)}
                              className="ml-3 p-2 text-gray-400 hover:text-red-500 transition-colors"
                              aria-label="Eliminar producto"
                            >
                              <FaTrash />
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* Acciones del carrito */}
              {items.length > 0 && (
                <div className="p-6 bg-gray-50 border-t">
                  {/* Botón de WhatsApp */}
                  <motion.button
                    onClick={sendToWhatsApp}
                    className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-all flex items-center justify-center shadow-md"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaWhatsapp className="mr-2" size={20} /> Consultar por WhatsApp
                  </motion.button>

                  {/* Botón de Gmail */}
                  <motion.button
                    onClick={sendToEmail}
                    className="w-full mt-4 bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-all flex items-center justify-center shadow-md"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaEnvelope className="mr-2" size={20} /> Consultar por Gmail
                  </motion.button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Cart;