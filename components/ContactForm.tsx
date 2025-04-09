"use client";

import { useState } from 'react';
import { motion } from "framer-motion";

const ContactForm = () => {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [focused, setFocused] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      const response = await fetch('https://formspree.io/f/xnnnrnjq', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
        
        // Auto-reset success message after 5 seconds
        setTimeout(() => {
          setStatus('idle');
        }, 5000);
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFocus = (field: string) => {
    setFocused(field);
  };

  const handleBlur = () => {
    setFocused(null);
  };

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
    <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-2 text-[#20284D]">Contáctanos</h2>
        <div className="w-20 h-1 bg-[#20284D] mb-6"></div>
        <p className="text-gray-600 mb-8">Estamos aquí para ayudarte. Completa el formulario y nos pondremos en contacto contigo pronto.</p>
        
        {status === 'success' && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-md flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>¡Gracias por su mensaje! Nos pondremos en contacto con usted pronto.</span>
          </motion.div>
        )}
        
        {status === 'error' && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>Algo salió mal. Por favor, inténtelo de nuevo más tarde.</span>
          </motion.div>
        )}

        <motion.form 
          onSubmit={handleSubmit}
          variants={formContainer}
          initial="hidden"
          animate="visible"
          className="space-y-5"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <motion.div variants={formItem}>
              <label className={`block text-sm font-medium mb-2 transition-colors ${focused === 'name' ? 'text-[#20284D]' : 'text-gray-700'}`}>
                Nombre
              </label>
              <div className={`relative rounded-md shadow-sm border ${focused === 'name' ? 'border-[#20284D] ring-1 ring-[#20284D]' : 'border-gray-300'} transition-all`}>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => handleFocus('name')}
                  onBlur={handleBlur}
                  className="block w-full px-4 py-3 rounded-md focus:outline-none bg-transparent"
                  placeholder="Tu nombre"
                  required
                />
              </div>
            </motion.div>
            
            <motion.div variants={formItem}>
              <label className={`block text-sm font-medium mb-2 transition-colors ${focused === 'email' ? 'text-[#20284D]' : 'text-gray-700'}`}>
                Email
              </label>
              <div className={`relative rounded-md shadow-sm border ${focused === 'email' ? 'border-[#20284D] ring-1 ring-[#20284D]' : 'border-gray-300'} transition-all`}>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => handleFocus('email')}
                  onBlur={handleBlur}
                  className="block w-full px-4 py-3 rounded-md focus:outline-none bg-transparent"
                  placeholder="ejemplo@correo.com"
                  required
                />
              </div>
            </motion.div>
          </div>
          
          <motion.div variants={formItem}>
            <label className={`block text-sm font-medium mb-2 transition-colors ${focused === 'subject' ? 'text-[#20284D]' : 'text-gray-700'}`}>
              Asunto
            </label>
            <div className={`relative rounded-md shadow-sm border ${focused === 'subject' ? 'border-[#20284D] ring-1 ring-[#20284D]' : 'border-gray-300'} transition-all`}>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                onFocus={() => handleFocus('subject')}
                onBlur={handleBlur}
                className="block w-full px-4 py-3 rounded-md focus:outline-none bg-transparent"
                placeholder="Asunto de su mensaje"
                required
              />
            </div>
          </motion.div>
          
          <motion.div variants={formItem}>
            <label className={`block text-sm font-medium mb-2 transition-colors ${focused === 'message' ? 'text-[#20284D]' : 'text-gray-700'}`}>
              Mensaje
            </label>
            <div className={`relative rounded-md shadow-sm border ${focused === 'message' ? 'border-[#20284D] ring-1 ring-[#20284D]' : 'border-gray-300'} transition-all`}>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                onFocus={() => handleFocus('message')}
                onBlur={handleBlur}
                className="block w-full px-4 py-3 rounded-md focus:outline-none bg-transparent"
                rows={5}
                placeholder="Escriba su mensaje aquí..."
                required
              />
            </div>
          </motion.div>
          
          <motion.div variants={formItem} className="pt-2">
            <motion.button
              type="submit"
              disabled={status === 'submitting'}
              className={`w-full py-3 px-6 rounded-md transition-all font-medium text-white ${
                status === 'submitting'
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#20284D] hover:bg-opacity-90 shadow-md hover:shadow-lg'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
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