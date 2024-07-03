import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  standalone: true,
  imports: [
    NgForOf,
    FormsModule,
    NgIf,
    NgClass
  ],
  styleUrls: ['./products.component.scss'],
  animations: [
    trigger('fadeInSlideIn', [
      transition('void => *', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  newProduct: Product = { id: 0, name: '', description: '', price: 0, category: '', productCode: '', stock: 0 };
  showAddProductForm: boolean = false;
  searchTerm: string = '';
  categories = ['Electromenager', 'Informatique', 'Furniture', 'Clothing', 'Books', 'Sports', 'Beauty'];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.fetchProducts().then(r => console.log('Products fetched'));
  }

  async fetchProducts() {
    try {
      this.products = await this.productService.getAllProducts();
      this.filteredProducts = this.products;
    } catch (error) {
      console.error('Error fetching products', error);
    }
  }

  async createProduct() {
    try {
      const createdProduct = await this.productService.createProduct(this.newProduct);
      this.products.push(createdProduct);
      this.filteredProducts = this.products;
      this.newProduct = { id: 0, name: '', description: '', price: 0, category: '', productCode: '', stock: 0 }; // Reset form
      this.showAddProductForm = false; // Hide form after creation
    } catch (error) {
      console.error('Error creating product', error);
    }
  }

  async deleteProduct(id: number) {
    try {
      await this.productService.deleteProduct(id);
      this.products = this.products.filter(product => product.id !== id);
      this.filteredProducts = this.products;
    } catch (error) {
      console.error('Error deleting product', error);
    }
  }

  toggleForm() {
    this.showAddProductForm = !this.showAddProductForm;
  }

  filterProducts() {
    const term = this.searchTerm.toLowerCase();
    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term) ||
      product.productCode.toLowerCase().includes(term)
    );
  }
}
