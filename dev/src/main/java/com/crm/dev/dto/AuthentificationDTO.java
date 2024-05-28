package com.crm.dev.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record AuthentificationDTO(
        @NotBlank @Email String email,
        @NotBlank String password) {
}

