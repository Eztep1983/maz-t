"use client";

import { motion } from "framer-motion";
import { FaFacebook, FaInstagram, FaMapMarkerAlt } from "react-icons/fa";

const AboutUs = () => {
  const cloudinaryBaseURL = "https://res.cloudinary.com/dzqm5gmyg/image/upload";
  const images = [
    `${cloudinaryBaseURL}/empresa1.jpg`,
    `${cloudinaryBaseURL}/empresa2.jpg`,
    `${cloudinaryBaseURL}/empresa3.jpg`,
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Título */}
        <motion.h2
          className="text-3xl font-bold text-center text-black mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Sobre Nosotros
        </motion.h2>

        {/* Descripción */}
        <motion.p
          className="text-gray-700 text-lg text-center mb-10 max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          Somos una empresa especializada en la venta de insumos y repuestos para 
          fotocopiadoras e impresoras, incluyendo multifuncionales de las marcas 
          más reconocidas. Nuestro objetivo es ofrecer productos de alta calidad, 
          con precios competitivos y excelente servicio al cliente.
        </motion.p>

        {/* Imágenes de la empresa */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {images.map((img, index) => (
            <motion.img
              key={index}
              src={img}
              alt={`Empresa ${index + 1}`}
              className="rounded-lg shadow-md w-full h-60 object-cover"
              whileHover={{ scale: 1.05 }}
            />
          ))}
        </div>

        {/* Mapa de ubicación */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-black text-center mb-4">
            <FaMapMarkerAlt className="inline-block text-red-500 mr-2" />
            Nuestra Ubicación
          </h3>
          <div className="w-full h-72 rounded-lg overflow-hidden shadow-lg">
            <iframe
              className="w-full h-full"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.9862393731366!2d-77.2811!3d1.2145!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e296b1e1234567%3A0x9cfa123456789abc!2sTonersMAZ!5e0!3m2!1ses!2sco!4v1707000000000"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        {/* Redes Sociales */}
        <div className="text-center">
          <h3 className="text-2xl font-semibold text-black mb-4">Síguenos en Redes Sociales</h3>
          <div className="flex justify-center space-x-6">
            <motion.a
              href="https://facebook.com/TonersMAZ"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 text-3xl"
              whileHover={{ scale: 1.2 }}
            >
              <FaFacebook />
            </motion.a>
            <motion.a
              href="https://instagram.com/TonersMAZ"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-600 text-3xl"
              whileHover={{ scale: 1.2 }}
            >
              <FaInstagram />
            </motion.a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
