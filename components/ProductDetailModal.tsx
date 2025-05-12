import { Product } from '@/types/types';
import { motion, AnimatePresence } from 'framer-motion';
import { CldImage } from 'next-cloudinary';
import { useRef, useCallback, useEffect } from 'react';
import { FaWhatsapp, FaTimes, FaStar } from 'react-icons/fa';
import { useCart } from './CartContext';

type ProductDetailModalProps = {
  product: Product | null;
  onClose: () => void;
  isOpen: boolean;
};

const ProductDetailModal = ({ product, onClose, isOpen }: ProductDetailModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();

  const handleWhatsAppConsult = useCallback((productName: string) => {
    const message = encodeURIComponent(`Hola, estoy interesado en obtener más información sobre el producto: ${productName}. ¿Podrías proporcionarme más detalles?`);
    window.open(`https://wa.me/573147845883?text=${message}`, '_blank');
  }, []);

  const getNumericId = useCallback((id: string): number => {
    const numId = parseInt(id, 10);
    if (!isNaN(numId)) return numId;
    
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      const char = id.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            ref={modalRef}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="bg-white p-6 rounded-lg shadow-lg relative max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 z-10"
              aria-label="Cerrar modal"
            >
              <FaTimes size={20} />
            </button>
            
            {product && (
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/2 flex justify-center items-center border rounded-lg shadow-2xl">
                  <CldImage
                    quality="auto"
                    width="300" 
                    height="300"  
                    src={product.imagePublicId}
                    alt={product.name}
                    className="object-contain rounded-lg max-w-full max-h-[300px]"  
                  />
                </div>
                
                <div className="md:w-1/2">
                  <div className="flex items-center mb-2">
                    <h2 className="text-xm font-bold">{product.name}</h2>
                    {product.featured && (
                      <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded flex items-center">
                        <FaStar className="inline-block mr-1" size={10} />
                        Destacado
                      </span>
                    )}
                  </div>
                  
                  <div className="mb-4 flex flex-wrap gap-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {product.inStock ? 'Disponible' : 'Agotado'}
                    </span>
                    
                    {product.category && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                        {product.category}
                      </span>
                    )}
                  </div>
                  
                  {(product.tags?.length ?? 0) > 0 && (
                    <div className="mb-4">
                      <h3 className="text-sm font-medium mb-1">Etiquetas:</h3>
                      <div className="flex flex-wrap gap-1">
                        {(product.tags ?? []).map(tag => (
                          <span key={tag} className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="text-sm font-medium mb-1">Descripción:</h3>
                    <div className="text-gray-700 text-sm space-y-1">
                      {product.description.split('\n').map((line, index) => (
                        <p key={index}>{line}</p>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => {
                        addToCart({
                          id: getNumericId(product.id),
                          name: product.name,
                          quantity: 1,
                          price: 0,
                          imagePublicId: product.imagePublicId
                        });
                        onClose();
                      }}
                      className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors flex-1"
                      aria-label="Añadir al carrito"
                    >
                      Añadir al carrito
                    </button>
                    
                    <button
                      onClick={() => handleWhatsAppConsult(product.name)}
                      className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors flex items-center justify-center"
                      aria-label="Consultar por WhatsApp"
                    >
                      <FaWhatsapp size={18} className="mr-2" />
                      Consultar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductDetailModal;