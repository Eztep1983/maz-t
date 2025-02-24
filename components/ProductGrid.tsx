import { useState, useEffect, useRef } from 'react'; 
import { CldImage } from 'next-cloudinary';
import { useCart } from './CartContext';
import { FaWhatsapp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../services/firebaseConfig'; 
import { collection, getDocs } from 'firebase/firestore';

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  imagePublicId: string;
  inStock: boolean;
}

const ProductGrid: React.FC<{ category?: string }> = ({ category }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(category || null);
  const [showInStock] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { addToCart } = useCart();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productsData: Product[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Product));
        setProducts(productsData);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  useEffect(() => {
    // Handle clicks outside the modal to close it
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setSelectedImage(null);
      }
    };

    if (selectedImage) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedImage]);

  const filteredProducts = products.filter((product) => {
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    const matchesStock = !showInStock || product.inStock;
    return matchesCategory && matchesStock;
  });

  const handleWhatsAppConsult = (productName: string) => {
    const message = encodeURIComponent(`Hola, estoy interesado en obtener más información sobre el producto: ${productName}. ¿Podrías proporcionarme más detalles?`);
    window.open(`https://wa.me/573147845883?text=${message}`, '_blank');
  };

  // Extract categories and ensure they are valid strings
  const getUniqueCategories = () => {
    const categories = products
      .map(p => p.category)
      .filter(cat => cat !== undefined && cat !== null && cat !== "");
    
    // Use a Set to get unique values and convert back to array
    return [...new Set(categories)];
  };

  const uniqueCategories = getUniqueCategories();

  return (
    <div className="text-black">
      {/* Filtros */}
      <div className="mb-8 p-4 bg-white rounded-lg shadow">
        <h3 className="font-semibold mb-4">Filtros</h3>
        <div>
          <label className="block text-sm font-medium mb-2">Categoría</label>
          <select
            className="w-full p-2 border rounded"
            onChange={(e) => setSelectedCategory(e.target.value || null)}
            value={selectedCategory || ''}
          >
            <option value="">Todas las categorías</option>
            {uniqueCategories.map((cat, index) => (
              <option key={`cat-${index}-${cat}`} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Pantalla de carga */}
      {loading ? (
        <motion.div
          className="flex justify-center items-center h-40"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product, productIndex) => (
            <motion.div 
              key={`product-${productIndex}-${product.id || "unknown"}`} 
              className="bg-white rounded-lg shadow-md overflow-hidden p-4 flex items-center space-x-4"
              whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0,0,0,0.2)" }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div 
                className="cursor-pointer"
                onClick={() => setSelectedImage(product.imagePublicId)}
              >
                <CldImage
                  width="150"
                  height="150"
                  src={product.imagePublicId}
                  alt={product.name}
                  className="object-cover rounded-lg"
                />
              </div>

              <div className="flex-1">
                <h3 className="text-md font-semibold">{product.name}</h3>
                <p className="text-sm mt-1">{product.description}</p>
                <div className="mt-2 flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded text-xs ${product.inStock ? 
                    'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {product.inStock ? 'Disponible' : 'Agotado'}
                  </span>
                  <button
                    onClick={() => handleWhatsAppConsult(product.name)}
                    className="text-green-500 hover:text-green-700"
                  >
                    <FaWhatsapp className="mr-2" size={24} />
                  </button>
                </div>
                <button
                  onClick={() => addToCart({ 
                    id: isNaN(Number(product.id)) ? productIndex : Number(product.id), 
                    name: product.name, 
                    quantity: 1, 
                    price: 0 
                  })}
                  className="mt-2 bg-blue-500 text-white text-sm py-1 px-3 rounded hover:bg-blue-600"
                >
                  Añadir al carrito
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
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
              className="bg-white p-4 rounded-lg shadow-lg"
            >
              <CldImage
                width="400"
                height="400"
                src={selectedImage}
                alt="Product image"
                className="object-contain max-h-96 max-w-full"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductGrid;