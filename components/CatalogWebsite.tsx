"use client";

import { useState } from 'react';
import ProductGrid from './ProductGrid';
import ContactForm from './ContactForm';
import Cart from './Cart';

const CatalogWebsite = () => {
  const [activeSection, setActiveSection] = useState('catalog');

  // Public ID de la imagen en Cloudinary
  const cloudinaryBaseURL = "https://res.cloudinary.com/dzqm5gmyg/image/upload";
  const publicId = "20_01_2025_04_39_57_p._m._yljtwi";
  const imageUrl = `${cloudinaryBaseURL}/${publicId}`;

  // Sample testimonials
  const testimonials = [
    {
      id: 1,
      name: "John Doe",
      comment: "Excellent products and service!",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Cart />
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              {/* Usar la imagen de Cloudinary */}
              <img src={imageUrl} alt="TonersMAZ" className="w-8 h-8 mr-2" />
              <div className="text-xl font-bold text-black">TMAZ Quality Toner</div>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveSection('catalog')}
                className={`px-3 py-2 rounded-md ${
                  activeSection === 'catalog' ? 'bg-slate-700 text-white' : 'text-gray-600'
                }`}
              >
                Catalogo
              </button>
              <button
                onClick={() => setActiveSection('testimonials')}
                className={`px-3 py-2 rounded-md ${
                  activeSection === 'testimonials' ? 'bg-slate-700 text-white' : 'text-gray-600'
                }`}
              >
                Testimonios
              </button>
              <button
                onClick={() => setActiveSection('contact')}
                className={`px-3 py-2 rounded-md ${
                  activeSection === 'contact' ? 'bg-slate-700 text-white' : 'text-gray-600'
                }`}
              >
                Contacto
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {activeSection === 'catalog' && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-black">Nuestros productos</h2>
            <ProductGrid />
          </div>
        )}
        {activeSection === 'testimonials' && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-black">Testimonios</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold">{testimonial.name}</h3>
                      <div className="flex text-yellow-400">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <span key={i}>★</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600">{testimonial.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeSection === 'contact' && <ContactForm />}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb- text-gray-50">Acerca de Nosotros</h3>
              <p className="text-gray-400">
                Somos una empresa de tecnologia enfocada en ofrecer las soluciones de calidad más altas.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Información de Contacto</h3>
              <p className="text-gray-400">Email: serviciotecnicokonicaminolta@gmail.com</p>
              <p className="text-gray-400">Phone: (57) 3147845883 </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 ">Certificaciones de calidad</h3>
              <p className="text-gray-400">Composición química del tóner</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CatalogWebsite;
