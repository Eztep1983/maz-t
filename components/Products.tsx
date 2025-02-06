"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ProductGrid from './ProductGrid';

const Productos = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Filtrar por categoría</h2>
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="p-2 border rounded"
      >
        <option value="all">Todos</option>
        <option value="toner">Tóner</option>
        <option value="impresoras">Impresoras</option>
        <option value="repuestos">Repuestos</option>
      </select>

      {/* Pasamos la categoría seleccionada como prop */}
      <ProductGrid category={selectedCategory === 'all' ? '' : selectedCategory} />
    </div>
  );
};

export default Productos;
