import { Product } from '@/types/types';
import { motion, AnimatePresence } from 'framer-motion';
import { CldImage } from 'next-cloudinary';
import { useRef, useCallback, useEffect, useMemo } from 'react';
import { FaWhatsapp, FaTimes, FaStar, FaShare, FaShoppingCart } from 'react-icons/fa';
import { useCart } from './CartContext';
import toast from 'react-hot-toast';

type ProductDetailModalProps = {
  product: Product | null;
  onClose: () => void;
  isOpen: boolean;
};

const MODAL_ANIMATION_DURATION = 0.15;
const TOAST_DURATION = 1500;
const IMAGE_SIZE = 200;

const ProductDetailModal = ({ product, onClose, isOpen }: ProductDetailModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();
  const modalStateRef = useRef({ opened: false, historyPushed: false });

  const productTags = useMemo(() => product?.tags?.slice(0, 3) ?? [], [product?.tags]);
  const hasTags = useMemo(() => productTags.length > 0, [productTags]);
  const productDescription = useMemo(() => {
    const desc = product?.description || '';
    return desc.length > 200 ? desc.substring(0, 200) + '...' : desc;
  }, [product?.description]);

  // Agregar entrada al historial cuando se abre el modal
  useEffect(() => {
    if (isOpen && product && !modalStateRef.current.historyPushed) {
      // Agregar entrada específica para el modal
      window.history.pushState(
        { modalOpen: true, productSlug: product.slug },
        '',
        window.location.href
      );
      modalStateRef.current.historyPushed = true;
      modalStateRef.current.opened = true;
    }
    
    // Resetear cuando se cierra
    if (!isOpen) {
      modalStateRef.current.historyPushed = false;
      modalStateRef.current.opened = false;
    }
  }, [isOpen, product]);

  const copyProductUrlToClipboard = useCallback(async () => {
    if (!product) {
      toast.error('No se pudo obtener el producto');
      return;
    }

    const productUrl = `${window.location.origin}${window.location.pathname}?product=${product.slug}`;
    
    try {
      await navigator.clipboard.writeText(productUrl);
      toast.success('Enlace copiado', { duration: TOAST_DURATION });
    } catch (error) {
      console.error('Error al copiar:', error);
      toast.error('Error al copiar');
    }
  }, [product]);

  const handleWhatsAppConsult = useCallback((productName: string) => {
    const message = `Hola, me interesa: ${productName}. ¿Podrían darme más información?`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/573147845883?text=${encodedMessage}`, '_blank', 'noopener noreferrer');
  }, []);

  const getNumericId = useCallback((id: string): number => {
    const numId = parseInt(id, 10);
    if (!isNaN(numId)) return numId;
    
    return Math.abs(id.split('').reduce((hash, char) => {
      return ((hash << 5) - hash) + char.charCodeAt(0);
    }, 0));
  }, []);

  const handleAddToCart = useCallback(() => {
    if (!product) return;
    
    addToCart({
      id: getNumericId(product.id),
      name: product.name,
      quantity: 1,
      price: 0,
      imagePublicId: product.imagePublicId
    });
    toast.success('Producto añadido', { duration: TOAST_DURATION });
    handleClose();
  }, [product, addToCart, getNumericId]);

  // Cerrar modal correctamente
  const handleClose = useCallback(() => {
    // Si agregamos una entrada al historial, usar back()
    if (modalStateRef.current.historyPushed) {
      window.history.back();
    } else {
      // Si no, cerrar directamente
      onClose();
    }
  }, [onClose]);

  // Manejar popstate (botón back del navegador o gestos)
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const state = event.state;
      
      // Si el modal está abierto y se detecta un back sin estado de modal
      // significa que el usuario dio back para cerrar el modal
      if (isOpen && !state?.modalOpen && modalStateRef.current.opened) {
        onClose();
      }
    };

    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isOpen, onClose]);

  // Cerrar con ESC y bloquear scroll
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleClose]);

  // Click fuera del modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, handleClose]);

  if (!product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: MODAL_ANIMATION_DURATION }}
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-3 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="product-modal-title"
        >
          <motion.div
            ref={modalRef}
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ 
              duration: MODAL_ANIMATION_DURATION,
              type: "spring",
              damping: 25
            }}
            className="bg-white rounded-xl shadow-2xl relative w-full max-w-md max-h-[85vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white sticky top-0 z-10">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <h2 
                  id="product-modal-title" 
                  className="text-lg font-bold text-gray-900 truncate"
                  title={product.name}
                >
                  {product.name}
                </h2>
                {product.featured && (
                  <FaStar className="text-yellow-400 flex-shrink-0" size={16} />
                )}
              </div>
              <button 
                onClick={handleClose}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors ml-2"
                aria-label="Cerrar"
              >
                <FaTimes size={18} />
              </button>
            </div>

            {/* Contenido scrollable */}
            <div className="flex-1 overflow-y-auto">
              {/* Imagen */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex justify-center items-center bg-gray-50 rounded-lg p-3">
                  <CldImage
                    loading="lazy"
                    quality="auto"
                    width={IMAGE_SIZE}
                    height={IMAGE_SIZE}
                    src={product.imagePublicId}
                    alt={product.name}
                    className="object-contain rounded-lg w-full h-auto max-h-48"
                    sizes="(max-width: 768px) 90vw, 400px"
                  />
                </div>
              </div>

              {/* Información del producto */}
              <div className="p-4 space-y-4">
                {/* Estado y categoría */}
                <div className="flex flex-wrap gap-2">
                  <span 
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      product.inStock 
                        ? 'bg-green-100 text-green-700 border border-green-200' 
                        : 'bg-red-100 text-red-700 border border-red-200'
                    }`}
                  >
                    {product.inStock ? '✓ Disponible' : '✗ Agotado'}
                  </span>
                  
                  {product.category && (
                    <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold border border-blue-200">
                      {product.category}
                    </span>
                  )}
                </div>

                {/* Etiquetas */}
                {hasTags && (
                  <div>
                    <h3 className="text-sm font-medium mb-2 text-gray-600">Etiquetas:</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {productTags.map(tag => (
                        <span 
                          key={tag} 
                          className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full border border-gray-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Descripción */}
                <div>
                  <h3 className="text-sm font-medium mb-2 text-gray-600">Descripción:</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {productDescription}
                  </p>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="p-4 border-t border-gray-100 bg-white sticky bottom-0 space-y-2">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-semibold flex items-center justify-center gap-2 shadow-sm hover:shadow-md active:scale-95 transition-transform"
              >
                <FaShoppingCart size={16} />
                {product.inStock ? 'Añadir al carrito' : 'No disponible'}
              </button>
              
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={copyProductUrlToClipboard}
                  className="bg-gray-100 text-gray-700 py-2.5 px-3 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center gap-2 text-sm"
                >
                  <FaShare size={14} />
                  Compartir
                </button>
                
                <button
                  onClick={() => handleWhatsAppConsult(product.name)}
                  className="bg-green-500 text-white py-2.5 px-3 rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center justify-center gap-2 text-sm"
                >
                  <FaWhatsapp size={16} />
                  WhatsApp
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductDetailModal;
