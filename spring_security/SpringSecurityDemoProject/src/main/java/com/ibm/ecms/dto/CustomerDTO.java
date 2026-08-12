package com.ibm.ecms.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Pattern;

import java.time.LocalDate;

public class CustomerDTO {

    private Integer customerId;

    @Email(message = "{customer.emailid.invalid}")
    @NotNull(message = "{customer.emailid.absent}")
    private String emailId;

    @NotNull(message = "{customer.name.absent}")
    @Pattern(regexp = "[A-Za-z]+( [A-Za-z]+)*", message = "{customer.name.invalid}")
    private String name;

    private String password;

    @PastOrPresent(message = "{customer.dob.invalid}")
    private LocalDate dateOfBirth;

    @NotNull
    @Valid
    private AddressDTO addressDTO;

    public Integer getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Integer customerId) {
        this.customerId = customerId;
    }

    public String getEmailId() {
        return emailId;
    }

    public void setEmailId(String emailId) {
        this.emailId = emailId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public AddressDTO getAddressDTO() {
        return addressDTO;
    }

    public void setAddressDTO(AddressDTO addressDTO) {
        this.addressDTO = addressDTO;
    }

    @Override
    public String toString() {
        return "CustomerDTO{" +
                "customerId=" + customerId +
                ", emailId='" + emailId + '\'' +
                ", name='" + name + '\'' +
                ", dateOfBirth=" + dateOfBirth +
                ", addressDTO=" + addressDTO +
                '}';
    }
}
