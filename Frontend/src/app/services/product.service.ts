import { Injectable } from '@angular/core';
import axios from 'axios';
import { Product } from '../models/product.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = 'http://localhost:8080/api/products';

  constructor(private authService: AuthService) { }

  async getAllProducts(): Promise<Product[]> {
    const response = await axios.get<Product[]>(this.baseUrl, {
      headers: this.authService.getAuthHeaders()
    });
    return response.data;
  }

  async createProduct(product: Product): Promise<Product> {
    const response = await axios.post<Product>(this.baseUrl, product, {
      headers: this.authService.getAuthHeaders()
    });
    return response.data;
  }

  async getProductById(id: number): Promise<Product> {
    const response = await axios.get<Product>(`${this.baseUrl}/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
    return response.data;
  }

  async deleteProduct(id: number): Promise<void> {
    await axios.delete(`${this.baseUrl}/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }
}
