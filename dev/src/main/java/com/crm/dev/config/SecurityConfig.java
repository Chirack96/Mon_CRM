package com.crm.dev.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // désactiver CSRF pour simplifier l'exemple
                .authorizeHttpRequests(authorizeRequests ->
                        authorizeRequests
                                .requestMatchers("/api/users/**").permitAll()  // permet l'accès sans authentification à /api/users/**
                                .requestMatchers("/api/auth/**").permitAll()  // permet l'accès avec authentification à /api/auth/**
                                .requestMatchers("/api/products/**").permitAll()  // permet l'accès sans authentification à /api/products/**
                                .requestMatchers("/api/orders/**").permitAll()  // permet l'accès sans authentification à /api/orders/**
                                .requestMatchers("/api/customers/**").permitAll()  // permet l'accès sans authentification à /api/customers/**
                                .anyRequest().authenticated()  // requiert une authentification pour tous les autres endpoints
                )
                .cors(cors -> {}); // ajouter cette ligne pour activer CORS

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
