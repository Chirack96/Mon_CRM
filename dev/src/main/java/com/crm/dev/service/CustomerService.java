package com.crm.dev.service;

import com.crm.dev.models.Customer;
import com.crm.dev.models.Order;
import com.crm.dev.repository.CustomerRepository;
import com.crm.dev.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private OrderRepository orderRepository;

    public List<Customer> findAllCustomers() {
        return customerRepository.findByActiveTrue();
    }

    public Customer saveCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    public Customer getCustomerById(Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with ID: " + id));
    }

    public void deactivateCustomer(Long id) {
        Customer customer = getCustomerById(id);
        customer.setActive(false);
        customerRepository.save(customer);

        List<Order> orders = orderRepository.findByCustomerId(id);
        for (Order order : orders) {
            order.setCustomerName(customer.getFirstName() + " " + customer.getLastName());
            // Ne pas définir customer à null, conserver la référence
        }
        orderRepository.saveAll(orders);
    }
}