package com.crm.dev.repository;
import com.crm.dev.models.PayrollEntry;
import com.crm.dev.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PayrollEntryRepository extends JpaRepository<PayrollEntry, Long> {


    List<PayrollEntry> findByUser_Id(Long userId);

}
