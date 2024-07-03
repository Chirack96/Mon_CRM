package com.crm.dev.service;

import com.crm.dev.models.User;
import com.crm.dev.models.UserLog;
import com.crm.dev.repository.UserLogRepository;
import com.crm.dev.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class UserLogService {

    @Autowired
    private UserLogRepository userLogRepository;

    @Autowired
    private UserRepository userRepository;

    public void logUserLogin(Long userId, String email, String details) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        UserLog log = new UserLog();
        log.setUser(user);
        log.setEmail(email);
        log.setDetails(details);
        log.setLoginTime(new Date());
        userLogRepository.save(log);
    }


    public void logUserLoginFailed(String email, String details) {
        UserLog log = new UserLog();
        log.setEmail(email);  // Set email for non-existing users
        log.setDetails(details);
        log.setLoginTime(new Date());
        userLogRepository.save(log);
    }

    public List<UserLog> findAllLogs() {
        return userLogRepository.findAll();
    }

    public List<UserLog> findLogsByEmail(String email) {
        return userLogRepository.findByEmailOrderByLoginTimeDesc(email);
    }

    public Date getLastLoginTime(String email) {
        List<UserLog> logs = findLogsByEmail(email);
        return logs.isEmpty() ? null : logs.getFirst().getLoginTime();
    }
}
