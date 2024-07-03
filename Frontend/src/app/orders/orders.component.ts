import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { OrderService } from '../services/order.service';
import { CustomerService } from '../services/customer.service';
import { ProductService } from '../services/product.service';
import { Customer, Product, Order } from '../models/order.model';
import { CurrencyPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CurrencyPipe,
    NgForOf,
    NgIf,
    NgClass,
    FormsModule
  ]
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  customers: Customer[] = [];
  products: Product[] = [];
  allOrders: Order[] = [];
  orderForm: FormGroup;
  editOrderForm: FormGroup;
  showAddOrderForm = false;
  showEditModal = false;
  currentTable: string = 'all';
  searchQuery: string = '';
  noResultsMessage: string = '';

  constructor(
    private orderService: OrderService,
    private customerService: CustomerService,
    private productService: ProductService,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef // Inject ChangeDetectorRef
  ) {
    this.orderForm = this.fb.group({
      customerId: ['', Validators.required],
      orderProducts: this.fb.array([]),
      orderDate: ['', Validators.required],
      status: ['', Validators.required]
    });

    this.editOrderForm = this.fb.group({
      id: [''],
      customerId: ['', Validators.required],
      orderProducts: this.fb.array([]),
      orderDate: ['', Validators.required],
      status: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.fetchInitialData().then(r => console.log('Initial data loaded'));
    this.resetOrderForm();
  }

  get orderProducts() {
    return this.orderForm.get('orderProducts') as FormArray;
  }

  get editOrderProducts() {
    return this.editOrderForm.get('orderProducts') as FormArray;
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

  resetOrderForm() {
    this.orderForm.reset({
      customerId: '',
      orderDate: '',
      status: ''
    });
    this.orderProducts.clear();
    this.addOrderProduct();
  }

  async fetchInitialData() {
    try {
      this.customers = await this.customerService.getAllCustomers();
      this.products = await this.productService.getAllProducts();
      this.orders = await this.orderService.getAllOrders();
      this.allOrders = this.orders;
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
      totalPrice: 0
    };

    try {
      const createdOrder = await this.orderService.createOrder(newOrder);
      this.orders.push(createdOrder);
      this.allOrders.push(createdOrder);
      this.resetOrderForm();
      this.showAddOrderForm = false;
      await this.fetchInitialData();
    } catch (error) {
      console.error('Error creating order:', error);
    }
  }

  async updateOrderStatus(id: number, status: string) {
    try {
      console.log(`Updating order ${id} status to ${status}`);
      const updatedOrder = await this.orderService.updateOrderStatus(id, status);
      const index = this.orders.findIndex(order => order.id === id);
      if (index !== -1) {
        this.orders[index].status = updatedOrder.status;
      }
      const allOrdersIndex = this.allOrders.findIndex(order => order.id === id);
      if (allOrdersIndex !== -1) {
        this.allOrders[allOrdersIndex].status = updatedOrder.status;
      }
      this.applyFilters(); // Reapply filters to update the displayed orders
      this.cd.detectChanges(); // Force Angular to detect changes
    } catch (error) {
      console.error(`Error updating order status to ${status}:`, error);
    }
  }

  async deleteOrder(id: number) {
    try {
      await this.orderService.deleteOrder(id);
      this.orders = this.orders.filter(order => order.id !== id);
      this.allOrders = this.allOrders.filter(order => order.id !== id);
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  }

  openEditModal(order: Order): void {
    this.showEditModal = true;
    this.editOrderForm.reset({
      id: order.id,
      customerId: order.customerId,
      orderDate: order.orderDate,
      status: order.status
    });
    this.editOrderProducts.clear();
    order.orderProducts.forEach(op => {
      this.editOrderProducts.push(this.fb.group({
        productId: [op.productId, Validators.required],
        quantity: [op.quantity, [Validators.required, Validators.min(1)]]
      }));
    });
  }

  closeEditModal(): void {
    this.showEditModal = false;
  }

  async updateOrder() {
    if (this.editOrderForm.invalid) {
      console.error('Form is invalid');
      return;
    }

    const orderData = this.editOrderForm.value;
    console.log('Order data from form:', orderData);

    const updatedOrder: Order = {
      id: orderData.id,
      customerId: orderData.customerId,
      orderProducts: orderData.orderProducts.map((op: any) => ({
        productId: op.productId,
        quantity: op.quantity
      })),
      orderDate: orderData.orderDate,
      status: orderData.status,
      totalPrice: 0
    };

    try {
      const updatedOrderResponse = await this.orderService.updateOrder(updatedOrder.id, updatedOrder);
      const index = this.orders.findIndex(order => order.id === updatedOrder.id);
      if (index !== -1) {
        this.orders[index] = updatedOrderResponse;
      }
      const allOrdersIndex = this.allOrders.findIndex(order => order.id === updatedOrder.id);
      if (allOrdersIndex !== -1) {
        this.allOrders[allOrdersIndex] = updatedOrderResponse;
      }
      this.closeEditModal();
    } catch (error) {
      console.error('Error updating order:', error);
    }
  }

  searchOrders(): void {
    this.applyFilters();
  }

  private applyFilters(): void {
    if (!this.searchQuery) {
      this.orders = this.allOrders;
      this.noResultsMessage = '';
      return;
    }

    let filteredOrders = this.allOrders;

    const terms = this.searchQuery.toLowerCase().split(' ');
    filteredOrders = filteredOrders.filter(order => {
      return terms.every(term =>
        order.customer?.email.toLowerCase().includes(term) ||
        order.customer?.firstName.toLowerCase().includes(term) ||
        order.customer?.lastName.toLowerCase().includes(term) ||
        order.orderProducts.some(op => op.product?.name.toLowerCase().includes(term)) ||
        order.totalPrice.toString().includes(term) ||
        order.orderDate.includes(term)
      );
    });

    if (this.currentTable !== 'all') {
      filteredOrders = filteredOrders.filter(order => order.status.toLowerCase() === this.currentTable.toLowerCase());
    }

    this.orders = filteredOrders;

    if (this.orders.length === 0) {
      this.noResultsMessage = 'No results found.';
    } else {
      this.noResultsMessage = '';
    }
  }
}
