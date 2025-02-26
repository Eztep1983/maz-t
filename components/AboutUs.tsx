"use client";

import { motion } from "framer-motion";
import { FaFacebook, FaInstagram, FaMapMarkerAlt, FaPhone, FaEnvelope, FaAward, FaUsers, FaHistory, FaCheck } from "react-icons/fa";
import { useState } from "react";
import ContactForm from "./ContactForm";

const AboutUs = () => {
  const cloudinaryBaseURL = "https://res.cloudinary.com/dzqm5gmyg/image/upload";
  const images = [
    `${cloudinaryBaseURL}/empresa1.jpg`,
    `${cloudinaryBaseURL}/empresa2.jpg`,
    `${cloudinaryBaseURL}/empresa3.jpg`,
  ];
  
  const [activeTab, setActiveTab] = useState("historia");
  const [activeSection, setActiveSection] = useState('');
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  const brands = [
    "Toshiba", "Konica Minolta", "Canon", "HP", "Ricoh", "Epson", "Samsung"
  ];

  const handleContactClick = () => {
    setActiveSection('contact');
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Sobre Nosotros
            </span>
          </h1>
          <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
            Distribuidores de Toner, repuestos y consumibles para impresoras y fotocopiadoras.
          </p>
        </motion.div>

        {/* Main Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-16">
          {/* Left Column - Image Gallery */}
          <motion.div 
            className="lg:col-span-2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="grid grid-cols-2 gap-4">
              {images.map((img, index) => (
                <motion.div
                  key={index}
                  className={`rounded-lg overflow-hidden shadow-lg ${index === 0 ? "col-span-2" : ""}`}
                  variants={itemVariants}
                  whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
                >
                  <img
                    src={img}
                    alt={`Instalaciones ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          {/* Right Column - Company Info Tabs */}
          <motion.div 
            className="lg:col-span-3 bg-white rounded-xl shadow-md p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            {/* Tabs Navigation */}
            <div className="flex flex-wrap border-b border-gray-200 mb-6">
              <button
                className={`mr-4 py-2 px-4 font-medium text-sm rounded-t-lg transition ${
                  activeTab === "historia" 
                  ? "text-blue-600 border-b-2 border-blue-600" 
                  : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("historia")}
              >
                <FaHistory className="inline-block mr-2" />
                Nuestra Historia
              </button>
              <button
                className={`mr-4 py-2 px-4 font-medium text-sm rounded-t-lg transition ${
                  activeTab === "mision" 
                  ? "text-blue-600 border-b-2 border-blue-600" 
                  : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("mision")}
              >
                <FaAward className="inline-block mr-2" />
                Misión y Visión
              </button>
              <button
                className={`py-2 px-4 font-medium text-sm rounded-t-lg transition ${
                  activeTab === "equipo" 
                  ? "text-blue-600 border-b-2 border-blue-600" 
                  : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("equipo")}
              >
                <FaUsers className="inline-block mr-2" />
                Nuestro Equipo
              </button>
            </div>
            
            {/* Tab Content */}
            <div className="text-gray-700">
              {activeTab === "historia" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <p className="mb-4 leading-relaxed">
                    Somos una empresa distribuidora de Toner especializada en la venta de insumos y repuestos para 
                    fotocopiadoras e impresoras, incluyendo máquinas multifuncionales de las marcas 
                    más reconocidas del mercado.
                  </p>
                  <p className="mb-4 leading-relaxed">
                    Fundada hace más de una década, nuestra empresa ha crecido constantemente gracias a la 
                    confianza de nuestros clientes y a nuestro compromiso con la calidad y el servicio.
                  </p>
                  <p className="leading-relaxed">
                    Hoy en día, somos referentes en el sector, ofreciendo soluciones integrales para 
                    empresas de todos los tamaños que buscan optimizar sus procesos de impresión y 
                    reducir costos sin sacrificar calidad.
                  </p>
                </motion.div>
              )}
              
              {activeTab === "mision" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3 text-gray-800">Nuestra Misión</h3>
                    <p className="leading-relaxed">
                      Proporcionar insumos y soluciones de impresión de alta calidad que permitan a 
                      nuestros clientes optimizar sus recursos, ofreciendo siempre un servicio 
                      personalizado y eficiente que supere sus expectativas.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-800">Nuestra Visión</h3>
                    <p className="leading-relaxed">
                      Ser la empresa líder en distribución de insumos para impresión en la región, 
                      reconocida por la calidad de nuestros productos, la excelencia en el servicio 
                      y nuestro compromiso con la innovación y la sostenibilidad.
                    </p>
                  </div>
                </motion.div>
              )}
              
              {activeTab === "equipo" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <p className="mb-4 leading-relaxed">
                    Contamos con un equipo de profesionales altamente capacitados en el sector de la 
                    impresión, con amplia experiencia en la distribución y mantenimiento de equipos 
                    e insumos.
                  </p>
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">Nuestro equipo incluye:</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                        <span>Técnicos certificados por las principales marcas del mercado</span>
                      </li>
                      <li className="flex items-start">
                        <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                        <span>Asesores comerciales especializados en soluciones empresariales</span>
                      </li>
                      <li className="flex items-start">
                        <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                        <span>Personal de logística dedicado a garantizar entregas puntuales</span>
                      </li>
                      <li className="flex items-start">
                        <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                        <span>Servicio de atención al cliente disponible para resolver cualquier inquietud</span>
                      </li>
                    </ul>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
        
        {/* Brands We Work With */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
            Marcas con las que Trabajamos
          </h2>
          <div className="flex flex-wrap justify-center gap-6">
            {brands.map((brand, index) => (
              <motion.div
                key={index}
                className="bg-white px-6 py-3 rounded-full shadow-md text-gray-700 font-medium"
                whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
              >
                {brand}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Map & Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <FaMapMarkerAlt className="text-red-500 mr-2" />
              Nuestra Ubicación
            </h2>
            <div className="rounded-xl overflow-hidden shadow-lg h-80">
              <iframe
                className="w-full h-full"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1994.45824409919!2d-77.27899399921704!3d1.2182379000000074!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e2ed4870587a903%3A0x25fc52d9359c5f6e!2sServicio%20T%C3%A9cnico%20Konica!5e0!3m2!1ses-419!2sco!4v1739395425922!5m2!1ses-419!2sco"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </motion.div>
          
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Información de Contacto</h2>
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <FaMapMarkerAlt className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Dirección</h3>
                    <p className="text-gray-600">Calle 21A #14-28, Pasto, Nariño, Colombia</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <FaPhone className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Teléfono</h3>
                    <p className="text-gray-600">+57 </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <FaEnvelope className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Correo Electrónico</h3>
                    <p className="text-gray-600">info@tonersmaz.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <FaUsers className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Horario de Atención</h3>
                    <p className="text-gray-600">Lunes a Viernes: 8:00 AM - 6:00 PM<br />Sábados: 9:00 AM - 1:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Social Media */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Síguenos en Redes Sociales</h2>
          <div className="flex justify-center space-x-6">
            <motion.a
              href="https://www.facebook.com/konica.minolta.7140"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white p-4 rounded-full shadow-md text-blue-600 text-2xl"
              whileHover={{ scale: 1.1, boxShadow: "0 10px 15px -3px rgba(59, 130, 246, 0.3)" }}
            >
              <FaFacebook />
            </motion.a>
            <motion.a
              href="https://www.instagram.com/pro_toshiba_service?igsh=bWR1cmx2bzJmbHl0"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white p-4 rounded-full shadow-md text-pink-600 text-2xl"
              whileHover={{ scale: 1.1, boxShadow: "0 10px 15px -3px rgba(219, 39, 119, 0.3)" }}
            >
              <FaInstagram />
            </motion.a>
          </div>
          
            {/* Otros componentes */}
            <motion.button
              className="mt-10 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleContactClick}
            >
              Contáctanos Ahora
            </motion.button>
            {/* Otros componentes */}
            {activeSection === 'contact' && <ContactForm key="contact" />}
             
          </motion.div>
      </div>
    </div>
  );
};

export default AboutUs;


