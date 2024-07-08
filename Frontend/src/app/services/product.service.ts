import { Injectable } from '@angular/core';
import axios from 'axios';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = 'http://localhost:8080/api/products';

  constructor() { }

  async getAllProducts(): Promise<Product[]> {
    const response = await axios.get<Product[]>(this.baseUrl, {
      withCredentials: true
    });
    return response.data;
  }

  async createProduct(product: Product): Promise<Product> {
    const response = await axios.post<Product>(this.baseUrl, product, {
      withCredentials: true
    });
    return response.data;
  }

  async getProductById(id: number): Promise<Product> {
    const response = await axios.get<Product>(`${this.baseUrl}/${id}`, {
      withCredentials: true
    });
    return response.data;
  }

  async deleteProduct(id: number): Promise<void> {
    await axios.delete(`${this.baseUrl}/${id}`, {
      withCredentials: true
    });
  }

  async updateProduct(product: Product): Promise<Product> {
    const response = await axios.put<Product>(`${this.baseUrl}/${product.id}`, product, {
      withCredentials: true
    });
    return response.data;
  }
}
