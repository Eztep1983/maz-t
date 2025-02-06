"use client";

import { useState } from 'react';
import { CldImage } from 'next-cloudinary';
import { products, categories } from '../data/products';
import { useCart } from './CartContext';

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  imagePublicId: string;
  inStock: boolean;
  
}

const ProductGrid = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<number>(1000);
  const [showInStock, setShowInStock] = useState<boolean>(false);
  const { addToCart } = useCart();

  const filteredProducts = products.filter(product => {
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    const matchesStock = !showInStock || product.inStock;
    return matchesCategory && matchesStock;
  });

  return (
    <div>
      {/* Filters */}
      <div className="mb-8 p-4 bg-white rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Filters</h3>
        <div className="space-y-4">
          {/* Category filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select 
              className="w-full p-2 border rounded"
              onChange={(e) => setSelectedCategory(e.target.value || null)}
              value={selectedCategory || ''}
            >
              <option value="">Todas las categorias</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Stock filter */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="inStock"
              checked={showInStock}
              onChange={(e) => setShowInStock(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="inStock" className="text-sm text-gray-700">
              Show only in-stock items
            </label>
          </div>
        </div>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="aspect-w-4 aspect-h-3">
              <CldImage
                width="400"
                height="300"
                src={product.imagePublicId}
                alt={product.name}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-gray-600 mt-2">{product.description}</p>
              <div className="mt-2 flex justify-between items-center">
                <span className={`px-2 py-1 rounded text-sm ${
                  product.inStock 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
              <button
                onClick={() => addToCart({
                  id: product.id,
                  name: product.name,
                  quantity: 1,
                  price: 0
                })}
                className="mt-2 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
              >
                Añadir al carrito
              </button>
            </div>
          </div>
        ))}
      </div>
      
    </div>
    
  );
  
};

export default ProductGrid;