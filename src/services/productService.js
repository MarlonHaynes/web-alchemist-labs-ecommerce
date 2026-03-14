import { products } from "../data/products";

export async function getProducts() {
  return products;
}

export async function getProductById(productId) {
  const product = products.find((item) => item.id === productId);
  return product || null;
}

export async function getFeaturedProducts(limit = 4) {
  return products.slice(0, limit);
}

export async function getProductsByCategory(category) {
  return products.filter((item) => item.category === category);
}