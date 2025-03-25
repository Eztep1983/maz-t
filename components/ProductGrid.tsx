import { useState, useEffect, useRef, useMemo, useCallback } from 'react'; 
import { CldImage } from 'next-cloudinary';
import { useCart } from './CartContext';
import { FaWhatsapp, FaTimes, FaSearch, FaChevronDown, FaFilter, FaStar } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../services/firebaseConfig'; 
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  imagePublicId: string;
  inStock: boolean;
  featured?: boolean;
  tags?: string[];
}

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}
  
const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();
  
  const getNumericId = (id: string): number => {
    const numId = parseInt(id, 10);
    if (!isNaN(numId)) {
      return numId;
    } else {
      let hash = 0;
      for (let i = 0; i < id.length; i++) {
        const char = id.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
      }
      return Math.abs(hash);
    }
  };
  
  const handleWhatsAppConsult = (productName: string) => {
    const message = encodeURIComponent(`Hola, estoy interesado en obtener más información sobre el producto: ${productName}. ¿Podrías proporcionarme más detalles?`);
    window.open(`https://wa.me/573147845883?text=${message}`, '_blank');
  };
  
  if (!product) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 overflow-y-auto"
    >
      <motion.div
        ref={modalRef}
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="bg-white p-6 rounded-lg shadow-lg relative max-w-2xl w-full"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 z-10"
          aria-label="Cerrar"
        >
          <FaTimes size={20} />
        </button>
        
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/2 flex justify-center items-center">
            <CldImage
              width="300" 
              height="300"  
              src={product.imagePublicId}
              alt={product.name}
              className="object-contain rounded-lg max-w-full max-h-[300px]"  
            />
          </div>
          
          <div className="md:w-1/2">
            <div className="flex items-center mb-2">
              <h2 className="text-xl font-bold">{product.name}</h2>
              {product.featured && (
                <span className="ml-2 bg-yellow-400 text-xs px-2 py-1 rounded">
                  <FaStar className="inline-block mr-1" size={10} />
                  Destacado
                </span>
              )}
            </div>
            
            <div className="mb-4">
              <span className={`inline-block px-2 py-1 rounded text-xs ${product.inStock ? 
                'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {product.inStock ? 'Disponible' : 'Agotado'}
              </span>
              
              {product.category && (
                <span className="ml-2 inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                  {product.category}
                </span>
              )}
            </div>
            
            {product.tags && product.tags.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-1">Etiquetas:</h3>
                <div className="flex flex-wrap gap-1">
                  {product.tags.map(tag => (
                    <span key={tag} className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-1">Descripción:</h3>
              <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => addToCart({ 
                  id: getNumericId(product.id), 
                  name: product.name, 
                  quantity: 1, 
                  price: 0 
                })}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 flex-1"
              >
                Añadir al carrito
              </button>
              
              <button
                onClick={() => handleWhatsAppConsult(product.name)}
                className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 flex items-center justify-center"
                aria-label="Consultar por WhatsApp"
              >
                <FaWhatsapp size={18} className="mr-2" />
                Consultar
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const ProductGrid: React.FC<{ category?: string }> = ({ category }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(category || null);
  const [showInStock, setShowInStock] = useState<boolean>(false);
  const [sortOption, setSortOption] = useState<string>("featured");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState(true);  
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { addToCart } = useCart();
  const modalRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const productsRef = collection(db, "products");
        
        // Create a base query - could add more sophisticated querying here
        let productsQuery = query(productsRef);
        
        // You could add server-side filtering here if needed
        // if (selectedCategory) {
        //   productsQuery = query(productsQuery, where("category", "==", selectedCategory));
        // }
        
        const querySnapshot = await getDocs(productsQuery);
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
              inStock: Boolean(data.inStock),
              featured: Boolean(data.featured),
              tags: Array.isArray(data.tags) ? data.tags : []
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

  // Extract categories with useMemo for better performance
  const { uniqueCategories, uniqueTags } = useMemo(() => {
    const categories = products
      .map(p => p.category)
      .filter(cat => cat !== undefined && cat !== null && cat !== "");
    
    // Use a Set to get unique values and convert back to array
    const uniqueCategories = [...new Set(categories)].sort();
    
    // Extract unique tags
    const allTags = products.flatMap(p => p.tags || []);
    const uniqueTags = [...new Set(allTags)].sort();
    
    return { uniqueCategories, uniqueTags };
  }, [products]);

  // Filter categories based on search term
  const filteredCategories = useMemo(() => {
    return searchTerm.trim() === '' 
      ? uniqueCategories 
      : uniqueCategories.filter(cat => 
          cat.toLowerCase().includes(searchTerm.toLowerCase())
        );
  }, [uniqueCategories, searchTerm]);

  // Filter and sort products with useMemo
  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      const matchesStock = !showInStock || product.inStock;
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.some(tag => product.tags?.includes(tag));
      
      // Add filter by search term for product name or description
      const matchesSearch = searchTerm.trim() === '' || 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesCategory && matchesStock && matchesTags && matchesSearch;
    });
    
    // Sort products
    return result.sort((a, b) => {
      switch (sortOption) {
        case "featured":
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        case "name_asc":
          return a.name.localeCompare(b.name);
        case "name_desc":
          return b.name.localeCompare(a.name);
        case "availability":
          return (b.inStock ? 1 : 0) - (a.inStock ? 1 : 0);
        default:
          return 0;
      }
    });
  }, [products, selectedCategory, showInStock, selectedTags, searchTerm, sortOption]);

  const handleWhatsAppConsult = useCallback((productName: string) => {
    const message = encodeURIComponent(`Hola, estoy interesado en obtener más información sobre el producto: ${productName}. ¿Podrías proporcionarme más detalles?`);
    window.open(`https://wa.me/573147845883?text=${message}`, '_blank');
  }, []);

  // Helper function to safely convert string IDs to numbers for cart
  const getNumericId = useCallback((id: string): number => {
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
  }, []);

  const selectCategory = useCallback((cat: string | null) => {
    setSelectedCategory(cat);
    setIsDropdownOpen(false);
  }, []);

  const toggleTag = useCallback((tag: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
  }, []);

  const resetFilters = useCallback(() => {
    setSelectedCategory(null);
    setShowInStock(false);
    setSelectedTags([]);
    setSearchTerm('');
    setSortOption("featured");
  }, []);

  const openProductDetail = useCallback((product: Product) => {
    setSelectedProduct(product);
  }, []);

  // Loading skeleton component for better UX
  const ProductSkeleton = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden p-4 flex items-center space-x-4">
      <div className="bg-gray-200 animate-pulse w-[150px] h-[150px] rounded-lg"></div>
      <div className="flex-1">
        <div className="bg-gray-200 animate-pulse h-5 w-3/4 mb-2 rounded"></div>
        <div className="bg-gray-200 animate-pulse h-4 w-1/2 mb-2 rounded"></div>
        <div className="mt-2 flex items-center space-x-2">
          <div className="bg-gray-200 animate-pulse h-6 w-20 rounded"></div>
        </div>
        <div className="bg-gray-200 animate-pulse h-8 w-32 mt-2 rounded"></div>
      </div>
    </div>
  );

  return (
    <div className="text-black">
      {/* Enhanced Filters with mobile-friendly toggle */}
      <div className="mb-4 p-4 bg-white rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Filtros</h3>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center space-x-1 text-blue-500">
            <FaFilter size={14} />
            <span>{showFilters ? 'Ocultar' : 'Mostrar'}</span>
          </button>
        </div>

        <div className={`space-y-4 ${showFilters ? 'block' : 'hidden md:block'}`}>
          {/* Search bar for products */}
          <div className="relative">
            <input
              type="text"
              className="w-full p-2 pl-8 border rounded"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-2 top-3 text-gray-400" />
          </div>
          
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
          {/* Tags filter */}
          {uniqueTags.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-2">Etiquetas</label>
              <div className="flex flex-wrap gap-2">
                {uniqueTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`text-xs px-2 py-1 rounded-full ${selectedTags.includes(tag) 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Category pills for quick selection */}
          {uniqueCategories.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Categorías populares:</p>
              <div className="flex flex-wrap gap-2">
              <button
              onClick={resetFilters}
              className="text-sm text-blue-500 hover:text-blue-700"
            >
              Restablecer filtros
            </button>
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

      {/* Results summary */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm">
          {filteredProducts.length} {filteredProducts.length === 1 ? 'producto encontrado' : 'productos encontrados'}
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Loading skeletons */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <ProductSkeleton key={index} />
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <motion.div 
              key={product.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden p-4 flex flex-col md:flex-row items-center space-y-3 md:space-y-0 md:space-x-4"
              whileHover={{ scale: 1.02, boxShadow: "0px 5px 15px rgba(0,0,0,0.1)" }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div 
                className="cursor-pointer relative"
                onClick={() => setSelectedImage(product.imagePublicId)}
              >
                <CldImage
                  width="150"
                  height="150"
                  src={product.imagePublicId}
                  alt={product.name}
                  className="object-cover rounded-lg"
                />
                {product.featured && (
                  <div className="absolute top-0 left-0 bg-yellow-400 text-xs px-2 py-1 rounded-tr rounded-bl">
                    <FaStar className="inline-block mr-1" size={10} />
                    Destacado
                  </div>
                )}
              </div>

              <div className="flex-1">
                <h3 className="text-md font-semibold">{product.name}</h3>
                <p className="text-sm mt-1 text-gray-600 line-clamp-2">{product.description}</p>
                
                {product.tags && product.tags.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {product.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="text-xs bg-gray-100 px-1 rounded">
                        {tag}
                      </span>
                    ))}
                    {product.tags.length > 2 && (
                      <span className="text-xs text-gray-500">
                        +{product.tags.length - 2}
                      </span>
                    )}
                  </div>
                )}
                
                <div className="mt-2 flex items-center space-x-2">
                  <span onClick={() => handleWhatsAppConsult(product.name)}className={`px-2 py-1 rounded text-xs ${product.inStock ? 
                    'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {product.inStock ? 'Disponible' : 'Agotado'}
                  </span>
                  <button
                    onClick={() => handleWhatsAppConsult(product.name)}
                    className="text-green-500 hover:text-green-700"
                    aria-label="Consultar por WhatsApp"
                  >
                    <FaWhatsapp size={24} />
                  </button>
                </div>
                <div className="mt-2 flex space-x-2">
                <button
                    onClick={() => openProductDetail(product)}
                    className="bg-gray-200 text-gray-700 text-sm py-1 px-2 rounded hover:bg-gray-300"
                    aria-label="Ver detalles del producto"
                  >
                    Ver Características
                  </button>
                  <button
                    onClick={() => addToCart({ 
                      id: getNumericId(product.id), 
                      name: product.name, 
                      quantity: 1, 
                      price: 0 
                    })}
                    className="bg-blue-500 text-white text-sm py-1 px-3 rounded hover:bg-blue-600 flex-1"
                  >
                    Añadir al carrito
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No se encontraron productos con los filtros seleccionados.</p>
          <button
            onClick={resetFilters}
            className="mt-2 text-blue-500 hover:text-blue-700"
          >
            Restablecer filtros
          </button>
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
              className="bg-white p-4 rounded-lg shadow-lg relative max-w-2xl w-full"
            >
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 right-2 text-gray-700 hover:text-gray-900 z-10"
                aria-label="Cerrar"
              >
                <FaTimes size={20} />
              </button>
              <div className="flex justify-center">
                <CldImage
                  width="500"
                  height="500"
                  src={selectedImage}
                  alt="Product image"
                  className="object-contain max-h-[70vh]"
                />
              </div>
              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => setSelectedImage(null)}
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductDetailModal 
            product={selectedProduct} 
            onClose={() => setSelectedProduct(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductGrid;