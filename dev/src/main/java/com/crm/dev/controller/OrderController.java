package com.crm.dev.controller;

import com.crm.dev.dto.OrderDTO;
import com.crm.dev.dto.OrderProductDTO;
import com.crm.dev.models.Order;
import com.crm.dev.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

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
    public ResponseEntity<Order> createOrder(@Validated @RequestBody OrderDTO orderDTO) {
        Order order = orderService.createOrder(orderDTO);
        return ResponseEntity.ok(order);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Order> updateOrder(@PathVariable Long id, @RequestBody OrderDTO orderDTO) {
        return orderService.updateOrder(id, orderDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> updates) {
        String status = updates.get("status");
        System.out.println("Received PUT request to update order " + id + " with status " + status); // Log
        Order updatedOrder = orderService.updateOrderStatus(id, status);
        return ResponseEntity.ok(updatedOrder);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Order>> getOrdersByStatus(@PathVariable String status) {
        List<Order> orders = orderService.findOrdersByStatus(status);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/top-selling-products")
    public ResponseEntity<List<OrderProductDTO>> getTopSellingProducts(@RequestParam int limit) {
        List<OrderProductDTO> topSellingProducts = orderService.findTopSellingProducts(limit);
        return ResponseEntity.ok(topSellingProducts);
    }

    @GetMapping("/least-selling-products")
    public ResponseEntity<List<OrderProductDTO>> getLeastSellingProducts(@RequestParam int limit) {
        List<OrderProductDTO> leastSellingProducts = orderService.findLeastSellingProducts(limit);
        return ResponseEntity.ok(leastSellingProducts);
    }

    @GetMapping("/revenue-by-customer/{customerId}")
    public ResponseEntity<Double> getRevenueByCustomer(@PathVariable Long customerId) {
        double revenue = orderService.calculateRevenueByCustomer(customerId);
        return ResponseEntity.ok(revenue);
    }
}