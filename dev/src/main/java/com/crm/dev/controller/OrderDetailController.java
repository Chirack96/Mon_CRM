package com.crm.dev.controller;

import com.crm.dev.models.OrderDetail;
import com.crm.dev.service.OrderDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order-details")
public class OrderDetailController {

    @Autowired
    private OrderDetailService orderDetailService;

    @GetMapping
    public ResponseEntity<List<OrderDetail>> getAllOrderDetails() {
        return ResponseEntity.ok(orderDetailService.findAllOrderDetails());
    }

    @PostMapping
    public ResponseEntity<OrderDetail> createOrderDetail(@RequestBody OrderDetail orderDetail) {
        return ResponseEntity.ok(orderDetailService.saveOrderDetail(orderDetail));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDetail> getOrderDetailById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(orderDetailService.getOrderDetailById(id));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<OrderDetail>> getOrderDetailsByCustomer(@PathVariable Long customerId) {
        List<OrderDetail> orderDetails = orderDetailService.findByCustomerId(customerId);
        if(orderDetails.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(orderDetails);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrderDetail(@PathVariable Long id) {
        orderDetailService.deleteOrderDetail(id);
        return ResponseEntity.ok().build();
    }
}
