"use client";

import { useState, useEffect, useRef } from "react";
import { useCart } from "./CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { fadeIn } from "@/utils/animations";
import { FaShoppingCart, FaWhatsapp, FaTrash, FaEnvelope } from 'react-icons/fa';

const Cart = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [animateCart, setAnimateCart] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const { items, removeFromCart, updateQuantity, itemCount } = useCart();
  const prevItemCount = useRef(itemCount);

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

  const sendToEmail = () => {
    const emailAddress = "serviciotecnicokonikaminolta@gmail.com";
    const subject = "Consulta de productos";
    const message = items.map((item) => `${item.name} (x${item.quantity})`).join("\n");
    const emailBody = `¡Hola! Estoy interesado en los siguientes productos:\n\n${message}\n\n¿Podrías darme más información y disponibilidad?`;
    const mailtoLink = `mailto:${emailAddress}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
    window.open(mailtoLink, "_blank");
  };

  const sendToWhatsApp = () => {
    const phoneNumber = "573147845883";
    const message = items.map((item) => `${item.name} (x${item.quantity})`).join("\n");
    const whatsappMessage = `¡Hola! Estoy interesado en los siguientes productos:\n\n${message}\n\n¿Podrías darme más información y disponibilidad?`;
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappURL, "_blank");
  };

  return (
    <div className="text-gray-600">
      {/* Botón de carrito */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-all z-50 ${
          animateCart ? 'ring-4 ring-blue-300' : ''
        }`}
        animate={animateCart ? { scale: [1, 1.2, 1] } : false}
        transition={{ duration: 0.5 }}
      >
        <FaShoppingCart size={24} />
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </motion.button>

      {/* Toast de confirmación */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-20 right-4 bg-white border border-gray-300 px-4 py-2 rounded-md shadow-lg text-gray-800 z-50"
          >
            Producto agregado al carrito
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal del carrito */}
      {isOpen && (
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-black">Carrito de Consultas</h2>
              <button onClick={() => setIsOpen(false)} className="text-black hover:text-black text-2xl">
                ✕
              </button>
            </div>

            {items.length === 0 ? (
              <p className="text-center my-8">Tu carrito está vacío</p>
            ) : (
              <>
                <div className="space-y-4">
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center justify-between border-b pb-4"
                      >
                        <h3 className="font-semibold">{item.name}</h3>

                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100 transition"
                            >
                              -
                            </button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100 transition"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-gray-600 hover:text-gray-700 transition">
                            <FaTrash />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Botón de WhatsApp */}
                <motion.button
                  onClick={sendToWhatsApp}
                  className="w-full mt-6 bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-all flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaWhatsapp className="mr-2" size={24} /> Consultar por WhatsApp
                </motion.button>

                {/* Botón de Gmail */}
                <motion.button
                  onClick={sendToEmail}
                  className="w-full mt-4 bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition-all flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaEnvelope className="mr-2" size={24} /> Consultar por Gmail
                </motion.button>
              </>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Cart;
