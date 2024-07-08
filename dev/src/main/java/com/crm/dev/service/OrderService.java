package com.crm.dev.service;

import com.crm.dev.dto.OrderDTO;
import com.crm.dev.dto.OrderProductDTO;
import com.crm.dev.models.Customer;
import com.crm.dev.models.Order;
import com.crm.dev.models.OrderProduct;
import com.crm.dev.models.Product;
import com.crm.dev.repository.OrderRepository;
import com.crm.dev.repository.CustomerRepository;
import com.crm.dev.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private ProductRepository productRepository;

    public List<Order> findAllOrders() {
        return orderRepository.findAll();
    }

    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    public List<Order> findOrdersByCustomerId(Long customerId) {
        return orderRepository.findByCustomerId(customerId);
    }

    public Order createOrder(OrderDTO orderDTO) {
        Order order = new Order();
        Customer customer = customerRepository.findById(orderDTO.customerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        order.setCustomer(customer);
        order.setOrderDate(orderDTO.orderDate());
        order.setStatus(orderDTO.status());

        List<OrderProduct> orderProducts = orderDTO.orderProducts().stream().map(opDTO -> {
            OrderProduct orderProduct = new OrderProduct();
            orderProduct.setOrder(order);
            Product product = productRepository.findById(opDTO.productId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));
            orderProduct.setProduct(product);
            orderProduct.setQuantity(opDTO.quantity());
            return orderProduct;
        }).collect(Collectors.toList());

        order.setOrderProducts(orderProducts);
        order.setTotalPrice(calculateTotalPrice(orderProducts));
        return orderRepository.save(order);
    }

    public ResponseEntity<Order> updateOrder(Long orderId, OrderDTO updatedOrderDTO) {
        Optional<Order> optionalOrder = orderRepository.findById(orderId);
        if (optionalOrder.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        Order existingOrder = optionalOrder.get();
        existingOrder.setOrderDate(updatedOrderDTO.orderDate());
        existingOrder.setStatus(updatedOrderDTO.status());

        // Clear the existing orderProducts and add the new ones
        existingOrder.getOrderProducts().clear();

        for (OrderProductDTO orderProductDTO : updatedOrderDTO.orderProducts()) {
            OrderProduct orderProduct = new OrderProduct();
            orderProduct.setOrder(existingOrder);

            Optional<Product> productOptional = productRepository.findById(orderProductDTO.productId());
            if (productOptional.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }

            orderProduct.setProduct(productOptional.get());
            orderProduct.setQuantity(orderProductDTO.quantity());
            existingOrder.getOrderProducts().add(orderProduct);
        }

        // Calculate the total price after updating the order products
        existingOrder.setTotalPrice(calculateTotalPrice(existingOrder.getOrderProducts()));

        Order savedOrder = orderRepository.save(existingOrder);
        return new ResponseEntity<>(savedOrder, HttpStatus.OK);
    }

    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }

    public Order updateOrderStatus(Long id, String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(status);
        System.out.println("Updating order " + id + " status to " + status); // Log
        return orderRepository.save(order);
    }

    private double calculateTotalPrice(List<OrderProduct> orderProducts) {
        return orderProducts.stream()
                .mapToDouble(op -> op.getProduct().getPrice() * op.getQuantity())
                .sum();
    }

    public List<Order> findOrdersByStatus(String status) {
        return orderRepository.findByStatus(status);
    }

    public List<OrderProductDTO> findTopSellingProducts(int limit) {
        return orderRepository.findAll().stream()
                .flatMap(order -> order.getOrderProducts().stream())
                .collect(Collectors.groupingBy(OrderProduct::getProduct, Collectors.summingInt(OrderProduct::getQuantity)))
                .entrySet().stream()
                .map(entry -> new OrderProductDTO(entry.getKey().getId(), entry.getValue()))
                .sorted((a, b) -> b.quantity().compareTo(a.quantity()))
                .limit(limit)
                .collect(Collectors.toList());
    }

    public List<OrderProductDTO> findLeastSellingProducts(int limit) {
        return orderRepository.findAll().stream()
                .flatMap(order -> order.getOrderProducts().stream())
                .collect(Collectors.groupingBy(OrderProduct::getProduct, Collectors.summingInt(OrderProduct::getQuantity)))
                .entrySet().stream()
                .map(entry -> new OrderProductDTO(entry.getKey().getId(), entry.getValue()))
                .sorted((a, b) -> a.quantity().compareTo(b.quantity()))
                .limit(limit)
                .collect(Collectors.toList());
    }

    public double calculateRevenueByCustomer(Long customerId) {
        return orderRepository.findByCustomerId(customerId).stream()
                .mapToDouble(Order::getTotalPrice)
                .sum();
    }
}
