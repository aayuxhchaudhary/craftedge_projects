package com.ibm.ecms.repository;

import com.ibm.ecms.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Integer> {
    Optional<Customer> findByEmailId(String emailId);
    boolean existsByEmailId(String emailId);
}
