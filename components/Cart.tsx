"use client";

import { useState } from "react";
import { useCart } from "./CartContext";
import { motion } from "framer-motion";
import { fadeIn } from "@/utils/animations";
import { FaShoppingCart, FaWhatsapp } from 'react-icons/fa';
import { FaTrash } from 'react-icons/fa';

const Cart = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { items, removeFromCart, updateQuantity, itemCount } = useCart();

  // Función para enviar detalles del carrito a WhatsApp
  const sendToWhatsApp = () => {
    const phoneNumber = "573147845883"; 
    const message = items
      .map((item) => `${item.name} (x${item.quantity})`)
      .join("\n");

    const whatsappMessage = `¡Hola! Estoy interesado en los siguientes productos:\n\n${message}\n\n¿Podrías darme más información y disponibilidad?`;

    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappURL, "_blank");
  };

  return (
    <div>
      {/* Botón de carrito */}
      <motion.button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-all z-50"
          animate={{ y: [0, -10, 0] }}  // Movimiento vertical tipo bounce
          transition={{
            duration: 0.8,
            repeat: Infinity, // Repite infinitamente
            repeatType: "loop",
            ease: "easeInOut",
          }}
        >
          <FaShoppingCart size={24} />
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </motion.button>

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
              <h2 className="text-2xl font-bold">Carrito de Compras</h2>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700 text-2xl">
                ✕
              </button>
            </div>

            {items.length === 0 ? (
              <p className="text-center text-gray-500 my-8">Tu carrito está vacío</p>
            ) : (
              <>
                <div className="space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      variants={fadeIn}
                      initial="hidden"
                      animate="visible"
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
                          className="text-black hover:text-gray-700 transition">
                          <FaTrash />
                        </button>
                      </div>
                    </motion.div>
                  ))}
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

              </>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Cart;
