package com.crm.dev.controller;

import com.crm.dev.models.Order;
import com.crm.dev.models.Customer;
import com.crm.dev.models.Product;
import com.crm.dev.service.OrderService;
import com.crm.dev.service.CustomerService;
import com.crm.dev.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private CustomerService customerService;

    @Autowired
    private ProductService productService;

    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        List<Order> orders = orderService.findAllOrders();
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        Optional<Order> order = orderService.getOrderById(id);
        return order.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Order>> getOrdersByCustomerId(@PathVariable Long customerId) {
        List<Order> orders = orderService.findOrdersByCustomerId(customerId);
        return ResponseEntity.ok(orders);
    }

    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
        Customer customer = customerService.getCustomerById(order.getCustomer().getId())
                .orElseThrow(() -> new RuntimeException("Customer not found with ID: " + order.getCustomer().getId()));
        Product product = productService.getProductById(order.getProduct().getId())
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + order.getProduct().getId()));

        order.setCustomer(customer);
        order.setProduct(product);
        Order createdOrder = orderService.createOrder(order);
        return ResponseEntity.ok(createdOrder);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Order> updateOrder(@PathVariable Long id, @RequestBody Order orderDetails) {
        Customer customer = customerService.getCustomerById(orderDetails.getCustomer().getId())
                .orElseThrow(() -> new RuntimeException("Customer not found with ID: " + orderDetails.getCustomer().getId()));
        Product product = productService.getProductById(orderDetails.getProduct().getId())
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + orderDetails.getProduct().getId()));

        orderDetails.setCustomer(customer);
        orderDetails.setProduct(product);
        Order updatedOrder = orderService.updateOrder(id, orderDetails);
        return ResponseEntity.ok(updatedOrder);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
        return ResponseEntity.ok().build();
    }
}
