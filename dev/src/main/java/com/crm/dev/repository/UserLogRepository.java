package com.crm.dev.repository;

import com.crm.dev.models.UserLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserLogRepository extends JpaRepository<UserLog, Long> {
    List<UserLog> findByEmailOrderByLoginTimeDesc(String email);
}