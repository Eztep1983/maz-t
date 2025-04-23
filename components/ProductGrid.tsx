"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { CldImage } from 'next-cloudinary';
import { useCart } from './CartContext';
import { FaWhatsapp, FaTimes, FaSearch, FaChevronDown, FaFilter, FaStar, FaShoppingBasket } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../services/firebaseConfig'; 
import { collection, getDocs, query } from 'firebase/firestore';
import { useDebounce } from 'use-debounce';

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

const ProductDetailModal = ({ product, onClose }: ProductDetailModalProps) => {
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

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  if (!product) return null;

  return (
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
                    price: 0 
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
      </motion.div>
    </motion.div>
  );
};

const ProductGrid = ({ category }: { category?: string }) => {
  // State management
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(6);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(category || null);
  const [showInStock, setShowInStock] = useState(false);
  const [sortOption, setSortOption] = useState("featured");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useDebounce(searchInput, 500);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  
  const { addToCart } = useCart();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsRef = collection(db, "products");
        const querySnapshot = await getDocs(query(productsRef));
        const productsData = querySnapshot.docs
          .filter(doc => doc.data().name && doc.data().imagePublicId)
          .map(doc => ({
            id: doc.id,
            name: doc.data().name,
            description: doc.data().description || "",
            category: doc.data().category || "",
            imagePublicId: doc.data().imagePublicId,
            inStock: Boolean(doc.data().inStock),
            featured: Boolean(doc.data().featured),
            tags: Array.isArray(doc.data().tags) ? doc.data().tags : []
          }));
        
        setProducts(productsData);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Error al cargar los productos. Por favor, intente más tarde.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Memoized derived data
  const { uniqueCategories, uniqueTags } = useMemo(() => {
    const categories = new Set<string>();
    const tags = new Set<string>();
    
    products.forEach(product => {
      if (product.category) categories.add(product.category);
      product.tags?.forEach(tag => tags.add(tag));
    });
    
    return {
      uniqueCategories: Array.from(categories).sort(),
      uniqueTags: Array.from(tags).sort()
    };
  }, [products]);

  const filteredCategories = useMemo(() => {
    return uniqueCategories.filter(cat => 
      cat.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [uniqueCategories, searchTerm]);

  const filteredProducts = useMemo(() => {
    return products
      .filter(product => {
        const matchesCategory = !selectedCategory || product.category === selectedCategory;
        const matchesStock = !showInStock || product.inStock;
        const matchesTags = selectedTags.length === 0 || 
          selectedTags.some(tag => product.tags?.includes(tag));
        const matchesSearch = searchTerm === '' || 
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase());
        
        return matchesCategory && matchesStock && matchesTags && matchesSearch;
      })
      .sort((a, b) => {
        switch (sortOption) {
          case "featured": return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
          case "name_asc": return a.name.localeCompare(b.name);
          case "name_desc": return b.name.localeCompare(a.name);
          case "availability": return (b.inStock ? 1 : 0) - (a.inStock ? 1 : 0);
          default: return 0;
        }
      });
  }, [products, selectedCategory, showInStock, selectedTags, searchTerm, sortOption]);

  //Paginated Products 
  const paginatedProducts = useMemo(() => {
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    return filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  }, [filteredProducts, currentPage, productsPerPage]);

  
  const totalPages = useMemo(() => {
    return Math.ceil(filteredProducts.length / productsPerPage);
  }, [filteredProducts, productsPerPage]);

  const goToPage = useCallback((pageNumber: number) => {
    setCurrentPage(Math.max(1, Math.min(pageNumber, totalPages)));
    // Opcional: hacer scroll hacia arriba cuando cambie de página
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [totalPages]);

  // Reiniciar página al cambiar filtros
    useEffect(() => {
      setCurrentPage(1);
    }, [searchTerm, selectedCategory, showInStock, selectedTags, sortOption]);

    // Proteger contra página fuera de rango
    useEffect(() => {
      if (currentPage > totalPages) {
        setCurrentPage(totalPages || 1);
      }
    }, [totalPages, currentPage]);

    // Cargar filtros desde localStorage al iniciar
    useEffect(() => {
      const savedFilters = JSON.parse(localStorage.getItem('productFilters') || '{}');
      if (savedFilters) {
        setSearchInput(savedFilters.searchInput || '');
        setSelectedCategory(savedFilters.selectedCategory || null);
        setSelectedTags(savedFilters.selectedTags || []);
        setShowFilters(savedFilters.showFilters ?? true);
      }
    }, []);

    // Guardar filtros en localStorage cuando cambian
    useEffect(() => {
      const filters = {
        searchInput,
        selectedCategory,
        selectedTags,
        showFilters
      };
      localStorage.setItem('productFilters', JSON.stringify(filters));
    }, [searchInput, selectedCategory, selectedTags, showFilters]);


  // Event handlers
  const handleWhatsAppConsult = useCallback((productName: string) => {
    const message = encodeURIComponent(`Hola, estoy interesado en el producto: ${productName}`);
    window.open(`https://wa.me/573147845883?text=${message}`, '_blank');
  }, []);

  const getNumericId = useCallback((id: string): number => {
    const num = parseInt(id, 10);
    return isNaN(num) ? Math.abs(id.split('').reduce((hash, char) => 
      ((hash << 5) - hash) + char.charCodeAt(0), 0)) : num;
  }, []);

  const selectCategory = useCallback((category: string | null) => {
    setSelectedCategory(category);
    setIsDropdownOpen(false);
  }, []);

  const toggleTag = useCallback((tag: string) => {
    setSelectedTags(prev => prev.includes(tag) 
      ? prev.filter(t => t !== tag) 
      : [...prev, tag]);
  }, []);

  const resetFilters = useCallback(() => {
    setSelectedCategory(null);
    setShowInStock(false);
    setSelectedTags([]);
    setSearchTerm('');
    setSortOption("featured");
    setCurrentPage(1); // Resetear a la primera página
  }, []);

  // UI Components
  const ProductSkeleton = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden p-4 animate-pulse">
      <div className="bg-gray-200 h-48 rounded-lg"></div>
      <div className="mt-3 space-y-2">
        <div className="bg-gray-200 h-5 rounded w-3/4"></div>
        <div className="bg-gray-200 h-4 rounded w-1/2"></div>
        <div className="bg-gray-200 h-8 rounded mt-2"></div>
      </div>
    </div>
  );
// Componente de paginación
const Pagination = () => {
  // No mostrar paginación si hay solo una página
  if (totalPages <= 1) return null;
  
  // Determinar qué botones de página mostrar
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5; // Ajusta según preferencias
    
    // Siempre incluir la primera página
    pages.push(1);
    
    // Agregar páginas intermedias
    if (currentPage > 3) {
      pages.push('...');
    }
    
    // Páginas alrededor de la actual
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (!pages.includes(i) && i > 1 && i < totalPages) {
        pages.push(i);
      }
    }
    
    // Agregar ellipsis si hay un salto
    if (currentPage < totalPages - 2) {
      pages.push('...');
    }
    
    // Siempre incluir la última página si hay más de una
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div className="flex justify-center items-center mt-8 space-x-1">
      {/* Botón Anterior */}
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Página anterior"
      >
        &laquo;
      </button>
      
      {/* Botones de páginas */}
      {getPageNumbers().map((page, index) => (
        typeof page === 'number' ? (
          <button
            key={index}
            onClick={() => goToPage(page)}
            className={`px-3 py-1 rounded-md ${
              currentPage === page
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {page}
          </button>
        ) : (
          <span key={index} className="px-2 py-1">
            {page}
          </span>
        )
      ))}
      
      {/* Botón Siguiente */}
      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Página siguiente"
      >
        &raquo;
      </button>
    </div>
  );
};

//Selector de productos por pagina 
const PerPageSelector = () => (
  <div className="flex items-center gap-2">
    <label htmlFor="perPage" className="text-sm text-gray-600">
      Mostrar:
    </label>
    <select
      id="perPage"
      value={productsPerPage}
      onChange={(e) => {
        setProductsPerPage(Number(e.target.value));
        setCurrentPage(1); // Reiniciar a la primera página al cambiar
      }}
      className="border rounded-lg px-2 py-1 text-sm"
    >
      <option value="6">6</option>
      <option value="12">12</option>
      <option value="24">24</option>
    </select>
  </div>
);

  return (
    
    <div className="container mx-auto px-4 py-8 shadow-2xl shadow-black/30">
    {/* Filtros */}
    <section className="mb-6 bg-gray-200 rounded-lg shadow-2xl p-4">
      <header className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Filtrar Productos</h2>
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden flex items-center gap-1 text-blue-600"
        >
          <FaFilter size={14} />
          <span>{showFilters ? 'Ocultar' : 'Mostrar'}</span>
        </button>
      </header>
    <AnimatePresence initial={false}>
      {showFilters && (
        <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
{/* Búsqueda */}
<motion.div 
  className="md:col-span-2 relative flex items-center justify-center p-4" // z-50 eliminado
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
>
  <FaSearch className="absolute left-6 top-7 text-gray-400" />
  <input
    type="text"
    value={searchInput}
    onChange={(e) => setSearchInput(e.target.value)}
    placeholder="Buscar productos..."
    className="w-full pl-7 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-500"
  />
</motion.div>

  
          {/* Categorías */}
          <div className="relative" ref={dropdownRef}>
            <label className="block text-sm font-medium mb-1">Categoría</label>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex justify-between items-center px-4 py-2 border rounded-lg bg-white shadow"
            >
              <span>{selectedCategory || 'Todas'}</span>
              <FaChevronDown className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
  
            {isDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
                <div 
                  onClick={() => selectCategory(null)}
                  className={`p-2 hover:bg-gray-100 cursor-pointer ${!selectedCategory ? 'bg-blue-50' : ''}`}
                >
                  Todas las categorías
                </div>
                {filteredCategories.map(cat => (
                  <div
                    key={cat}
                    onClick={() => selectCategory(cat)}
                    className={`p-2 hover:bg-gray-100 cursor-pointer ${selectedCategory === cat ? 'bg-blue-50' : ''}`}
                  >
                    {cat}
                  </div>
                ))}
              </div>
            )}
          </div>
  
          {/* Etiquetas */}
          {uniqueTags.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-1">Etiquetas</label>
              <div className="flex flex-wrap gap-2">
                {uniqueTags.slice(0, 5).map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`text-xs px-2 py-1 rounded-full transition-colors ${
                      selectedTags.includes(tag) 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
    </section>
  
    {/* Cabecera de Resultados */}
    <div className="flex flex-col md:flex-row justify-between items-center mb-6">
      <div className="flex items-center gap-4">
        <p className="text-sm text-gray-600">
          Mostrando {Math.min(productsPerPage, filteredProducts.length)} de {filteredProducts.length} productos
        </p>
        <PerPageSelector />
      </div>
  
      <div className="flex items-center gap-2 mt-2 md:mt-0">
        <label htmlFor="sort" className="text-sm text-gray-600">Ordenar por:</label>
        <select
          id="sort"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="border rounded-lg px-3 py-1 text-sm"
        >
          <option value="featured">Destacados</option>
          <option value="name_asc">Nombre (A-Z)</option>
          <option value="name_desc">Nombre (Z-A)</option>
          <option value="availability">Disponibilidad</option>
        </select>
      </div>
    </div>
  
    {/* Estados */}
    {loading ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6).fill(0).map((_, i) => <ProductSkeleton key={i} />)}
      </div>
    ) : error ? (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <p className="text-red-700">{error}</p>
      </div>
    ) : filteredProducts.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedProducts.map(product => (
          <motion.div
            key={product.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-2xl hover:shadow-black/20 transition-shadow"
            whileHover={{ y: -5 }}
          >
            <div className="relative">
              <CldImage
                width={400}
                height={300}
                src={product.imagePublicId}
                alt={product.name}
                className="w-full h-48 object-contain"
                quality="auto"
              />
              {product.featured && (
                <div className="absolute top-2 left-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded flex items-center">
                  <FaStar className="mr-1" size={10} />
                  Destacado
                </div>
              )}
            </div>
  
            <div className="p-4">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-sm">{product.name}</h3>
                <span className={`text-xs px-2 py-1 rounded ${
                  product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {product.inStock ? 'Disponible' : 'Agotado'}
                </span>
              </div>
  
              {product.category && (
                <p className="text-sm text-gray-600 mt-1">{product.category}</p>
              )}
  
              <p className="text-gray-700 text-sm mt-2 line-clamp-2">{product.description}</p>
  
              {Array.isArray(product.tags) && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {product.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleWhatsAppConsult(product.name)}
                  className="flex-1 bg-orange-400 hover:bg-orange-600 text-white py-2 px-3 rounded-lg text-sm transition-colors"
                  disabled={!product.inStock}
                >
                  Comprar Ahora
                </button>
              </div>
  
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setSelectedProduct(product)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-3 rounded-lg text-sm transition-colors"
                >
                  Detalles
                </button>
                <button
                  onClick={() =>
                    addToCart({
                      id: getNumericId(product.id),
                      name: product.name,
                      quantity: 1,
                      price: 0,
                    })
                  }
                  className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg text-sm transition-colors disabled:opacity-50"
                  disabled={!product.inStock}
                >
                  Añadir <FaShoppingBasket />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
        <div className="flex justify-center gap-4 mt-6">
          <Pagination />
        </div>
      </div>
    ) : (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-600 mb-4">No se encontraron productos</p>
        <button
          onClick={resetFilters}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          Restablecer filtros
        </button>
      </div>
    )}
  
    {/* Modal de Detalles */}
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