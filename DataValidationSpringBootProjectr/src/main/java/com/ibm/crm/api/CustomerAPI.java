package com.ibm.crm.api;

import com.ibm.crm.dto.CustomerDTO;
import com.ibm.crm.entity.Customer;
import com.ibm.crm.service.CustomerService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/cea")
@CrossOrigin(origins = "*")
@Validated
public class CustomerAPI {
    @Autowired
    private CustomerService customerService;

    @Autowired
    private Environment environment;

    @GetMapping(value = "/customers")
    public ResponseEntity<List<CustomerDTO>> getAllCustomerDetails() throws Exception {
        List<CustomerDTO> customerList = customerService.getAllCustomers();
        return  new ResponseEntity<>(customerList, HttpStatus.OK);
    }
    @GetMapping(value = "/customers/{customerId}")
    public ResponseEntity<CustomerDTO> getCustomerDetails(@PathVariable @Min(value = 1, message = "Customer id should be between 1 and 4")
                                                                        @Max(value = 4, message = "Customer id should be between 1 and 4") Integer customerId)  throws Exception  {
        CustomerDTO customerDTO = customerService.getCustomer(customerId);
        ResponseEntity<CustomerDTO> response = new ResponseEntity<CustomerDTO>(customerDTO, HttpStatus.OK);
        return response;
    }
    @PostMapping(value = "/customers")
    public ResponseEntity<String> addCustomer(@Valid @RequestBody CustomerDTO customerDTO) throws Exception {
        Integer customerId = customerService.addCustomer(customerDTO);
        String successMessage = environment.getProperty("API.INSERT_SUCCESS") + customerId;
        return new ResponseEntity<>(successMessage, HttpStatus.CREATED);
    }
    @PutMapping(value = "/customers/{customerId}")
    public ResponseEntity<String> updateCustomer(@PathVariable Integer customerId, @RequestBody CustomerDTO customer)
            throws Exception {
        customerService.updateCustomer(customerId, customer.getEmailId());
        String successMessage = environment.getProperty("API.UPDATE_SUCCESS");
        return new ResponseEntity<>(successMessage, HttpStatus.OK);
    }
    @DeleteMapping(value = "/customers/{customerId}")
    public ResponseEntity<String> deleteCustomer(@PathVariable Integer customerId) throws Exception {
        customerService.deleteCustomer(customerId);
        String successMessage = environment.getProperty("API.DELETE_SUCCESS");
        return new ResponseEntity<>(successMessage, HttpStatus.OK);
    }
}