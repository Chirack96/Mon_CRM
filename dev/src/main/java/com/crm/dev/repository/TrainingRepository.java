package com.crm.dev.repository;

import com.crm.dev.models.Training;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TrainingRepository extends JpaRepository<Training, Long> {
}
