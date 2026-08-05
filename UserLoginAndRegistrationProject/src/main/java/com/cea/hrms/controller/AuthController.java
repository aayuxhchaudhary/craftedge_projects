package com.cea.hrms.controller;

import com.cea.hrms.entity.User;
import com.cea.hrms.sevice.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@CrossOrigin
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    UserService service;

    @PostMapping("/register")
    public User register(@RequestBody User user){

        return service.register(user);
    }

    @PostMapping("/login")
    public String login(@RequestBody User user){

        Optional<User> result =
                service.login(user.getEmail(), user.getPassword());

        if(result.isPresent()){
            return "Login Successful";
        }

        return "Invalid Credentials";
    }

}