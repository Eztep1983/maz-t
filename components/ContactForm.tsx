"use client";

import { useState, useCallback } from 'react';
import { motion } from "framer-motion";
import { Facebook, Instagram } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';
type FormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xnnnrnjq';

const socialLinks = [
  {
    platform: 'Facebook',
    url: 'https://www.facebook.com/profile.php?id=61559681797295',
    icon: <Facebook size={24} />,
    className: 'bg-blue-600 hover:bg-blue-700'
  },

  {
    platform: 'WhatsApp',
    url: 'https://wa.me/573147845883',
    icon: <FaWhatsapp size={24} />,
    className: 'bg-green-500 hover:bg-green-600'
  }
];

const ContactForm = () => {
  const [status, setStatus] = useState<FormStatus>('idle');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación adicional del formulario
    if (!formData.name || !formData.email || !formData.message) {
      setStatus('error');
      return;
    }

    setStatus('submitting');

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
        
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleFocus = useCallback((field: string) => {
    setFocusedField(field);
  }, []);

  const handleBlur = useCallback(() => {
    setFocusedField(null);
  }, []);

  const formContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const formItem = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 max-w-2xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#20284D]">Contáctanos</h2>
            <div className="w-16 h-1 bg-[#20284D] mt-2"></div>
          </div>
          
          <div className="flex space-x-3">
            {socialLinks.map((link) => (
              <a
                key={link.platform}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2.5 rounded-full text-white transition-colors ${link.className}`}
                aria-label={link.platform}
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>

        <p className="text-gray-600 mb-6">
          Estamos aquí para ayudarte.
          <br /> 
          <br />
          O tambien puedes completar el formulario y nos pondremos en contacto contigo pronto.
        </p>

        {status === 'success' && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-md flex items-start"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto.</span>
          </motion.div>
        )}
        
        {status === 'error' && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md flex items-start"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>Algo salió mal. Por favor, verifica los datos e inténtalo de nuevo.</span>
          </motion.div>
        )}

        <motion.form 
          onSubmit={handleSubmit}
          variants={formContainer}
          initial="hidden"
          animate="visible"
          className="space-y-5"
          noValidate
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <motion.div variants={formItem}>
              <label 
                htmlFor="name"
                className={`block text-sm font-medium mb-2 transition-colors ${focusedField === 'name' ? 'text-[#20284D]' : 'text-gray-700'}`}
              >
                Nombre
              </label>
              <div className={`relative rounded-md shadow-sm border ${focusedField === 'name' ? 'border-[#20284D] ring-1 ring-[#20284D]' : 'border-gray-300'} transition-all`}>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => handleFocus('name')}
                  onBlur={handleBlur}
                  className="block w-full px-4 py-2.5 rounded-md focus:outline-none bg-transparent"
                  placeholder="Tu nombre"
                  required
                  minLength={2}
                />
              </div>
            </motion.div>
            
            <motion.div variants={formItem}>
              <label 
                htmlFor="email"
                className={`block text-sm font-medium mb-2 transition-colors ${focusedField === 'email' ? 'text-[#20284D]' : 'text-gray-700'}`}
              >
                Email
              </label>
              <div className={`relative rounded-md shadow-sm border ${focusedField === 'email' ? 'border-[#20284D] ring-1 ring-[#20284D]' : 'border-gray-300'} transition-all`}>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => handleFocus('email')}
                  onBlur={handleBlur}
                  className="block w-full px-4 py-2.5 rounded-md focus:outline-none bg-transparent"
                  placeholder="ejemplo@correo.com"
                  required
                />
              </div>
            </motion.div>
          </div>
          
          <motion.div variants={formItem}>
            <label 
              htmlFor="subject"
              className={`block text-sm font-medium mb-2 transition-colors ${focusedField === 'subject' ? 'text-[#20284D]' : 'text-gray-700'}`}
            >
              Asunto
            </label>
            <div className={`relative rounded-md shadow-sm border ${focusedField === 'subject' ? 'border-[#20284D] ring-1 ring-[#20284D]' : 'border-gray-300'} transition-all`}>
              <input
                id="subject"
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                onFocus={() => handleFocus('subject')}
                onBlur={handleBlur}
                className="block w-full px-4 py-2.5 rounded-md focus:outline-none bg-transparent"
                placeholder="Asunto de tu mensaje"
              />
            </div>
          </motion.div>
          
          <motion.div variants={formItem}>
            <label 
              htmlFor="message"
              className={`block text-sm font-medium mb-2 transition-colors ${focusedField === 'message' ? 'text-[#20284D]' : 'text-gray-700'}`}
            >
              Mensaje
            </label>
            <div className={`relative rounded-md shadow-sm border ${focusedField === 'message' ? 'border-[#20284D] ring-1 ring-[#20284D]' : 'border-gray-300'} transition-all`}>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                onFocus={() => handleFocus('message')}
                onBlur={handleBlur}
                className="block w-full px-4 py-2.5 rounded-md focus:outline-none bg-transparent min-h-[120px]"
                placeholder="Escribe tu mensaje aquí..."
                required
                minLength={10}
              />
            </div>
          </motion.div>
          
          <motion.div variants={formItem} className="pt-1">
            <motion.button
              type="submit"
              disabled={status === 'submitting'}
              className={`w-full py-3 px-6 rounded-md transition-all font-medium text-white ${
                status === 'submitting'
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#20284D] hover:bg-[#303f6d] shadow-md hover:shadow-lg'
              }`}
              whileHover={status !== 'submitting' ? { scale: 1.02 } : {}}
              whileTap={status !== 'submitting' ? { scale: 0.98 } : {}}
            >
              {status === 'submitting' ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enviando...
                </span>
              ) : 'Enviar Mensaje'}
            </motion.button>
          </motion.div>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default ContactForm;