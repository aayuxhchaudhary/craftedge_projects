package com.ibm.crm.repository;

import com.ibm.crm.entity.Customer;
import org.springframework.data.repository.CrudRepository;

public interface CustomerRespository extends CrudRepository<Customer, Integer> {

}