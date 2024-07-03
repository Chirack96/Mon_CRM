package com.crm.dev.repository;

import com.crm.dev.models.UserTraining;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserTrainingRepository extends JpaRepository<UserTraining, Long> {
    void deleteByUserIdAndTrainingId(Long userId, Long trainingId);
    boolean existsByUserIdAndTrainingId(Long userId, Long trainingId);
    List<UserTraining> findByUserId(Long userId);
}
