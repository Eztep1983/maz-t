// data/products.ts

export type Product = {
  id: number;
  name: string;
  description: string;
  category: string;
  imagePublicId: string; 
  inStock: boolean;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Fotocopiadora Multifuncional Toshiba 3015AC",
    description: "Fotocopiadora multifuncional a color Toshiba 3015AC de alta velocidad",
    category: "Printers",
    imagePublicId: "TOSHIBA-PRINTER", // Replace with your actual Cloudinary public IDs
    inStock: true
  },
  {
    id: 2,
    name: "Toner Toshiba",
    description: "Series 3005ac, 3015ac, 3515ac, 4515ac, 5015ac, 5515ac, 6515ac, 7515ac, 8515ac, 9515ac",
    category: "Electronics",
    imagePublicId: "cld-sample-3",
    inStock: true
  },
  {
    id: 3,
    name: "Cilindro Toshiba",
    description: "Cilindro para fotocopiadoras Toshiba 3005ac, 3015ac, 3515ac, 4515ac, 5015ac, 5515ac, 6515ac, 7515ac, 8515ac, 9515ac",
    category: "Tools",
    imagePublicId: "samples/coffee",
    inStock: true
  }
];

export const categories = Array.from(
  new Set(products.map(product => product.category))
);