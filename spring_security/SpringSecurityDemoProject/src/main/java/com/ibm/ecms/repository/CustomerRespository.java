package com.ibm.ecms.repository;

import com.ibm.ecms.entity.Customer;
import org.springframework.data.repository.CrudRepository;

public interface CustomerRespository extends CrudRepository<Customer, Integer> {

}