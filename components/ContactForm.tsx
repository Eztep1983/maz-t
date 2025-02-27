"use client";

import { useState } from 'react';
import { motion } from "framer-motion";

const ContactForm = () => {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

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
        setFormData({ name: '', email: '', message: '' });
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

  return (
    <motion.div                
    className="text-l font-bold text-black ml-2"
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}>
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-Azul">Contáctanos</h2>
      
      {status === 'success' && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
          Gracias por su mensaje! Nos pondremos en contacto con usted pronto.
        </div>
      )}
      
      {status === 'error' && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          Algo salió mal. Por favor, inténtelo de nuevo más tarde.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2">Nombre</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nombre"
            required
          />
        </div>
        
        <div>
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="correoejemplo@gmail.com"
            required
          />
        </div>
        
        <div>
          <label className="block text-gray-700 mb-2">Mensaje</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="Escriba su mensaje aquí..."
            required
          />
        </div>
        
        <motion.button
          type="submit"
          disabled={status === 'submitting'}
          className={`w-full py-2 px-4 rounded-md transition-colors ${
            status === 'submitting'
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {status === 'submitting' ? 'Enviando...' : 'Enviar Mensaje'}
        </motion.button>
      </form>
    </div>
    </motion.div>      
  );
};

export default ContactForm;