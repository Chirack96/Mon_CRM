import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { OrderService } from '../services/order.service';
import { CustomerService } from '../services/customer.service';
import { ProductService } from '../services/product.service';
import { Customer, Product, Order } from '../models/order.model';
import {CurrencyPipe, NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CurrencyPipe,
    NgForOf,
    NgIf
  ]
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  customers: Customer[] = [];
  products: Product[] = [];
  orderForm: FormGroup;
  showAddOrderForm = false;

  constructor(
    private orderService: OrderService,
    private customerService: CustomerService,
    private productService: ProductService,
    private fb: FormBuilder
  ) {
    this.orderForm = this.fb.group({
      customerId: ['', Validators.required],
      orderProducts: this.fb.array([]),
      orderDate: ['', Validators.required],
      status: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.fetchInitialData();
    this.addOrderProduct(); // Setup an initial product line
  }

  get orderProducts() {
    return this.orderForm.get('orderProducts') as FormArray;
  }

  addOrderProduct() {
    this.orderProducts.push(this.fb.group({
      productId: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]]
    }));
  }

  removeOrderProduct(index: number) {
    this.orderProducts.removeAt(index);
  }

  async fetchInitialData() {
    try {
      this.customers = await this.customerService.getAllCustomers();
      this.products = await this.productService.getAllProducts();
      this.orders = await this.orderService.getAllOrders();
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  async createOrder() {
    if (this.orderForm.invalid) {
      console.error('Form is invalid');
      return;
    }

    const orderData = this.orderForm.value;
    console.log('Order data from form:', orderData);

    const newOrder: Order = {
      ...orderData,
      customerId: orderData.customerId,
      orderProducts: orderData.orderProducts.map((op: any) => ({
        productId: op.productId,
        quantity: op.quantity
      })),
      totalPrice: 0 // Assume total price is calculated server-side
    };

    try {
      const createdOrder = await this.orderService.createOrder(newOrder);
      this.orders.push(createdOrder);
      this.orderForm.reset();
      this.addOrderProduct(); // Add a new product row after reset
      this.showAddOrderForm = false;
    } catch (error) {
      console.error('Error creating order:', error);
    }
  }

  async deleteOrder(id: number) {
    try {
      await this.orderService.deleteOrder(id);
      this.orders = this.orders.filter(order => order.id !== id);
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  }
}
