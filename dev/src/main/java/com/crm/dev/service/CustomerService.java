package com.crm.dev.service;

import com.crm.dev.models.Customer;
import com.crm.dev.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    public List<Customer> findAllCustomers() {
        return customerRepository.findAll();
    }

    public Customer saveCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    public Optional<Customer> getCustomerById(Long id) {
        return customerRepository.findById(id);
    }

    public void deleteCustomer(Long id) {
        customerRepository.deleteById(id);
    }

    public List<Customer> createMultipleCustomers(int count) {
        List<Customer> customers = new ArrayList<>();
        for (int i = 1; i <= count; i++) {
            Customer customer = new Customer();
            customer.setFirstName("Jeany" + i);
            customer.setLastName("Duponyt" + i);
            customer.setEmail("jean.duponyt" + i + "@eyxample.com");
            customer.setAddress("123 rue de la rue");
            customer.setPhoneNumber("1234567890");

            customers.add(customerRepository.save(customer));
        }
        return customers;
    }

}