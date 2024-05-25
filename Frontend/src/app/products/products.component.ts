import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';
import {NgForOf, NgIf} from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  standalone: true,
  imports: [
    NgForOf,
    FormsModule,
    NgIf
  ],
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  newProduct: Product = { id: 0, name: '', description: '', price: 0, stock: 0 };
  showAddProductForm: boolean = false;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.fetchProducts();
  }

  async fetchProducts() {
    try {
      this.products = await this.productService.getAllProducts();
    } catch (error) {
      console.error('Error fetching products', error);
    }
  }

  async createProduct() {
    try {
      const createdProduct = await this.productService.createProduct(this.newProduct);
      this.products.push(createdProduct);
      this.newProduct = { id: 0, name: '', description: '', price: 0, stock: 0 }; // Réinitialiser le formulaire
      this.showAddProductForm = false; // Masquer le formulaire après la création du produit
    } catch (error) {
      console.error('Error creating product', error);
    }
  }

  async deleteProduct(id: number) {
    try {
      await this.productService.deleteProduct(id);
      this.products = this.products.filter(product => product.id !== id);
    } catch (error) {
      console.error('Error deleting product', error);
    }
  }
}
