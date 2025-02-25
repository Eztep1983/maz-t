import { useState, useEffect, useRef } from 'react'; 
import { CldImage } from 'next-cloudinary';
import { useCart } from './CartContext';
import { FaWhatsapp, FaTimes, FaSearch, FaChevronDown } from 'react-icons/fa';
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
  const [showInStock, setShowInStock] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const { addToCart } = useCart();
  const modalRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productsData: Product[] = [];
        
        querySnapshot.docs.forEach(doc => {
          const data = doc.data();
          // Validate that the document has all required fields
          if (data.name && data.imagePublicId) {
            productsData.push({
              id: doc.id,
              name: data.name,
              description: data.description || "",
              category: data.category || "",
              imagePublicId: data.imagePublicId,
              inStock: Boolean(data.inStock)
            });
          }
        });
        
        setProducts(productsData);
      } catch (error) {
        console.error("Error al obtener productos:", error);
        setError("No se pudieron cargar los productos. Por favor, intente de nuevo más tarde.");
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
      
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (selectedImage || isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedImage, isDropdownOpen]);

  // Extract categories and ensure they are valid strings
  const getUniqueCategories = () => {
    const categories = products
      .map(p => p.category)
      .filter(cat => cat !== undefined && cat !== null && cat !== "");
    
    // Use a Set to get unique values and convert back to array
    return [...new Set(categories)].sort();
  };

  const uniqueCategories = getUniqueCategories();

  // Filter categories based on search term
  const filteredCategories = searchTerm.trim() === '' 
    ? uniqueCategories 
    : uniqueCategories.filter(cat => 
        cat.toLowerCase().includes(searchTerm.toLowerCase())
      );

  const filteredProducts = products.filter((product) => {
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    const matchesStock = !showInStock || product.inStock;
    return matchesCategory && matchesStock;
  });

  const handleWhatsAppConsult = (productName: string) => {
    const message = encodeURIComponent(`Hola, estoy interesado en obtener más información sobre el producto: ${productName}. ¿Podrías proporcionarme más detalles?`);
    window.open(`https://wa.me/573147845883?text=${message}`, '_blank');
  };

  // Helper function to safely convert string IDs to numbers for cart
  const getNumericId = (id: string): number => {
    // Try to parse the ID as a number
    const numId = parseInt(id, 10);
    // If it's a valid number, use it; otherwise use a hash of the string
    if (!isNaN(numId)) {
      return numId;
    } else {
      // Simple string hash function to create a numeric ID
      let hash = 0;
      for (let i = 0; i < id.length; i++) {
        const char = id.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
      }
      return Math.abs(hash);
    }
  };

  const selectCategory = (cat: string | null) => {
    setSelectedCategory(cat);
    setIsDropdownOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="text-black">
      {/* Enhanced Filters */}
      <div className="mb-8 p-4 bg-white rounded-lg shadow">
        <h3 className="font-semibold mb-4">Filtros</h3>
        <div className="space-y-4">
          <div className="relative" ref={dropdownRef}>
            <label className="block text-sm font-medium mb-2">Categoría</label>
            <div 
              className="w-full p-2 border rounded flex justify-between items-center cursor-pointer bg-white"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>{selectedCategory || 'Todas las categorías'}</span>
              <FaChevronDown className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </div>
            
            {/* Custom dropdown for categories */}
            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                {/* Search input for categories */}
                <div className="sticky top-0 bg-white p-2 border-b">
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full p-2 pl-8 border rounded text-sm"
                      placeholder="Buscar categoría..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <FaSearch className="absolute left-2 top-3 text-gray-400" />
                  </div>
                </div>
                
                {/* All categories option */}
                <div 
                  className={`p-2 hover:bg-gray-100 cursor-pointer ${!selectedCategory ? 'bg-blue-100' : ''}`}
                  onClick={() => selectCategory(null)}
                >
                  Todas las categorías
                </div>
                
                {/* Category list */}
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((cat) => (
                    <div 
                      key={cat} 
                      className={`p-2 hover:bg-gray-100 cursor-pointer ${selectedCategory === cat ? 'bg-blue-100' : ''}`}
                      onClick={() => selectCategory(cat)}
                    >
                      {cat}
                    </div>
                  ))
                ) : (
                  <div className="p-2 text-gray-500 text-center">
                    No se encontraron categorías
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="flex items-center">
          </div>
          {/* Category pills for quick selection */}
          {uniqueCategories.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Categorías populares:</p>
              <div className="flex flex-wrap gap-2">
                {uniqueCategories.slice(0, 5).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-xs px-2 py-1 rounded-full ${selectedCategory === cat 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  >
                    {cat}
                  </button>
                ))}
                {uniqueCategories.length > 5 && (
                  <button
                    onClick={() => setIsDropdownOpen(true)}
                    className="text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300"
                  >
                    +{uniqueCategories.length - 5} más
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Loading screen */}
      {loading ? (
        <motion.div
          className="flex justify-center items-center h-40"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </motion.div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <motion.div 
              key={product.id} 
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
                    id: getNumericId(product.id), 
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
      ) : (
        <div className="text-center py-8">
          <p>No se encontraron productos con los filtros seleccionados.</p>
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
              className="bg-white p-4 rounded-lg shadow-lg relative"
            >
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 right-2 text-gray-700 hover:text-gray-900"
              >
                <FaTimes size={20} />
              </button>
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