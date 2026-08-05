package com.cea.hrms.sevice;

import com.cea.hrms.entity.User;
import com.cea.hrms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User register(User user){
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return repository.save(user);
    }

    public Optional<User> login(String email, String password){
        Optional<User> user=repository.findByEmail(email);
        if(user.isPresent() &&
                passwordEncoder.matches(password,user.get().getPassword())){
            return user;
        }

        return Optional.empty();
    }

}
