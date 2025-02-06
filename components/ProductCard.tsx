import { motion } from "framer-motion";
import { fadeIn } from "@/utils/animations";

const ProductCard = ({ product }) => {
  return (
    <motion.div variants={fadeIn} initial="hidden" animate="visible" className="p-4 bg-white rounded-lg shadow-lg">
      <h3 className="font-bold">{product.name}</h3>
      <button className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-2">Agregar</button>
    </motion.div>
  );
};

export default ProductCard;
