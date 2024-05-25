package com.crm.dev.service;

import com.crm.dev.models.OrderDetail;
import com.crm.dev.repository.OrderDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderDetailService {

    @Autowired
    private OrderDetailRepository orderDetailRepository;

    public List<OrderDetail> findAllOrderDetails() {
        return orderDetailRepository.findAll();
    }

    public OrderDetail saveOrderDetail(OrderDetail orderDetail) {
        return orderDetailRepository.save(orderDetail);
    }

    public OrderDetail getOrderDetailById(Long id) throws Exception {
        return orderDetailRepository.findById(id).orElseThrow(() -> new Exception("Order detail not found"));
    }

    public List<OrderDetail> findByCustomerId(Long customerId) {
        return orderDetailRepository.findByCustomerId(customerId);
    }

    public void deleteOrderDetail(Long id) {
        orderDetailRepository.deleteById(id);
    }
}
