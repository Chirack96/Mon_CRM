package com.crm.dev.repository;

import com.crm.dev.models.Training;
import com.crm.dev.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByGroupe(String groupe);

    Optional<User> findByEmail(String email);


}
