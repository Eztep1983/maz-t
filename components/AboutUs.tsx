"use client";

import { motion } from "framer-motion";
import { 
  FaFacebook, 
  FaInstagram, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope, 
  FaUsers, 
  FaHistory, 
  FaCheck, 
  FaAward 
} from "react-icons/fa";
import { useState } from "react";
import Image from "next/image";
import React from "react";
import Head from 'next/head'


interface AboutUsProps {
  onContactClick?: () => void;
}

type TabType = "historia" | "mision" | "equipo";

const AboutUs = ({ onContactClick }: AboutUsProps) => {
  // Constants and configuration
  const IMAGES = [
    "/images/Instalaciones2.jpeg",
    "/images/Instalaciones1.jpeg",
    "/images/Toners_entrada.jpeg",
  ];
  
  const BRANDS = [
    "Toshiba", "Konica Minolta", "Canon", "HP", "Ricoh", "Epson", "Samsung"
  ];

  const CLOUDINARY_BASE_URL = "https://res.cloudinary.com/dzqm5gmyg/image/upload";
  const LOGO_PUBLIC_ID = "company-items/logotipoTmz";
  const LOGO_URL = `${CLOUDINARY_BASE_URL}/${LOGO_PUBLIC_ID}`;

  const CONTACT_INFO = {
    address: "Calle 20 # 27-105, Las Cuadras Pasto, Nariño, Colombia",
    phone: "+57 314-784-5883",
    email: "tmazqualitytoner@gmail.com",
    businessHours: {
      weekdays: "Lunes a Viernes: 8:00 AM - 6:00 PM",
      saturday: "Sábados: 9:00 AM - 1:00 PM"
    }
  };

  const SOCIAL_LINKS = {
    facebook: "https://www.facebook.com/konica.minolta.7140",
    instagram: "https://www.instagram.com/pro_toshiba_service?igsh=bWR1cmx2bzJmbHl0"
  };

  // State
  const [activeTab, setActiveTab] = useState<TabType>("historia");

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
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  const handleContactClick = () => {
    onContactClick?.();
  };

  // Tab content components
  const HistoriaContent = () => (
    <>
      <p className="mb-4 leading-relaxed">
        Somos una empresa distribuidora de Toner ubicada en la ciudad de Pasto, Nariño-Colombia, especializada en la venta de insumos y repuestos para 
        fotocopiadoras e impresoras, incluyendo máquinas multifuncionales de las marcas 
        más reconocidas del mercado.
      </p>
      <p className="mb-4 leading-relaxed">
        Fundada hace más de una década y con 20 años de experiencia en el sector, nuestra empresa ha crecido constantemente gracias a la 
        confianza de nuestros clientes y a nuestro compromiso con la calidad y el servicio.
      </p>
      <p className="leading-relaxed">
        Hoy en día, somos referentes en el sector, ofreciendo soluciones integrales para 
        empresas de todos los tamaños que buscan optimizar sus procesos de impresión y 
        reducir costos sin sacrificar calidad.
      </p>
    </>
  );

  const MisionContent = () => (
    <>
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
    </>
  );

  const EquipoContent = () => (
    <>
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
      className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 rounded-lg py-12 px-4 sm:px-6 lg:px-8 relative"
      style={{ backgroundImage: "url('/images/EntradaDerecha.jpeg')", backgroundSize: "1000px", backgroundPosition: "top", backgroundRepeat: "no-repeat" }}>
      <div className="absolute inset-0 bg-gradient-to-b from-white/70 to-white pointer-events-none"></div>
      <div className="relative max-w-7xl mx-auto">
      {/* Hero Section */}
      <motion.section 
      className="text-center mb-16 flex flex-col md:flex-row items-center justify-center gap-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      >
      <div className="relative w-28 h-28 md:w-32 md:h-32 border-4 border-gray-300 rounded-lg">
      <Image 
      src={LOGO_URL} 
      alt="Tmaz Quality Toner Logo" 
      fill
      className="rounded-lg shadow-lg object-contain"
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
      Toshiba Soporte Autorizado
      </h2>
      <p className="text-black text-lg max-w-3xl mx-auto leading-relaxed">
      Distribuidores de Toner, repuestos y consumibles para impresoras y fotocopiadoras.
      </p>
      </div>
      </motion.section>

      {/* Main Content Section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-16">
      {/* Image Gallery */}
      <motion.div 
      className="lg:col-span-2"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      >
      <div className="grid grid-cols-2 gap-4">
      {IMAGES.map((img, index) => (
      <motion.div
      key={index}
      className={`relative rounded-lg overflow-hidden shadow-lg ${
      index === 0 ? "col-span-2 row-span-1 h-48" : "aspect-square"
      }`}
      variants={itemVariants}
      whileHover={{ scale: 1.03 }}
      >
      <Image
      src={img}
      alt={`Instalaciones Tmaz ${index + 1}`}
      fill
      className="object-cover"
      sizes={index === 0 ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 1024px) 50vw, 25vw"}
      />
      </motion.div>
      ))}
      </div>
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
      Marcas con las que Trabajamos
      </h2>
      <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
      {BRANDS.map((brand) => (
      <motion.div
      key={brand}
      className="bg-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-full shadow-md text-gray-700 font-medium"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      >
      {brand}
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
      Nuestro punto de venta autorizado
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
      content={CONTACT_INFO.phone}
      />
      <ContactInfoItem 
      icon={<FaEnvelope className="text-blue-600" />}
      title="Correo Electrónico"
      content={CONTACT_INFO.email}
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
      </div>
      </motion.div>
      </section>

      {/* Social Media Section */}
      <motion.section 
      className="text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.9 }}
      >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Síguenos en Redes Sociales</h2>
      <div className="flex justify-center gap-6">
      <SocialIcon 
      href={SOCIAL_LINKS.facebook}
      icon={<FaFacebook />}
      color="text-blue-600"
      hoverColor="hover:bg-blue-50"
      />
      <SocialIcon 
      href={SOCIAL_LINKS.instagram}
      icon={<FaInstagram />}
      color="text-pink-600"
      hoverColor="hover:bg-pink-50"
      />
      </div>
      
      <motion.button
      className="mt-10 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all"
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