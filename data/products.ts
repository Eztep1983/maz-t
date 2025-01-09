export type Product = {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    image: string;
    inStock: boolean;
  }
  
  export const products: Product[] = [
    {
      id: 1,
      name: "Premium Widget",
      description: "High-quality premium widget with advanced features",
      price: 99.99,
      category: "Electronics",
      image: "/api/placeholder/300/200",
      inStock: true
    },
    {
      id: 2,
      name: "Deluxe Gadget",
      description: "Latest generation deluxe gadget",
      price: 149.99,
      category: "Electronics",
      image: "/api/placeholder/300/200",
      inStock: true
    },
    {
      id: 3,
      name: "Professional Tool",
      description: "Professional-grade tool for experts",
      price: 199.99,
      category: "Tools",
      image: "/api/placeholder/300/200",
      inStock: false
    }
    // Add more products as needed
  ];
  
  export const categories = Array.from(
    new Set(products.map(product => product.category))
  );