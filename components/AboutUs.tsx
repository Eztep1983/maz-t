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
  FaTools,
  FaHeadset,
  FaArrowRight,
  FaWhatsapp,
  FaComment
} from "react-icons/fa";
import { useState } from "react";
import Image from "next/image";
import React from "react";
import Carousel from "./Carousel";
import { FaLifeRing } from "react-icons/fa6";

interface AboutUsProps {
  onContactClick?: () => void;
  onProductClick?: ()=> void; 
  onTestimonialsClick?: () => void;
}

type TabType = "historia" | "mision" | "equipo";

const AboutUs = ({ onContactClick, onProductClick, onTestimonialsClick }: AboutUsProps) => {
  // Constants and configuration
  const BRANDS = [
    "/images/toshiba_logo.png",
    "/images/ricoh_logo.jpg",
    "/images/Minolta_logo.jpg",
  ];

  const LOGO_URL = "/images/Logo.jpeg";
  const CONTACT_INFO = {
    address: "Calle 20 # 27-105, Las Cuadras Pasto, Nariño, Colombia",
    phone: "+57 314-784-5883",
    whatsapp: "+57 314-784-5883",
    email: "tmazqualitytoner@gmail.com",
    businessHours: {
      weekdays: "Lunes a Viernes: 9:30am - 12:00pm | 2:40pm - 6:30pm",
      saturday: "Sábados: 9:00 AM - 1:00 PM"
    }
  };

  const SOCIAL_LINKS = {
    facebook: "https://www.facebook.com/profile.php?id=61559681797295",
  };

  const CTA_OPTIONS = [
    { 
      id: "productos", 
      title: "Catálogo Toner y Productos", 
      description: "Explora nuestra amplia gama de toners y productos para todas las marcas",
      icon: <FaShoppingCart className="text-2xl text-white" />,
      action: () => onProductClick?.(),
      color: "from-Azul to-blue-600"
    },
    { 
      id: "contacto", 
      title: "Cotización Personalizada", 
      description: "¿Necesitas una solución específica? Contáctanos para una asesoría gratuita",
      icon: <FaHeadset className="text-2xl text-white" />,
      action: () => onContactClick?.(),
      color: "from-blue-600 to-Azul"
    },
    {
      id: "Opiniones", 
      title: "Mira las opiniones", 
      description: "Descubre lo que otros piensan y comparte tu experiencia. ¡Tu opinión importa!",
      icon: <FaComment className="text-2xl text-white" />,
      action: () => onTestimonialsClick?.(),
      color: "from-Azul to-blue-600"
    },
    { 
      id: "soporte", 
      title: "Ayuda y Soporte",
      description: "¿Tienes dudas o necesitas ayuda? Nuestro equipo está listo para atenderte.",
      icon: <FaLifeRing className="text-2xl text-white" />,
      action: () => onContactClick?.(),
      color: "from-blue-600 to-Azul"
    }

  ];

  // State
  const [activeTab, setActiveTab] = useState<TabType>("historia");
  const [hoverCta, setHoverCta] = useState<string | null>(null);

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
  
  const pulseAnimation = {
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 4.0,
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    }
  };
  
  const floatAnimation = {
    float: {
      y: [0, -10, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    }
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  const handleContactClick = () => {
    onContactClick?.();
  };

  const handleProductClick = () => {
    onProductClick?.(); 
  };
  
  const handleTestimonialsClick = () => {
    onTestimonialsClick?.();
  };
  
  const handleWhatsAppClick = () => {
    window.open(`https://wa.me/${CONTACT_INFO.whatsapp.replace(/\D/g, '')}?text=Hola, estoy interesado en sus productos. Quisiera más información.`, '_blank');
  };
  
  // Tab content components
  const HistoriaContent = () => (
    <>
      <p className="mb-4 leading-relaxed">
        Somos una empresa distribuidora de Toner ubicada en la ciudad de Pasto, Nariño-Colombia, especializada en la venta de toner para 
        fotocopiadoras multifuncionales de las marcas 
        más reconocidas del mercado.
      </p>
      <p className="mb-4 leading-relaxed">
        Fundada hace más de una década y con 20 años de experiencia en el sector, nuestra empresa ha crecido constantemente gracias a la 
        confianza de nuestros clientes y a nuestro compromiso con la calidad y el servicio.
      </p>
      <p className="leading-relaxed mb-6">
        Hoy en día, somos referentes en el sector, ofreciendo soluciones integrales para 
        empresas de todos los tamaños que buscan optimizar sus procesos de impresión y 
        reducir costos sin sacrificar calidad.
      </p>
      <motion.div
        variants={pulseAnimation}
        className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg shadow-sm"
      >
        <p className="text-blue-800 font-medium">
          ¿Buscas optimizar tus costos de impresión? Consulta nuestro catálogo de productos y descubre soluciones que se adaptan a tus necesidades.
          <motion.button
            onClick={handleProductClick}
            className="flex items-center text-blue-600 font-bold mt-2 hover:underline"
            whileHover={{ x: 5 }}
          >
            Ver productos <FaArrowRight className="ml-2" />
          </motion.button>
        </p>
      </motion.div>
    </>
  );

  const MisionContent = () => (
    <>
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3 text-gray-800">Nuestra Misión</h3>
        <p className="leading-relaxed">
        Proporcionanar toner compatible de altísima calidad que optimice el rendimiento de impresión,
        ofreciendo una excelente relación calidad-precio para nuestros clientes.
        </p>
      </div>
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3 text-gray-800">Nuestra Visión</h3>
        <p className="leading-relaxed">
          Ser la empresa líder en distribución de toner multicolor en la región, 
          reconocida por la calidad de nuestros productos, la excelencia en el servicio 
          y nuestro compromiso con la innovación y la sostenibilidad.
        </p>
      </div>
      <motion.div
        variants={pulseAnimation}
        className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg shadow-sm"
      >
        <p className="text-green-800 font-medium">
          Nuestro compromiso es brindarte el mejor servicio.
        </p>
      </motion.div>
    </>
  );

  const EquipoContent = () => (
    <>
      <p className="mb-4 leading-relaxed">
      Contamos con un equipo de profesionales altamente capacitados en el sector de impresión, 
      con amplia experiencia en la gestión, 
      selección y optimización de tóners para todo tipo de necesidades.
      </p>
      <div className="mb-6">
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
      <motion.div
        variants={pulseAnimation}
        className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg shadow-sm"
      >
        <p className="text-purple-800 font-medium">
          ¿Necesitas una asesoría personalizada? Nuestro equipo está listo para ayudarte.
          <motion.button
            onClick={handleContactClick}
            className="flex items-center text-blue-600 font-bold mt-2 hover:underline"
            whileHover={{ x: 5 }}
          >
            Contáctanos ahora <FaArrowRight className="ml-2" />
          </motion.button>
        </p>
      </motion.div>
    </>
  );

  const TAB_CONTENT = {
    historia: <HistoriaContent />,
    mision: <MisionContent />,
    equipo: <EquipoContent />
  };

  const TABS = [
    { id: "historia", label: "Nuestra Historia", icon: <FaHistory /> },
    { id: "mision", label: "Misión y Visión", icon: <FaAward /> },
    { id: "equipo", label: "Nuestro Equipo", icon: <FaUsers /> }
  ];

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

      <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-white pointer-events-none"></div>
      {/* Fixed WhatsApp Button */}
      <motion.button
        className="fixed bottom-6 left-6 bg-green-500 text-white p-4 rounded-full shadow-lg z-50 flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleWhatsAppClick}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <FaWhatsapp className="text-2xl" />
      </motion.button>
      
      <div className="relative max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.section 
          className="text-center mb-16 flex flex-col md:flex-row items-center justify-center gap-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="relative w-40 h-40 border-4 border-gray-300 rounded-lg">
            <Image 
              src={LOGO_URL} 
              alt="Tmaz Quality Toner Logo" 
              fill
              className="rounded-lg shadow-lg object-cover"
              priority
            />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-Azul to-blue-700">
                Tmaz Quality Toner
              </span>
            </h1>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mb-2">
              Distribuidores
            </h2>
            <p className="text-black text-lg max-w-3xl mx-auto leading-relaxed">
            Distribuidores expertos en tóners de alto rendimiento para fotocopiadoras multifuncionales 
            calidad y compatibilidad garantizada.
            </p>
          </div>
        </motion.section>
        {/* CTA Cards Section */}

        <motion.section 
            className="flex flex-col items-center px-4 max-w-7xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >

          </motion.section>
          <div className="w-[90%] mb-6 max-w-md mx-auto">
              <div className="rounded-xl shadow-md overflow-hidden">
                <Carousel />
              </div>
            </div>
        {/* Contenedor de CTAs - grid responsive */}
          <div className="w-full max-w-7xl mx-auto px-4 mb-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center">
              {CTA_OPTIONS.map((cta) => (
                <motion.div
                  key={cta.id}
                  className={`bg-gradient-to-r ${cta.color} rounded-lg shadow p-4 text-white cursor-pointer w-full`}
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={cta.action}
                  onMouseEnter={() => setHoverCta(cta.id)}
                  onMouseLeave={() => setHoverCta(null)}
                >
                  <div className="flex flex-col items-center md:items-start space-y-2">
                    <div className="bg-white/20 p-2 rounded-full">
                      {cta.icon}
                    </div>
                    <h3 className="text-lg font-bold">{cta.title}</h3>
                    <p className="text-white/90 text-sm text-center md:text-left">{cta.description}</p>
                    <motion.div 
                      className="flex items-center space-x-1 text-sm font-medium"
                      animate={{ 
                        x: hoverCta === cta.id ? 3 : 0 
                      }}
                    >
                      <span>Ver más</span>
                      <FaArrowRight size={12} />
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        {/* Main Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-16">
          {/* Image Gallery */}
          <motion.div 
            className="lg:col-span-2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <br />
            <motion.div
              className="bg-white p-5 rounded-xl shadow-md mb-6"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleProductClick}
            >
              <h3 className="text-xl font-bold text-gray-800 mb-3 text-center cursor-pointer">
                Productos Destacados
              </h3>
              <div className="relative overflow-hidden rounded-lg">
                <Image 
                  loading="lazy"
                  src="/images/Toners_consecutivo.png"
                  alt="Toner Toshiba Serie 15"
                  width={400}
                  height={400}
                  className="w-full h-auto rounded-lg shadow-md"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                  <div className="p-4 text-white w-full">
                    <p className="font-medium">Toner originales para todas las marcas</p>
                  </div>
                </div>
              </div>
              <motion.button
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-3 rounded-lg shadow-md flex items-center justify-center"
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                <FaShoppingCart className="mr-2" />
                Ver catálogo completo
              </motion.button>
            </motion.div>
            
            <motion.div
              className="bg-white p-5 rounded-xl shadow-md"
              variants={floatAnimation}
            >
              <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded-r">
                <h3 className="text-lg font-bold text-yellow-800">¡Oferta especial!</h3>
                <p className="text-yellow-700">
                  Recibe un 5% de descuento en tu primera compra como distribuidor.
                </p>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Company Info Tabs */}
          <motion.div 
            className="lg:col-span-3 bg-white rounded-xl shadow-md p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            {/* Tabs Navigation */}
            <nav className="flex flex-wrap border-b border-gray-200 mb-6">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  className={`flex items-center mr-4 py-2 px-4 font-medium text-sm rounded-t-lg transition ${
                    activeTab === tab.id 
                    ? "text-blue-600 border-b-2 border-blue-600" 
                    : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => handleTabChange(tab.id as TabType)}
                  aria-current={activeTab === tab.id ? "page" : undefined}
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
            >
              {TAB_CONTENT[activeTab]}
            </motion.div>
          </motion.div>
        </div>
        {/* Brands Section */}
        <motion.section 
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
              Toner compatible para las marcas
          </h2>
          <div className="flex flex-wrap justify-center gap-6">
            {BRANDS.map((src, index) => (
              <motion.div
                key={index}
                className="bg-white px-6 py-4 rounded-lg shadow-md"
                whileHover={{ scale: 1.05, rotate: 2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleProductClick}
              >
                <img src={src} alt={`Brand ${index}`} className="h-8 w-auto" />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Contact Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <FaMapMarkerAlt className="text-red-500 mr-2" />
              Punto autorizado de venta en pasto 
            </h2>
            <div className="rounded-xl overflow-hidden shadow-lg aspect-video">
              <iframe
                title="Ubicación de Tmaz Quality Toner"
                className="w-full h-full"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1994.45824409919!2d-77.27899399921704!3d1.2182379000000074!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e2ed4870587a903%3A0x25fc52d9359c5f6e!2sServicio%20T%C3%A9cnico%20Konica!5e0!3m2!1ses-419!2sco!4v1739395425922!5m2!1ses-419!2sco"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
            <motion.button 
              className="mt-4 bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-3 rounded-lg shadow-md flex items-center justify-center w-full"
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
              onClick={() => {
                window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(CONTACT_INFO.address)}`, '_blank');
              }}
            >
              <FaMapMarkerAlt className="mr-2" />
              Cómo llegar
            </motion.button>
          </motion.div>
          
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Información de Contacto</h2>
            <div className="bg-white rounded-xl shadow-md p-6 h-full">
              <div className="space-y-4">
                <ContactInfoItem 
                  icon={<FaMapMarkerAlt className="text-blue-600" />}
                  title="Dirección"
                  content={CONTACT_INFO.address}
                />
                <ContactInfoItem 
                  icon={<FaPhone className="text-blue-600" />}
                  title="Teléfono"
                  content={
                    <motion.a 
                      href={`tel:${CONTACT_INFO.phone}`} 
                      className="text-blue-600 hover:underline"
                      whileHover={{ x: 2 }}
                    >
                      {CONTACT_INFO.phone}
                    </motion.a>
                  }
                />
                <ContactInfoItem 
                  icon={<FaWhatsapp className="text-green-600" />}
                  title="WhatsApp"
                  content={
                    <motion.a 
                      href={`https://wa.me/${CONTACT_INFO.whatsapp.replace(/\D/g, '')}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-green-600 hover:underline"
                      whileHover={{ x: 2 }}
                    >
                      {CONTACT_INFO.whatsapp}
                    </motion.a>
                  }
                />
                <ContactInfoItem 
                  icon={<FaEnvelope className="text-blue-600" />}
                  title="Correo Electrónico"
                  content={
                    <motion.a 
                      href={`mailto:${CONTACT_INFO.email}`} 
                      className="text-blue-600 hover:underline"
                      whileHover={{ x: 2 }}
                    >
                      {CONTACT_INFO.email}
                    </motion.a>
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
              </div>
              <motion.button
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-3 rounded-lg shadow-md flex items-center justify-center w-full"
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
                onClick={handleContactClick}
              >
                <FaHeadset className="mr-2" />
                Solicitar Asesoría Personalizada
              </motion.button>
            </div>
          </motion.div>
        </section>

        {/* FAQ Section */}
        <motion.section 
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
        >
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
            Preguntas Frecuentes
          </h2>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="space-y-6">
              {[
                          
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
                  answer: "Manejamos un inventario actualizado, Te recomendamos consultarnos directamente para confirmar existencias."
                }
                
              ].map((faq, index) => (
                <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <p className="text-gray-700 mb-4">¿Tienes más preguntas? No dudes en contactarnos.</p>
              <motion.button
                className="bg-blue-600 hover:bg-blue text-white font-medium px-6 py-3 rounded-full shadow-md inline-flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleContactClick}
              >
                <FaHeadset className="mr-2" />
                Contactar Ahora
              </motion.button>
            </div>
          </div>
        </motion.section>

        {/* Call to Action Banner */}
        <motion.section 
          className="mb-16 bg-gradient-to-r from-Azul to-Azul rounded-xl shadow-lg p-8 text-white text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9 }}
          variants={pulseAnimation}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">¿Listo para optimizar tus soluciones de impresión?</h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            En Tmaz Quality Toner tenemos todo lo que necesitas para tus equipos funcionando con el máximo rendimiento y al mejor precio.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <motion.button
              className="bg-white text-blue-600 font-medium px-6 py-3 rounded-full shadow-md hover:shadow-xl transition-all inline-flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleProductClick}
            >
              <FaShoppingCart className="mr-2" />
              Ver Catálogo
            </motion.button>
            <motion.button
              className="bg-transparent border-2 border-white text-white font-medium px-6 py-3 rounded-full shadow-md hover:shadow-xl transition-all inline-flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleContactClick}
            >
              <FaHeadset className="mr-2" />
              Solicitar Cotización
            </motion.button>
          </div>
        </motion.section>

        {/* Social Media Section */}
        <motion.section 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Síguenos en</h2>
          <div className="flex justify-center gap-6">
            <SocialIcon 
              href={SOCIAL_LINKS.facebook}
              icon={<FaFacebook />}
              color="text-blue-600"
              hoverColor="hover:bg-blue-50"
            />
          </div>
          
          <p className="text-gray-600 mt-6 mb-8">
            Mantente al día con nuestras últimas promociones de toners y productos.
          </p>
          
          <motion.button
            className="mt-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-medium px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleContactClick}
            aria-label="Contáctanos"
          >
            Contáctanos Ahora
          </motion.button>
        </motion.section>
      </div>
    </div>
  );
};

// Subcomponents
const ContactInfoItem = ({ icon, title, content }: { 
  icon: React.ReactNode;
  title: string;
  content: React.ReactNode;
}) => (
  <div className="flex items-start gap-4">
    <div className="bg-blue-100 p-2.5 rounded-full mt-0.5">
      {icon}
    </div>
    <div>
      <h3 className="font-semibold text-gray-800">{title}</h3>
      <p className="text-gray-600">{content}</p>
    </div>
  </div>
);

const SocialIcon = ({ href, icon, color, hoverColor }: {
  href: string;
  icon: React.ReactNode;
  color: string;
  hoverColor: string;
}) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`bg-white p-4 rounded-full shadow-md ${color} ${hoverColor} transition-colors text-2xl`}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    aria-label={`Síguenos en ${React.isValidElement(icon) && icon.type === FaFacebook ? 'Facebook' : 'Instagram'}`}
  >
    {icon}
  </motion.a>
);

export default AboutUs;