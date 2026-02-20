// components/ProductDetailModal.tsx

import { Product } from '@/types/types';
import { motion, AnimatePresence } from 'framer-motion';
import { CldImage } from 'next-cloudinary';
import { useRef, useCallback, useEffect, useMemo } from 'react';
import { FaWhatsapp, FaTimes, FaStar, FaShare, FaShoppingCart, FaCheck } from 'react-icons/fa';
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

  const productTags = useMemo(() => product?.tags?.slice(0, 3) ?? [], [product?.tags]);
  const hasTags = productTags.length > 0;

  const productDescription = useMemo(() => {
    const desc = product?.description || '';
    return desc.length > 200 ? `${desc.substring(0, 200)}...` : desc;
  }, [product?.description]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  // ── ESC key ───────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleClose]);

  // ── Botón back de Android / navegador ────────────────────────────────────
  // ProductGrid ya hizo pushState al abrir el modal.
  // Cuando el usuario presiona "atrás", popstate se dispara
  // y llamamos onClose (que en ProductGrid hace replaceState → /catalog).

  useEffect(() => {
    if (!isOpen) return;
    const onPopState = () => {
      onClose();
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [isOpen, onClose]);

  // ── Click outside ─────────────────────────────────────────────────────────

  useEffect(() => {
    if (!isOpen) return;
    const onMouseDown = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        handleClose();
      }
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [isOpen, handleClose]);

  // ── Actions ───────────────────────────────────────────────────────────────

  const showCopySuccessToast = useCallback(() => {
    toast.custom(
      () => (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="bg-white border border-green-200 shadow-lg rounded-lg px-4 py-3 flex items-center gap-3"
        >
          <div className="bg-green-100 rounded-full p-1">
            <FaCheck className="text-green-600" size={14} />
          </div>
          <span className="text-gray-800 font-medium">Link del producto copiado</span>
        </motion.div>
      ),
      { duration: TOAST_DURATION, position: 'bottom-center' }
    );
  }, []);

  const copyProductUrlToClipboard = useCallback(async () => {
    if (!product) return;
    const url = `${window.location.origin}/catalog/${product.slug}`;

    const fallback = (text: string) => {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;opacity:0;';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      try {
        document.execCommand('copy') ? showCopySuccessToast() : toast.error('No se pudo copiar');
      } finally {
        document.body.removeChild(ta);
      }
    };

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        showCopySuccessToast();
      } else {
        fallback(url);
      }
    } catch {
      fallback(url);
    }
  }, [product, showCopySuccessToast]);

  const handleWhatsAppConsult = useCallback((name: string) => {
    const msg = encodeURIComponent(`Hola, me interesa: ${name}. ¿Podrían darme más información?`);
    window.open(`https://wa.me/573147845883?text=${msg}`, '_blank', 'noopener noreferrer');
  }, []);

  const getNumericId = useCallback((id: string): number => {
    const n = parseInt(id, 10);
    return isNaN(n)
      ? Math.abs(id.split('').reduce((h, c) => ((h << 5) - h) + c.charCodeAt(0), 0))
      : n;
  }, []);

  const handleAddToCart = useCallback(() => {
    if (!product) return;
    addToCart({
      id: getNumericId(product.id),
      name: product.name,
      quantity: 1,
      price: 0,
      imagePublicId: product.imagePublicId,
    });
    toast.success('Producto añadido', { duration: TOAST_DURATION });
    handleClose();
  }, [product, addToCart, getNumericId, handleClose]);

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
          aria-describedby="product-modal-description"
          itemScope
          itemType="https://schema.org/Product"
        >
          <motion.div
            ref={modalRef}
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: MODAL_ANIMATION_DURATION, type: "spring", damping: 25 }}
            className="bg-white rounded-xl shadow-2xl relative w-full max-w-md max-h-[85vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <header className="flex items-center justify-between p-4 border-b border-gray-100 bg-white sticky top-0 z-10">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <h2
                  id="product-modal-title"
                  className="text-lg font-bold text-gray-900 truncate"
                  title={product.name}
                  itemProp="name"
                >
                  {product.name}
                </h2>
                {product.featured && (
                  <FaStar className="text-yellow-400 flex-shrink-0" size={16} aria-label="Producto destacado" />
                )}
              </div>
              <button
                onClick={handleClose}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors ml-2"
                aria-label="Cerrar"
              >
                <FaTimes size={18} />
              </button>
            </header>

            {/* Body */}
            <main className="flex-1 overflow-y-auto">
              <div className="p-4 border-b border-gray-100">
                <div className="flex justify-center items-center bg-gray-50 rounded-lg p-3">
                  <CldImage
                    loading="lazy"
                    quality="auto"
                    width={IMAGE_SIZE}
                    height={IMAGE_SIZE}
                    src={product.imagePublicId}
                    alt={`Imagen de ${product.name}`}
                    className="object-contain rounded-lg w-full h-auto max-h-48"
                    sizes="(max-width: 768px) 90vw, 400px"
                    itemProp="image"
                  />
                </div>
              </div>

              <div className="p-4 space-y-4">
                <div className="flex flex-wrap gap-2">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      product.inStock
                        ? 'bg-green-100 text-green-700 border border-green-200'
                        : 'bg-red-100 text-red-700 border border-red-200'
                    }`}
                    itemProp="availability"
                    content={product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'}
                  >
                    {product.inStock ? '✓ Disponible' : '✗ Agotado'}
                  </span>

                  {product.category && (
                    <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold border border-blue-200">
                      {product.category}
                    </span>
                  )}
                </div>

                {hasTags && (
                  <section aria-label="Etiquetas del producto">
                    <h3 className="text-sm font-medium mb-2 text-gray-600">Etiquetas:</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {productTags.map(tag => (
                        <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full border border-gray-200">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </section>
                )}

                <section aria-label="Descripción del producto">
                  <h3 className="text-sm font-medium mb-2 text-gray-600">Descripción:</h3>
                  <p
                    id="product-modal-description"
                    className="text-gray-700 text-sm leading-relaxed"
                    itemProp="description"
                  >
                    {productDescription}
                  </p>
                </section>
              </div>
            </main>

            {/* Footer */}
            <footer className="p-4 border-t border-gray-100 bg-white sticky bottom-0 space-y-2">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600
                  disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold
                  flex items-center justify-center gap-2 shadow-sm hover:shadow-md
                  active:scale-95 transition-all"
              >
                <FaShoppingCart size={16} />
                {product.inStock ? 'Añadir al carrito' : 'No disponible'}
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={copyProductUrlToClipboard}
                  className="bg-gray-100 text-gray-700 py-2.5 px-3 rounded-lg hover:bg-gray-200
                    transition-colors font-medium flex items-center justify-center gap-2 text-sm"
                >
                  <FaShare size={14} />
                  Compartir
                </button>

                <button
                  onClick={() => handleWhatsAppConsult(product.name)}
                  className="bg-green-500 text-white py-2.5 px-3 rounded-lg hover:bg-green-600
                    transition-colors font-medium flex items-center justify-center gap-2 text-sm"
                >
                  <FaWhatsapp size={16} />
                  WhatsApp
                </button>
              </div>
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductDetailModal;