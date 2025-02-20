import { useState, useEffect } from 'react'; 
import { CldImage } from 'next-cloudinary';
import { products, categories } from '../data/products';
import { useCart } from './CartContext';
import { FaWhatsapp } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface ProductGridProps {
  category?: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({ category }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(category || null);
  const [showInStock, setShowInStock] = useState<boolean>(false);
  const { addToCart } = useCart();

  useEffect(() => {
    if (category !== undefined) {
      setSelectedCategory(category);
    }
  }, [category]);

  const filteredProducts = products.filter((product) => {
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    const matchesStock = !showInStock || product.inStock;
    return matchesCategory && matchesStock;
  });

  const handleWhatsAppConsult = (productName: string) => {
    const message = encodeURIComponent(`Hola, estoy interesado en obtener más información sobre el producto: ${productName}. ¿Podrías proporcionarme más detalles?`);
    window.open(`https://wa.me/573147845883?text=${message}`, '_blank');
  };

  const filterVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto" },
  };

  return (
    <div className="text-black"> {/* Aplica texto negro a todo el contenedor */}
      {/* Filters */}
      <div className="mb-8 p-4 bg-white rounded-lg shadow">
        <h3 className="font-semibold mb-4">Filtros</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Categoría</label>
            <motion.select
              initial="hidden"
              animate="visible"
              variants={filterVariants}
              transition={{ duration: 0.5 }}
              className="w-full p-2 border rounded"
              onChange={(e) => setSelectedCategory(e.target.value || null)}
              value={selectedCategory || ''}
            >
              <option value="">Todas las categorías</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </motion.select>
          </div>
        </div>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((product) => (
          <motion.div 
            key={product.id} 
            className="bg-white rounded-lg shadow-md overflow-hidden p-4 flex items-center space-x-4"
            whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0,0,0,0.2)" }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <CldImage
              width="150"
              height="150"
              src={product.imagePublicId}
              alt={product.name}
              className="object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="text-md font-semibold">{product.name}</h3>
              <p className="text-sm mt-1">{product.description}</p>
              <div className="mt-2 flex items-center space-x-2">
                <span onClick={() => handleWhatsAppConsult(product.name)} className={`px-2 py-1 rounded text-xs ${product.inStock ? 
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
                onClick={() => addToCart({ id: product.id, name: product.name, quantity: 1, price: 0 })}
                className="mt-2 bg-blue-500 text-white text-sm py-1 px-3 rounded hover:bg-blue-600"
              >
                Añadir al carrito
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
