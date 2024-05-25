package com.crm.dev.service;

import com.crm.dev.models.Order;
import com.crm.dev.models.Customer;
import com.crm.dev.models.Product;
import com.crm.dev.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CustomerService customerService;

    @Autowired
    private ProductService productService;

    public List<Order> findAllOrders() {
        return orderRepository.findAll();
    }

    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }

    public Order createOrder(Order order) {
        order.setTotalPrice(order.getProduct().getPrice() * order.getQuantity());
        return orderRepository.save(order);
    }

    public Order updateOrder(Long orderId, Order orderDetails) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + orderId));
        order.setCustomer(orderDetails.getCustomer());
        order.setProduct(orderDetails.getProduct());
        order.setQuantity(orderDetails.getQuantity());
        order.setOrderDate(orderDetails.getOrderDate());
        order.setTotalPrice(orderDetails.getProduct().getPrice() * orderDetails.getQuantity());
        return orderRepository.save(order);
    }

    public List<Order> findOrdersByCustomerId(Long customerId) {
        return orderRepository.findByCustomerId(customerId);
    }
}
