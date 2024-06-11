package com.crm.dev.dto;

import java.time.LocalDate;
import java.util.List;

public record OrderDTO(Long customerId, LocalDate orderDate, String status, Double totalPrice, List<OrderProductDTO> orderProducts) {
}
