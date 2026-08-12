package com.ibm.ecms.service;


import com.ibm.ecms.dto.AddressDTO;
import com.ibm.ecms.dto.CustomerDTO;
import com.ibm.ecms.entity.Address;
import com.ibm.ecms.entity.Customer;
import com.ibm.ecms.exception.CEAException;
import com.ibm.ecms.repository.CustomerRepository;
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
    private CustomerRepository customerRepository;

    @Override
    public CustomerDTO getCustomer(Integer customerId) throws CEAException {
        Optional<Customer> optional = customerRepository.findById(customerId);
        Customer customer = optional.orElseThrow(() -> new CEAException("Service.CUSTOMER_NOT_FOUND"));
        CustomerDTO customerDTO = new CustomerDTO();
        customerDTO.setCustomerId(customer.getCustomerId());
        customerDTO.setDateOfBirth(customer.getDateOfBirth());
        customerDTO.setEmailId(customer.getEmailId());
        customerDTO.setName(customer.getName());
        customerDTO.setPassword(customer.getPassword());
        AddressDTO addressDTO = new AddressDTO();
        addressDTO.setAddressId(customer.getAddress().getAddressId());
        addressDTO.setStreet(customer.getAddress().getStreet());
        addressDTO.setCity(customer.getAddress().getCity());
        customerDTO.setAddressDTO(addressDTO);
        return customerDTO;
    }

    @Override
    public Integer addCustomer(CustomerDTO customerDTO) throws CEAException {
        if (customerRepository.existsByEmailId(customerDTO.getEmailId())) {
            throw new CEAException("Service.EMAIL_ALREADY_EXISTS");
        }
        Customer customer = new Customer();
        customer.setDateOfBirth(customerDTO.getDateOfBirth());
        customer.setEmailId(customerDTO.getEmailId());
        customer.setName(customerDTO.getName());
        customer.setPassword(customerDTO.getPassword());
        Address address = new Address();
        address.setStreet(customerDTO.getAddressDTO().getStreet());
        address.setCity(customerDTO.getAddressDTO().getCity());
        customer.setAddress(address);
        customerRepository.save(customer);
        return customer.getCustomerId();
    }

    @Override
    public void updateCustomer(Integer customerId, String emailId) throws CEAException {
        Optional<Customer> customer = customerRepository.findById(customerId);
        Customer c = customer.orElseThrow(() -> new CEAException("Service.CUSTOMER_NOT_FOUND"));
        c.setEmailId(emailId);
    }

    @Override
    public void updateCustomerDetails(Integer customerId, CustomerDTO customerDTO) throws CEAException {
        Optional<Customer> customer = customerRepository.findById(customerId);
        Customer c = customer.orElseThrow(() -> new CEAException("Service.CUSTOMER_NOT_FOUND"));
        if (customerDTO.getName() != null && !customerDTO.getName().isEmpty()) {
            c.setName(customerDTO.getName());
        }
        if (customerDTO.getEmailId() != null && !customerDTO.getEmailId().isEmpty()) {
            c.setEmailId(customerDTO.getEmailId());
        }
        if (customerDTO.getDateOfBirth() != null) {
            c.setDateOfBirth(customerDTO.getDateOfBirth());
        }
        if (customerDTO.getPassword() != null && !customerDTO.getPassword().isEmpty()) {
            c.setPassword(customerDTO.getPassword());
        }
        if (customerDTO.getAddressDTO() != null) {
            if (c.getAddress() == null) {
                Address address = new Address();
                c.setAddress(address);
            }
            if (customerDTO.getAddressDTO().getStreet() != null && !customerDTO.getAddressDTO().getStreet().isEmpty()) {
                c.getAddress().setStreet(customerDTO.getAddressDTO().getStreet());
            }
            if (customerDTO.getAddressDTO().getCity() != null && !customerDTO.getAddressDTO().getCity().isEmpty()) {
                c.getAddress().setCity(customerDTO.getAddressDTO().getCity());
            }
        }
    }

    @Override
    public void deleteCustomer(Integer customerId) throws CEAException {
        Optional<Customer> customer = customerRepository.findById(customerId);
        customer.orElseThrow(() -> new CEAException("Service.CUSTOMER_NOT_FOUND"));
        customerRepository.deleteById(customerId);
    }

    @Override
    public List<CustomerDTO> getAllCustomers() throws CEAException {
        Iterable<Customer> customers = customerRepository.findAll();
        List<CustomerDTO> customerDTOs = new ArrayList<>();
        customers.forEach(customer -> {
            CustomerDTO customerDTO = new CustomerDTO();
            customerDTO.setCustomerId(customer.getCustomerId());
            customerDTO.setDateOfBirth(customer.getDateOfBirth());
            customerDTO.setEmailId(customer.getEmailId());
            customerDTO.setName(customer.getName());
            customerDTO.setPassword(customer.getPassword());

            AddressDTO addressDTO = new AddressDTO();
            addressDTO.setAddressId(customer.getAddress().getAddressId());
            addressDTO.setStreet(customer.getAddress().getStreet());
            addressDTO.setCity(customer.getAddress().getCity());
            customerDTO.setAddressDTO(addressDTO);
            customerDTOs.add(customerDTO);
        });
        return customerDTOs;
    }

    @Override
    public CustomerDTO loginCustomer(String emailId, String password) throws CEAException {
        Optional<Customer> optional = customerRepository.findByEmailId(emailId);
        Customer customer = optional.orElseThrow(() -> new CEAException("Service.INVALID_CREDENTIALS"));
        
        if (password == null || !password.equals(customer.getPassword())) {
            throw new CEAException("Service.INVALID_CREDENTIALS");
        }

        CustomerDTO customerDTO = new CustomerDTO();
        customerDTO.setCustomerId(customer.getCustomerId());
        customerDTO.setDateOfBirth(customer.getDateOfBirth());
        customerDTO.setEmailId(customer.getEmailId());
        customerDTO.setName(customer.getName());
        customerDTO.setPassword(customer.getPassword());

        if (customer.getAddress() != null) {
            AddressDTO addressDTO = new AddressDTO();
            addressDTO.setAddressId(customer.getAddress().getAddressId());
            addressDTO.setStreet(customer.getAddress().getStreet());
            addressDTO.setCity(customer.getAddress().getCity());
            customerDTO.setAddressDTO(addressDTO);
        }
        return customerDTO;
    }
}
