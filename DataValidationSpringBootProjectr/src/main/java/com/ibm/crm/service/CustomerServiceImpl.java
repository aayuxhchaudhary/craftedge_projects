package com.ibm.crm.service;

import com.ibm.crm.dto.AddressDTO;
import com.ibm.crm.dto.CustomerDTO;
import com.ibm.crm.entity.Address;
import com.ibm.crm.entity.Customer;
import com.ibm.crm.exception.CEAException;
import com.ibm.crm.repository.CustomerRespository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service(value = "customerService")
@Transactional
public class CustomerServiceImpl implements CustomerService {
    @Autowired
    private CustomerRespository customerRespository;

    @Override
    public CustomerDTO getCustomer(Integer customerId) throws CEAException {
        Optional<Customer> optional = customerRespository.findById(customerId);
        Customer customer = optional.orElseThrow(() -> new CEAException("Service.CUSTOMER_NOT_FOUND"));
        CustomerDTO customerDTO = new CustomerDTO();
        customerDTO.setCustomerId(customer.getCustomerId());
        customerDTO.setDateOfBirth(customer.getDateOfBirth());
        customerDTO.setEmailId(customer.getEmailId());
        customerDTO.setName(customer.getName());
        AddressDTO addressDTO = new AddressDTO();
        addressDTO.setAddressId(customer.getAddress().getAddressId());
        addressDTO.setStreet(customer.getAddress().getStreet());
        addressDTO.setCity(customer.getAddress().getCity());
        customerDTO.setAddressDTO(addressDTO);
        return customerDTO;
    }

    @Override
    public Integer addCustomer(CustomerDTO customerDTO) throws CEAException {
        Customer customer = new Customer();
        customer.setDateOfBirth(customerDTO.getDateOfBirth());
        customer.setEmailId(customerDTO.getEmailId());
        customer.setName(customerDTO.getName());
        customer.setCustomerId(customerDTO.getCustomerId());
        Address address = new Address();
        address.setStreet(customerDTO.getAddressDTO().getStreet());
        address.setCity(customerDTO.getAddressDTO().getCity());
        customer.setAddress(address);
        customerRespository.save(customer);
        return customer.getCustomerId();
    }

    @Override
    public void updateCustomer(Integer customerId, String emailId) throws CEAException {
        Optional<Customer> customer = customerRespository.findById(customerId);
        Customer c = customer.orElseThrow(() -> new CEAException("Service.CUSTOMER_NOT_FOUND"));
        c.setEmailId(emailId);
    }

    @Override
    public void deleteCustomer(Integer customerId) throws CEAException {
        Optional<Customer> customer = customerRespository.findById(customerId);
        customer.orElseThrow(() -> new CEAException("Service.CUSTOMER_NOT_FOUND"));
        customerRespository.deleteById(customerId);
    }

    @Override
    public List<CustomerDTO> getAllCustomers() throws CEAException {
        Iterable<Customer> customers = customerRespository.findAll();
        List<CustomerDTO> customerDTOs = new ArrayList<>();
        customers.forEach(customer -> {
            CustomerDTO customerDTO = new CustomerDTO();
            customerDTO.setCustomerId(customer.getCustomerId());
            customerDTO.setDateOfBirth(customer.getDateOfBirth());
            customerDTO.setEmailId(customer.getEmailId());
            customerDTO.setName(customer.getName());

            AddressDTO addressDTO = new AddressDTO();
            addressDTO.setAddressId(customer.getAddress().getAddressId());
            addressDTO.setStreet(customer.getAddress().getStreet());
            addressDTO.setCity(customer.getAddress().getCity());
            customerDTO.setAddressDTO(addressDTO);
            customerDTOs.add(customerDTO);
        });
        if (customerDTOs.isEmpty())
            throw new CEAException("Service.CUSTOMERS_NOT_FOUND");
        return customerDTOs;
    }
}
