import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { AuthService } from '../services/auth.service';

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
  showEditProductModal: boolean = false;
  searchTerm: string = '';
  categories = ['Electromenager', 'Informatique', 'Furniture', 'Clothing', 'Books', 'Sports', 'Beauty'];
  selectedProduct: Product | null = null;
  userRole: string = '';
  alertMessage: string | null = null;
  alertType: 'success' | 'error' | null = null;

  constructor(private productService: ProductService, private authService: AuthService) { }

  ngOnInit(): void {
    this.fetchProducts().then(r => console.log('Products fetched'));
    this.authService.userRole.subscribe(role => {
      this.userRole = role;
    });
  }

  async fetchProducts() {
    try {
      this.products = await this.productService.getAllProducts();
      this.filteredProducts = this.products;
    } catch (error) {
      console.error('Error fetching products', error);
      this.showAlert('Error fetching products.', 'error');
    }
  }

  async createProduct() {
    try {
      const createdProduct = await this.productService.createProduct(this.newProduct);
      this.products.push(createdProduct);
      this.filteredProducts = this.products;
      this.newProduct = { id: 0, name: '', description: '', price: 0, category: '', productCode: '', stock: 0 }; // Reset form
      this.showAddProductForm = false; // Hide form after creation
      await this.fetchProducts();
      this.showAlert('Product created successfully!', 'success');
    } catch (error) {
      console.error('Error creating product', error);
      this.showAlert('Failed to create product.', 'error');
    }
  }

  async deleteProduct(id: number) {
    try {
      await this.productService.deleteProduct(id);
      this.products = this.products.filter(p => p.id !== id);
      this.filteredProducts = this.products;
      this.showAlert('Product deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting product', error);
      this.showAlert('Failed to delete product.', 'error');
    }
  }

  async updateProduct() {
    if (this.selectedProduct) {
      try {
        const updatedProduct = await this.productService.updateProduct(this.selectedProduct);
        const index = this.products.findIndex(p => p.id === updatedProduct.id);
        if (index !== -1) {
          this.products[index] = updatedProduct;
          this.filteredProducts = this.products;
        }
        this.showEditProductModal = false;
        this.selectedProduct = null;
        this.showAlert('Product updated successfully!', 'success');
      } catch (error) {
        console.error('Error updating product', error);
        this.showAlert('Failed to update product.', 'error');
      }
    }
  }

  toggleForm() {
    this.showAddProductForm = !this.showAddProductForm;
  }

  editProduct(product: Product) {
    this.selectedProduct = { ...product };
    this.showEditProductModal = true;
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

  closeEditModal() {
    this.showEditProductModal = false;
    this.selectedProduct = null;
  }

  confirmEdit() {
    this.updateProduct();
  }

  isRole(role: string): boolean {
    return this.userRole === role;
  }

  showAlert(message: string, type: 'success' | 'error') {
    this.alertMessage = message;
    this.alertType = type;
    setTimeout(() => {
      this.alertMessage = null;
      this.alertType = null;
    }, 3000);
  }
}
