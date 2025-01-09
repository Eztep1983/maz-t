"use client";

import { useState } from 'react';
import ProductGrid from './ProductGrid';

const CatalogWebsite = () => {
  const [activeSection, setActiveSection] = useState('catalog');

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
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="text-xl font-bold">Your Company</div>
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveSection('catalog')}
                className={`px-3 py-2 rounded-md ${
                  activeSection === 'catalog' ? 'bg-blue-500 text-white' : 'text-gray-600'
                }`}
              >
                Catalog
              </button>
              <button
                onClick={() => setActiveSection('testimonials')}
                className={`px-3 py-2 rounded-md ${
                  activeSection === 'testimonials' ? 'bg-blue-500 text-white' : 'text-gray-600'
                }`}
              >
                Testimonials
              </button>
              <button
                onClick={() => setActiveSection('contact')}
                className={`px-3 py-2 rounded-md ${
                  activeSection === 'contact' ? 'bg-blue-500 text-white' : 'text-gray-600'
                }`}
              >
                Contact
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Product Catalog */}
        {activeSection === 'catalog' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Our Products</h2>
            <ProductGrid />
          </div>
        )}

        {/* Testimonials */}
        {activeSection === 'testimonials' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Customer Testimonials</h2>
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

        {/* Contact Form */}
        {activeSection === 'contact' && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Contact Us</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Message</label>
                <textarea
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Your message"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About Us</h3>
              <p className="text-gray-300">Your company description and mission statement.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
              <p className="text-gray-300">Email: contact@example.com</p>
              <p className="text-gray-300">Phone: (123) 456-7890</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quality Certifications</h3>
              <p className="text-gray-300">List your quality certifications here</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CatalogWebsite;