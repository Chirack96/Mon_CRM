export interface Order {
  id: number;
  product: Product;
  quantity: number;
  price: number;
  date: string;
  status: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
}
