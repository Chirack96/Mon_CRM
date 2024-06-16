package com.crm.dev.controller;

import com.crm.dev.models.UserLog;
import com.crm.dev.service.UserLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/user-logs")
public class UserLogController {

    @Autowired
    private UserLogService userLogService;

    @GetMapping
    public ResponseEntity<List<UserLog>> getAllUserLogs() {
        List<UserLog> logs = userLogService.findAllLogs();
        return ResponseEntity.ok(logs);
    }
}
