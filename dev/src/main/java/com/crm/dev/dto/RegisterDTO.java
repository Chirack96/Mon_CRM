package com.crm.dev.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record RegisterDTO(
        @NotBlank @Email String email,
        @NotBlank String password,
        @NotBlank String firstname,
        @NotBlank String lastname,
        String groupe,
        String image) {
}