// data/products.ts

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  imagePublicId: string; 
  inStock: boolean;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Premium Widget",
    description: "High-quality premium widget with advanced features",
    price: 99.99,
    category: "Printers",
    imagePublicId: "TOSHIBA-PRINTER", // Replace with your actual Cloudinary public IDs
    inStock: true
  },
  {
    id: 2,
    name: "Deluxe Gadget",
    description: "Latest generation deluxe gadget",
    price: 149.99,
    category: "Electronics",
    imagePublicId: "cld-sample-3",
    inStock: true
  },
  {
    id: 3,
    name: "Professional Tool",
    description: "Professional-grade tool for experts",
    price: 199.99,
    category: "Tools",
    imagePublicId: "samples/coffee",
    inStock: false
  }
];

export const categories = Array.from(
  new Set(products.map(product => product.category))
);