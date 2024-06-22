package com.crm.dev.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record RegisterDTO(
        @NotBlank
        @Email
        @Pattern(regexp = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$", message = "Email should be in the format 'example@mail.com'")
        String email,

        @NotBlank
        String password,

        @NotBlank
        String firstname,

        @NotBlank
        String lastname,

        String groupe,
        String image) {
}
