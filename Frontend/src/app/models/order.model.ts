export interface Order {
  id: number;
  customerId: number; // For saving and retrieving orders
  customer?: Customer; // For display purposes
  orderProducts: OrderProduct[];
  orderDate: string;
  totalPrice: number;
  status: string;
}

export interface OrderProduct {
  productId: number;
  product?: Product;
  quantity: number;
}

export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  phoneNumber: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
}
