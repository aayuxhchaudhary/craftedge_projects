package com.ibm.ecms.service;



import com.ibm.ecms.dto.CustomerDTO;
import com.ibm.ecms.exception.CEAException;

import java.util.List;

public interface CustomerService {

    public Integer addCustomer(CustomerDTO customerDTO) throws CEAException;
    public CustomerDTO getCustomer(Integer customerId) throws CEAException;
    public void updateCustomer(Integer customerId, String emailId) throws CEAException;
    public void deleteCustomer(Integer customerId) throws CEAException;
    public List<CustomerDTO> getAllCustomers() throws CEAException;
}
