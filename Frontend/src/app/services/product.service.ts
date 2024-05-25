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
    const response = await axios.get<Product[]>(this.baseUrl);
    return response.data;
  }

  async createProduct(product: Product): Promise<Product> {
    const response = await axios.post<Product>(this.baseUrl, product);
    return response.data;
  }

  async getProductById(id: number): Promise<Product> {
    const response = await axios.get<Product>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async deleteProduct(id: number): Promise<void> {
    await axios.delete(`${this.baseUrl}/${id}`);
  }
}
