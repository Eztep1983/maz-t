"use client";

import { motion } from "framer-motion";
import { 
  FaFacebook, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope, 
  FaUsers, 
  FaHistory, 
  FaCheck, 
  FaAward,
  FaShoppingCart,
  FaHeadset,
  FaArrowRight,
  FaWhatsapp,
  FaComment
} from "react-icons/fa";
import { useState, useMemo, lazy, Suspense } from "react";
import Image from "next/image";
import React from "react";
import { SchemaMarkup } from "./Schemamarkup";

// Lazy loading de componentes pesados
const Carousel = lazy(() => import("./Carousel"));
const VideoPlayer = lazy(() => import("./VideoPlayer"));

interface AboutUsProps {
  onContactClick?: () => void;
  onProductClick?: () => void; 
  onTestimonialsClick?: () => void;
}

type TabType = "historia" | "mision" | "equipo";

const AboutUs = ({ onContactClick, onProductClick, onTestimonialsClick }: AboutUsProps) => {
  // Constants and configuration - memoizados para evitar recreación
  const BRANDS = useMemo(() => [
    { src: "/images/toshiba_logo.png", alt: "Toner compatible Toshiba", name: "Toshiba" },
    { src: "/images/ricoh_logo.jpg", alt: "Toner compatible Ricoh", name: "Ricoh" },
    { src: "/images/Minolta_logo.jpg", alt: "Toner compatible Konica Minolta", name: "Konica Minolta" },
  ], []);

  const LOGO_URL = "/images/Logo.jpeg";
  
  const CONTACT_INFO = useMemo(() => ({
    address: "Calle 20 # 27-105, Las Cuadras Pasto, Nariño, Colombia",
    phone: "+57 314-784-5883",
    whatsapp: "+57 314-784-5883",
    email: "tmazqualitytoner@gmail.com",
    businessHours: {
      weekdays: "Lunes a Viernes: 9:30am - 12:00pm | 2:40pm - 6:30pm",
      saturday: "Sábados: 9:00 AM - 1:00 PM"
    }
  }), []);

  const SOCIAL_LINKS = useMemo(() => ({
    facebook: "https://www.facebook.com/profile.php?id=61559681797295",
  }), []);

  const CTA_OPTIONS = useMemo(() => [
    { 
      id: "contacto", 
      title: "Cotización Personalizada", 
      description: "¿Necesitas una solución específica? Contáctanos para una asesoría gratuita",
      icon: <FaHeadset className="text-2xl text-white" />,
      action: () => onContactClick?.(),
      color: "from-blue-600 to-Azul"
    },
    {
      id: "opiniones", 
      title: "Opiniones de Clientes", 
      description: "Descubre lo que otros piensan y comparte tu experiencia",
      icon: <FaComment className="text-2xl text-white" />,
      action: () => onTestimonialsClick?.(),
      color: "from-Azul to-blue-600"
    },
  ], [onContactClick, onTestimonialsClick]);

  const FAQ_ITEMS = useMemo(() => [
    {
      question: "¿Realizan envíos a otras ciudades?",
      answer: "Sí, realizamos envíos a todo Colombia. Se despacha el mismo día de la compra."
    },
    {
      question: "¿Qué métodos de pago aceptan?",
      answer: "Aceptamos efectivo, transferencias bancarias, tarjetas de crédito y débito, y pagos a través de plataformas como Nequi."
    },
    {
      question: "¿Tienen stock disponible de todos los productos?",
      answer: "Manejamos un inventario actualizado. Te recomendamos consultarnos directamente para confirmar existencias."
    }
  ], []);

  // State
  const [activeTab, setActiveTab] = useState<TabType>("historia");
  const [hoverCta, setHoverCta] = useState<string | null>(null);

  // Animation variants - memoizados
  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }), []);
  
  // Handlers optimizados
  const handleWhatsAppClick = () => {
    window.open(
      `https://wa.me/${CONTACT_INFO.whatsapp.replace(/\D/g, '')}?text=Hola,%20estoy%20interesado%20en%20sus%20productos.%20Quisiera%20más%20información.`, 
      '_blank',
      'noopener,noreferrer'
    );
  };

  const handleDirectionsClick = () => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(CONTACT_INFO.address)}`, 
      '_blank',
      'noopener,noreferrer'
    );
  };
  
  // Tab content components optimizados
  const HistoriaContent = React.memo(() => (
    <article className="prose prose-gray max-w-none">
      <p className="mb-4 leading-relaxed text-base">
        Somos una empresa distribuidora de tóner ubicada en la ciudad de Pasto, Nariño-Colombia, especializada en la venta de tóner para 
        fotocopiadoras multifuncionales de las marcas más reconocidas del mercado.
      </p>
      <p className="mb-4 leading-relaxed text-base">
        Fundada hace más de una década y con 20 años de experiencia en el sector, nuestra empresa ha crecido constantemente gracias a la 
        confianza de nuestros clientes y a nuestro compromiso con la calidad y el servicio.
      </p>
      <p className="leading-relaxed mb-6 text-base">
        Hoy en día, somos referentes en el sector, ofreciendo soluciones integrales para 
        empresas de todos los tamaños que buscan optimizar sus procesos de impresión y 
        reducir costos sin sacrificar calidad.
      </p>
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg shadow-sm">
        <p className="text-blue-800 font-medium text-sm">
          ¿Buscas optimizar tus costos de impresión? Consulta nuestro catálogo de productos y descubre soluciones que se adaptan a tus necesidades.
          <button
            onClick={onProductClick}
            className="flex items-center text-blue-600 font-bold mt-2 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            aria-label="Ver catálogo de productos"
          >
            Ver productos <FaArrowRight className="ml-2" aria-hidden="true" />
          </button>
        </p>
      </div>
    </article>
  ));

  const MisionContent = React.memo(() => (
    <article className="prose prose-gray max-w-none">
      <section className="mb-6">
        <h3 className="text-xl font-semibold mb-3 text-gray-800">Nuestra Misión</h3>
        <p className="leading-relaxed text-base">
          Proporcionar tóner compatible de altísima calidad que optimice el rendimiento de impresión,
          ofreciendo una excelente relación calidad-precio para nuestros clientes.
        </p>
      </section>
      <section className="mb-6">
        <h3 className="text-xl font-semibold mb-3 text-gray-800">Nuestra Visión</h3>
        <p className="leading-relaxed text-base">
          Ser la empresa líder en distribución de tóner multicolor en la región, 
          reconocida por la calidad de nuestros productos, la excelencia en el servicio 
          y nuestro compromiso con la innovación y la sostenibilidad.
        </p>
      </section>
      <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg shadow-sm">
        <p className="text-green-800 font-medium text-sm">
          Nuestro compromiso es brindarte el mejor servicio.
        </p>
      </div>
    </article>
  ));

  const EquipoContent = React.memo(() => (
    <article className="prose prose-gray max-w-none">
      <p className="mb-4 leading-relaxed text-base">
        Contamos con un equipo de profesionales altamente capacitados en el sector de impresión, 
        con amplia experiencia en la gestión, selección y optimización de tóners para todo tipo de necesidades.
      </p>
      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-2 text-gray-800">Nuestro equipo incluye:</h3>
        <ul className="space-y-2 list-none pl-0">
          <li className="flex items-start">
            <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" aria-hidden="true" />
            <span>Técnicos certificados por las principales marcas del mercado</span>
          </li>
          <li className="flex items-start">
            <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" aria-hidden="true" />
            <span>Asesores comerciales especializados en soluciones empresariales</span>
          </li>
          <li className="flex items-start">
            <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" aria-hidden="true" />
            <span>Personal de logística dedicado a garantizar entregas puntuales</span>
          </li>
          <li className="flex items-start">
            <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" aria-hidden="true" />
            <span>Servicio de atención al cliente disponible para resolver cualquier inquietud</span>
          </li>
        </ul>
      </section>
      <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg shadow-sm">
        <p className="text-purple-800 font-medium text-sm">
          ¿Necesitas una asesoría personalizada? Nuestro equipo está listo para ayudarte.
          <button
            onClick={onContactClick}
            className="flex items-center text-blue-600 font-bold mt-2 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            aria-label="Contactar para asesoría"
          >
            Contáctanos ahora <FaArrowRight className="ml-2" aria-hidden="true" />
          </button>
        </p>
      </div>
    </article>
  ));

  const TAB_CONTENT = useMemo(() => ({
    historia: <HistoriaContent />,
    mision: <MisionContent />,
    equipo: <EquipoContent />
  }), []);

  const TABS = useMemo(() => [
    { id: "historia" as TabType, label: "Nuestra Historia", icon: <FaHistory aria-hidden="true" /> },
    { id: "mision" as TabType, label: "Misión y Visión", icon: <FaAward aria-hidden="true" /> },
    { id: "equipo" as TabType, label: "Nuestro Equipo", icon: <FaUsers aria-hidden="true" /> }
  ], []);

  return (
    <div
      className="min-h-screen rounded-2xl border border-gray-200 shadow-md py-12 px-4 lg:px-8 relative"
      style={{
        backgroundImage: "url('/images/TonersCantidad.png')",
        backgroundSize: "contain",
        backgroundPosition: "top",
        backgroundRepeat: "no-repeat"
      }}
    >
      <SchemaMarkup />
      {/* SEO Meta - agregar en el head del documento */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-white pointer-events-none" aria-hidden="true"></div>
      
      {/* Fixed WhatsApp Button - mejorado con aria-label */}
      <motion.button
        className="fixed bottom-6 left-6 bg-green-500 text-white p-4 rounded-full shadow-lg z-50 flex items-center justify-center hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleWhatsAppClick}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        aria-label="Contactar por WhatsApp"
      >
        <FaWhatsapp className="text-2xl" aria-hidden="true" />
      </motion.button>
      
      <div className="relative max-w-7xl mx-auto">
        {/* Hero Section - Mejorada jerarquía H1 */}
        <header className="text-center mb-16">
          <motion.div 
            className="flex flex-col md:flex-row items-center justify-center gap-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="relative w-40 h-40 border-4 border-gray-300 rounded-lg flex-shrink-0">
              <Image 
                src={LOGO_URL} 
                alt="Tmaz Quality Toner - Distribuidores de tóner en Pasto, Nariño" 
                fill
                className="rounded-lg shadow-lg object-cover"
                priority
                sizes="(max-width: 768px) 160px, 160px"
              />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-Azul to-blue-700">
                  Tmaz Quality Toner
                </span>
              </h1>
              <p className="text-xl md:text-2xl font-semibold text-gray-700 mb-2">
                Distribuidores Autorizados en Pasto
              </p>
              <p className="text-gray-800 text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
                Expertos en tóners de alto rendimiento para fotocopiadoras multifuncionales. 
                Calidad y compatibilidad garantizada con las mejores marcas.
              </p>
            </div>
          </motion.div>
        </header>

        {/* Media Section - Lazy loaded */}
        <section className="mb-12" aria-label="Galería multimedia">
          <div className="w-[90%] mb-6 max-w-md mx-auto">
            <div className="rounded-xl shadow-md overflow-hidden">
              <Suspense fallback={<div className="w-full h-64 bg-gray-200 animate-pulse rounded-xl"></div>}>
                <VideoPlayer />
              </Suspense>
            </div>
          </div>
          
          <div className="w-[90%] mb-6 max-w-md mx-auto">
            <div className="rounded-xl shadow-md overflow-hidden">
              <Suspense fallback={<div className="w-full h-64 bg-gray-200 animate-pulse rounded-xl"></div>}>
                <Carousel />
              </Suspense>
              <motion.button
                onClick={onProductClick}
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-3 rounded-lg shadow-md flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-blue-300"
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
                aria-label="Ver catálogo completo de productos"
              >
                <FaShoppingCart className="mr-2" aria-hidden="true" />
                Ver catálogo completo
              </motion.button>
            </div>
          </div>
        </section>

        {/* CTA Cards Section - Grid optimizado */}
        <section className="w-full max-w-7xl mx-auto px-4 mb-12" aria-label="Acciones rápidas">
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {CTA_OPTIONS.map((cta) => (
              <motion.button
                key={cta.id}
                className={`bg-gradient-to-r ${cta.color} rounded-lg shadow p-6 text-white cursor-pointer w-full text-left focus:outline-none focus:ring-4 focus:ring-blue-300`}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
                }}
                whileTap={{ scale: 0.98 }}
                onClick={cta.action}
                onMouseEnter={() => setHoverCta(cta.id)}
                onMouseLeave={() => setHoverCta(null)}
                aria-label={cta.title}
              >
                <div className="flex flex-col space-y-3">
                  <div className="bg-white/20 p-3 rounded-full w-fit">
                    {cta.icon}
                  </div>
                  <h2 className="text-xl font-bold">{cta.title}</h2>
                  <p className="text-white/90 text-sm">{cta.description}</p>
                  <motion.div 
                    className="flex items-center space-x-1 text-sm font-medium mt-2"
                    animate={{ 
                      x: hoverCta === cta.id ? 3 : 0 
                    }}
                  >
                    <span>Ver más</span>
                    <FaArrowRight size={12} aria-hidden="true" />
                  </motion.div>
                </div>
              </motion.button>
            ))}
          </motion.div>
        </section>

        {/* Main Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 mb-16">          
          {/* Company Info Tabs */}
          <motion.section 
            className="bg-white rounded-xl shadow-md p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            aria-label="Información de la empresa"
          >
            {/* Tabs Navigation */}
            <nav className="flex flex-wrap border-b border-gray-200 mb-6" role="tablist" aria-label="Secciones de información">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  className={`flex items-center mr-4 py-2 px-4 font-medium text-sm rounded-t-lg transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    activeTab === tab.id 
                    ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50" 
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  aria-controls={`panel-${tab.id}`}
                  id={`tab-${tab.id}`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
            
            {/* Tab Content */}
            <motion.div
              key={activeTab}
              className="text-gray-700"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              role="tabpanel"
              id={`panel-${activeTab}`}
              aria-labelledby={`tab-${activeTab}`}
            >
              {TAB_CONTENT[activeTab]}
            </motion.div>
          </motion.section>
        </div>

        {/* Brands Section - Optimizado con alt descriptivos */}
        <section 
          className="mb-16"
          aria-labelledby="brands-heading"
        >
          <motion.h2 
            id="brands-heading"
            className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            Tóner Compatible para las Marcas Líderes
          </motion.h2>
          <div className="flex flex-wrap justify-center gap-6">
            {BRANDS.map((brand, index) => (
              <motion.button
                key={brand.name}
                className="bg-white px-6 py-4 rounded-lg shadow-md hover:shadow-lg transition-shadow focus:outline-none focus:ring-4 focus:ring-blue-300"
                whileHover={{ scale: 1.05, rotate: 2 }}
                whileTap={{ scale: 0.98 }}
                onClick={onProductClick}
                aria-label={`Ver tóner compatible para ${brand.name}`}
              >
                <img 
                  src={brand.src} 
                  alt={brand.alt}
                  className="h-8 w-auto" 
                  loading="lazy"
                />
              </motion.button>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16" aria-labelledby="contact-heading">
          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
          >
            <h2 id="contact-heading" className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <FaMapMarkerAlt className="text-red-500 mr-2" aria-hidden="true" />
              Punto Autorizado de Venta en Pasto
            </h2>
            <div className="rounded-xl overflow-hidden shadow-lg aspect-video">
              <iframe
                title="Ubicación de Tmaz Quality Toner en Pasto, Nariño"
                className="w-full h-full"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1994.45824409919!2d-77.27899399921704!3d1.2182379000000074!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e2ed4870587a903%3A0x25fc52d9359c5f6e!2sServicio%20T%C3%A9cnico%20Konica!5e0!3m2!1ses-419!2sco!4v1739395425922!5m2!1ses-419!2sco"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
            <motion.button 
              className="mt-4 bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-3 rounded-lg shadow-md flex items-center justify-center w-full focus:outline-none focus:ring-4 focus:ring-red-300"
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
              onClick={handleDirectionsClick}
              aria-label="Obtener direcciones en Google Maps"
            >
              <FaMapMarkerAlt className="mr-2" aria-hidden="true" />
              Cómo llegar
            </motion.button>
          </motion.div>
          
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
          >
            <h2 className=" text-center text-2xl font-bold text-gray-800 mb-4">Información de Contacto</h2>
            <div className="bg-white rounded-xl shadow-md p-6 h-full">
              <address className="space-y-4 not-italic">
                <ContactInfoItem 
                  icon={<FaMapMarkerAlt className="text-blue-600" />}
                  title="Dirección"
                  content={CONTACT_INFO.address}
                />
                <ContactInfoItem 
                  icon={<FaPhone className="text-blue-600" />}
                  title="Teléfono"
                  content={
                    <a 
                      href={`tel:${CONTACT_INFO.phone}`} 
                      className="text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                      aria-label={`Llamar al ${CONTACT_INFO.phone}`}
                    >
                      {CONTACT_INFO.phone}
                    </a>
                  }
                />
                <ContactInfoItem 
                  icon={<FaWhatsapp className="text-green-600" />}
                  title="WhatsApp"
                  content={
                    <a 
                      href={`https://wa.me/${CONTACT_INFO.whatsapp.replace(/\D/g, '')}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-green-600 hover:underline focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
                      aria-label={`Chatear por WhatsApp al ${CONTACT_INFO.whatsapp}`}
                    >
                      {CONTACT_INFO.whatsapp}
                    </a>
                  }
                />
                <ContactInfoItem 
                  icon={<FaEnvelope className="text-blue-600" />}
                  title="Correo Electrónico"
                  content={
                    <a 
                      href={`mailto:${CONTACT_INFO.email}`} 
                      className="text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                      aria-label={`Enviar correo a ${CONTACT_INFO.email}`}
                    >
                      {CONTACT_INFO.email}
                    </a>
                  }
                />
                <ContactInfoItem 
                  icon={<FaUsers className="text-blue-600" />}
                  title="Horario de Atención"
                  content={
                    <>
                      {CONTACT_INFO.businessHours.weekdays}<br />
                      {CONTACT_INFO.businessHours.saturday}
                    </>
                  }
                />
              </address>
              <motion.button
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-3 rounded-lg shadow-md flex items-center justify-center w-full focus:outline-none focus:ring-4 focus:ring-blue-300"
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
                onClick={onContactClick}
                aria-label="Solicitar asesoría personalizada"
              >
                <FaHeadset className="mr-2" aria-hidden="true" />
                Solicitar Asesoría Personalizada
              </motion.button>
            </div>
          </motion.div>
        </section>

        {/* FAQ Section */}
        <section 
          className="mb-16"
          aria-labelledby="faq-heading"
        >
          <motion.h2 
            id="faq-heading"
            className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
          >
            Preguntas Frecuentes
          </motion.h2>
          <div className="bg-white rounded-xl shadow-md p-6">
            <dl className="space-y-6">
              {FAQ_ITEMS.map((faq, index) => (
                <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                  <dt className="text-lg font-semibold text-gray-800 mb-2">{faq.question}</dt>
                  <dd className="text-gray-600">{faq.answer}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-8 text-center">
              <p className="text-gray-700 mb-4 text-base">¿Tienes más preguntas? No dudes en contactarnos.</p>
              <motion.button
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-full shadow-md inline-flex items-center focus:outline-none focus:ring-4 focus:ring-blue-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={onContactClick}
                aria-label="Contactar ahora para más información"
              >
                <FaHeadset className="mr-2" aria-hidden="true" />
                Contactar Ahora
              </motion.button>
            </div>
          </div>
        </section>

        {/* Call to Action Banner */}
        <section 
          className="mb-16 bg-gradient-to-r from-Azul to-blue-700 rounded-xl shadow-lg p-8 text-white text-center"
          aria-labelledby="cta-heading"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9 }}
          >
            <h2 id="cta-heading" className="text-2xl md:text-3xl font-bold mb-4">
              ¿Listo para vender?
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              En Tmaz Quality Toner tenemos todo el toner que necesitas para mantener los equipos de tus clientes funcionando con el máximo rendimiento y al mejor precio.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <motion.button
                className="bg-white text-blue-600 font-medium px-6 py-3 rounded-full shadow-md hover:shadow-xl transition-all inline-flex items-center focus:outline-none focus:ring-4 focus:ring-white/50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={onProductClick}
                aria-label="Ver catálogo de productos"
              >
                <FaShoppingCart className="mr-2" aria-hidden="true" />
                Ver Catálogo
              </motion.button>
              <motion.button
                className="bg-transparent border-2 border-white text-white font-medium px-6 py-3 rounded-full shadow-md hover:shadow-xl hover:bg-white/10 transition-all inline-flex items-center focus:outline-none focus:ring-4 focus:ring-white/50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={onContactClick}
                aria-label="Solicitar cotización personalizada"
              >
                <FaHeadset className="mr-2" aria-hidden="true" />
                Solicitar Cotización
              </motion.button>
            </div>
          </motion.div>
        </section>

        {/* Social Media Section */}
        <footer className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1 }}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Síguenos en Redes Sociales</h2>
            <div className="flex justify-center gap-6">
              <SocialIcon 
                href={SOCIAL_LINKS.facebook}
                icon={<FaFacebook />}
                label="Facebook"
                color="text-blue-600"
                hoverColor="hover:bg-blue-50"
              />
            </div>
            
            <p className="text-gray-600 mt-6 mb-8">
              Mantente al día con nuestras últimas promociones de tóners y productos.
            </p>
            
            <motion.button
              className="mt-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-medium px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all focus:outline-none focus:ring-4 focus:ring-blue-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={onContactClick}
              aria-label="Contáctanos ahora"
            >
              Contáctanos Ahora
            </motion.button>
          </motion.div>
        </footer>
      </div>
    </div>
  );
};

// Subcomponents optimizados
const ContactInfoItem = React.memo(({ icon, title, content }: { 
  icon: React.ReactNode;
  title: string;
  content: React.ReactNode;
}) => (
  <div className="flex items-start gap-4">
    <div className="bg-blue-100 p-2.5 rounded-full mt-0.5 flex-shrink-0" aria-hidden="true">
      {icon}
    </div>
    <div>
      <h3 className="font-semibold text-gray-800 text-base">{title}</h3>
      <div className="text-gray-600 text-sm">{content}</div>
    </div>
  </div>
));

const SocialIcon = React.memo(({ href, icon, label, color, hoverColor }: {
  href: string;
  icon: React.ReactNode;
  label: string;
  color: string;
  hoverColor: string;
}) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`bg-white p-4 rounded-full shadow-md ${color} ${hoverColor} transition-colors text-2xl focus:outline-none focus:ring-4 focus:ring-blue-300`}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    aria-label={`Síguenos en ${label}`}
  >
    {icon}
  </motion.a>
));

export default AboutUs;